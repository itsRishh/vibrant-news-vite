import { Id } from "../../convex/_generated/dataModel";


type ArticleSection =
    | "breakingNews"
    | "latestNews"
    | "regionalNews"
    | "sports";

type ArticleSubmitParams = {
    section: ArticleSection;
    data: Record<string, unknown>;
    media?: File | null;
    generateUploadUrl: () => Promise<string>;
    mutation: (args: Record<string, unknown>) => Promise<unknown>;
};

export async function articleSubmit({
    section,
    data,
    media,
    generateUploadUrl,
    mutation,
}: ArticleSubmitParams) {
    try {
        let mediaData: {
            imageId?: Id<"_storage">;
            mediaType?: "image" | "video";
        } = {};

        /*
         * 1. Upload media if provided
         */
        if (media) {
            const uploadUrl = await generateUploadUrl();

            const uploadResponse = await fetch(uploadUrl, {
                method: "POST",
                headers: {
                    "Content-Type": media.type,
                },
                body: media,
            });

            if (!uploadResponse.ok) {
                throw new Error("Media upload failed.");
            }

            const { storageId } = (await uploadResponse.json()) as {
                storageId: string;
            };

            mediaData = {
                imageId: storageId as Id<"_storage">,
                mediaType: media.type.startsWith("video/")
                    ? "video"
                    : "image",
            };
        }

        /*
         * 2. Build final payload
         *
         * `data` comes from the individual section form.
         * Common media information is added here.
         */
        const payload = {
            ...data,
            ...mediaData,
        };

        /*
         * 3. Send to the section's Convex mutation
         */
        await mutation(payload);

        /*
         * 4. Return useful information to the form
         */
        return {
            success: true,
            section,
            storageId: mediaData.imageId,
        };
    } catch (error) {
        console.error(`Failed to submit ${section}:`, error);

        return {
            success: false,
            section,
            error:
                error instanceof Error
                    ? error.message
                    : "Could not publish the article.",
        };
    }
}
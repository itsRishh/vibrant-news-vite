import { useMutation, useQuery } from "convex/react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

const MAX_MEDIA_SIZE = 50 * 1024 * 1024;
const POSITION_OPTIONS = [
    { value: 1, label: "Hero 1 (large left)" },
    { value: 2, label: "Hero 2 (large right)" },
    { value: 3, label: "Sub news 1" },
    { value: 4, label: "Sub news 2" },
    { value: 5, label: "Sub news 3" },
    { value: 6, label: "Sub news 4" },
] as const;

export const Route = createFileRoute("/admin/breaking-news")({
    beforeLoad: () => {
        if (import.meta.env["VITE_APP_SURFACE"] !== "admin") {
            throw notFound();
        }
    },
    component: AdminBreakingNews,
});

function AdminBreakingNews() {
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const createBreakingNews = useMutation(api.breakingNews.create);
    const moveBreakingNews = useMutation(api.breakingNews.move);
    const publishedArticles = useQuery(api.breakingNews.list);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("BREAKING");
    const [badge, setBadge] = useState("BREAKING");
    const [excerpt, setExcerpt] = useState("");
    const [position, setPosition] = useState(1);
    const [media, setMedia] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [featured, setFeatured] = useState(true);
    const [published, setPublished] = useState(true);
    const [status, setStatus] = useState<"idle" | "uploading" | "publishing" | "success">("idle");
    const [error, setError] = useState("");
    const [positionMessage, setPositionMessage] = useState("");
    const [movingArticleId, setMovingArticleId] = useState<string | null>(null);

    useEffect(() => {
        if (!media) {
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(media);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [media]);

    function onMediaChange(file: File | undefined) {
        setError("");
        if (!file) {
            setMedia(null);
            return;
        }
        if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
            setError("Please select an image or video file.");
            setMedia(null);
            return;
        }
        if (file.size > MAX_MEDIA_SIZE) {
            setError("Please select an image or video smaller than 50 MB.");
            setMedia(null);
            return;
        }
        setMedia(file);
    }

    async function onPositionChange(articleId: string, nextPosition: number) {
        setError("");
        setPositionMessage("");
        setMovingArticleId(articleId);
        try {
            await moveBreakingNews({
                id: articleId as Id<"breakingNews">,
                position: nextPosition,
            });
            setPositionMessage("Position updated successfully.");
        } catch (movementError) {
            console.error(movementError);
            setError("Could not move this article. Please try again.");
        } finally {
            setMovingArticleId(null);
        }
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!title.trim() || !category || !excerpt.trim() || !media) {
            setError("Headline, category, excerpt, and media file are required.");
            return;
        }

        try {
            setError("");
            setStatus("uploading");
            const uploadUrl = await generateUploadUrl({});
            const uploadResponse = await fetch(uploadUrl, {
                method: "POST",
                headers: { "Content-Type": media.type },
                body: media,
            });
            if (!uploadResponse.ok) throw new Error("Image upload failed.");
            const { storageId } = (await uploadResponse.json()) as { storageId: string };

            setStatus("publishing");
            await createBreakingNews({
                title: title.trim(),
                category,
                badge,
                excerpt: excerpt.trim(),
                imageId: storageId as Id<"_storage">,
                mediaType: media.type.startsWith("video/") ? "video" : "image",
                slug: `${title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
                featured,
                published,
                order: position,
                position,
                publishedAt: Date.now(),
            });
            setStatus("success");
            setTitle("");
            setExcerpt("");
            setPosition(1);
            setMedia(null);
        } catch (submissionError) {
            console.error(submissionError);
            setError("Could not publish this article. Please try again.");
            setStatus("idle");
        }
    }

    const isSubmitting = status === "uploading" || status === "publishing";
    const articlesByPosition = new Map(
        (publishedArticles ?? []).map((article) => [article.position, article]),
    );
    const selectedPositionArticle = articlesByPosition.get(position);

    return (
        <main className="mx-auto min-h-screen max-w-[1250px] bg-background px-4 py-10 text-foreground sm:px-6">
            <div className="mb-8 border-b border-border pb-5">
                <p className="text-xs font-bold tracking-widest text-primary uppercase">Development admin</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight">Publish Breaking News</h1>
                <p className="mt-2 text-sm text-muted-foreground">Upload an image to Convex Storage and publish one Breaking News test article.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5 flex items-start justify-center gap-4">
                <div className="col-1 w-[50%] flex flex-col gap-5 items-center justify-start">
                    <label className="block text-sm font-bold w-full">
                        Headline
                        <input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 w-full border border-border px-3 py-2 font-normal" placeholder="Test News From Admin Panel" />
                    </label>

                    <div className="grid gap-5 sm:grid-cols-2 w-full">
                        <label className="block text-sm font-bold">
                            Category
                            <select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 w-full border border-border bg-background px-3 py-2 font-normal">
                                <option>BREAKING</option>
                                <option>REGIONAL</option>
                            </select>
                        </label>
                        <label className="block text-sm font-bold">
                            Badge
                            <select value={badge} onChange={(event) => setBadge(event.target.value)} className="mt-2 w-full border border-border bg-background px-3 py-2 font-normal">
                                <option>BREAKING</option>
                                <option>EXCLUSIVE</option>
                            </select>
                        </label>
                    </div>

                    <label className="block text-sm font-bold w-full">
                        Excerpt
                        <textarea value={excerpt} onChange={(event) => setExcerpt(event.target.value)} className="mt-2 min-h-28 w-full border border-border px-3 py-2 font-normal" placeholder="A short summary for the breaking news card." />
                    </label>

                    <label className="block text-sm font-bold w-full">
                        Image or video
                        <input type="file" accept="image/*,video/*" onChange={(event) => onMediaChange(event.target.files?.[0])} className="mt-2 block w-full border border-border px-3 py-2 text-sm font-normal" />
                    </label>
                    {previewUrl && media?.type.startsWith("video/") ? (
                        <video src={previewUrl} controls muted playsInline className="max-h-72 w-full object-cover" />
                    ) : previewUrl ? (
                        <img src={previewUrl} alt="Selected article preview" className="max-h-72 w-full object-cover" />
                    ) : null}

                    <div className="flex flex-wrap gap-5 text-sm w-full">
                        <label className="flex items-center gap-2"><input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} /> Featured</label>
                        <label className="flex items-center gap-2"><input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} /> Published</label>
                    </div>

                    {error && <p className="border border-primary/30 bg-tint px-3 py-2 text-sm text-primary">{error}</p>}
                    {status === "success" && <p className="border border-green-600/30 bg-green-50 px-3 py-2 text-sm text-green-700">Article published successfully.</p>}
                    <button type="submit" disabled={isSubmitting} className="w-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60">
                        {status === "uploading" ? "Uploading image..." : status === "publishing" ? "Publishing..." : "Publish article"}
                    </button>
                </div>

                <div className="col-2 w-[50%] flex flex-col gap-5 items-center justify-start">
                    <label className="block text-sm font-bold w-full">
                        Display position
                        <select value={position} onChange={(event) => setPosition(Number(event.target.value))} className="mt-2 w-full border border-border bg-background px-3 py-2 font-normal">
                            {POSITION_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        <span className="mt-1 block text-xs font-normal text-muted-foreground">Choose which of the two hero or four sub-news slots should show this article.</span>
                    </label>

                    <section className="border border-border bg-muted/30 p-4 w-full" aria-labelledby="position-status-heading">
                        <div className="flex items-baseline justify-between gap-4">
                            <h2 id="position-status-heading" className="text-sm font-black uppercase">Published positions</h2>
                            <span className="text-xs text-muted-foreground">Live status</span>
                        </div>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            {POSITION_OPTIONS.map((option) => {
                                const article = articlesByPosition.get(option.value);
                                return (
                                    <div key={option.value} className="flex min-w-0 items-start justify-between gap-3 border border-border bg-background px-3 py-2 text-xs">
                                        <div className="min-w-0">
                                            <p className="font-bold">{option.label}</p>
                                            <p className="mt-1 truncate text-muted-foreground">{article?.title ?? "Available"}</p>
                                        </div>
                                        {article ? (
                                            <div className="flex shrink-0 items-center gap-1">
                                                <span className="h-2.5 w-2.5 rounded-full bg-green-600" aria-label="Updated" title="Updated" />
                                                <select
                                                    aria-label={`Move ${article.title}`}
                                                    value={article.position}
                                                    disabled={movingArticleId === article._id}
                                                    onChange={(event) => onPositionChange(article._id, Number(event.target.value))}
                                                    className="w-28 border border-border bg-background px-1 py-1 text-[10px] font-bold disabled:opacity-60"
                                                >
                                                    {POSITION_OPTIONS.map((positionOption) => (
                                                        <option key={positionOption.value} value={positionOption.value}>
                                                            {positionOption.value === article.position ? "Current" : positionOption.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        ) : (
                                            <span className="flex shrink-0 items-center gap-1 font-bold text-red-700">
                                                <span className="h-2.5 w-2.5 rounded-full bg-red-600" aria-label="Available" title="Available" />
                                                Available
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        {selectedPositionArticle && (
                            <p className="mt-3 text-xs text-primary">This will replace the current article in {POSITION_OPTIONS.find((option) => option.value === position)?.label}.</p>
                        )}
                        {positionMessage && <p className="mt-3 text-xs font-bold text-green-700">{positionMessage}</p>}
                    </section>
                </div>
            </form>
        </main>
    );
}

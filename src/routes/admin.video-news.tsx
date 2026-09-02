import { useMutation, useQuery } from "convex/react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

const MAX_MEDIA_SIZE = 100 * 1024 * 1024;
const FULL_SLOTS = [1, 2, 3] as const;

export const Route = createFileRoute("/admin/video-news")({
    beforeLoad: () => {
        if (import.meta.env["VITE_APP_SURFACE"] !== "admin") throw notFound();
    },
    component: AdminVideoNews,
});

function AdminVideoNews() {
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const createVideo = useMutation(api.videos.create);
    const videos = useQuery(api.videos.list);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [kind, setKind] = useState<"full" | "short">("full");
    const [slot, setSlot] = useState(1);
    const [media, setMedia] = useState<File | null>(null);
    const [status, setStatus] = useState<"idle" | "uploading" | "publishing" | "success">("idle");
    const [error, setError] = useState("");

    useEffect(() => {
        setError("");
    }, [kind]);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!title.trim() || !media) {
            setError("Title and video file are required.");
            return;
        }
        if (!media.type.startsWith("video/")) {
            setError("Please select a video file.");
            return;
        }
        if (media.size > MAX_MEDIA_SIZE) {
            setError("Please select a video smaller than 100 MB.");
            return;
        }

        try {
            setError("");
            setStatus("uploading");
            const uploadUrl = await generateUploadUrl({});
            const response = await fetch(uploadUrl, { method: "POST", headers: { "Content-Type": media.type }, body: media });
            if (!response.ok) throw new Error("Video upload failed.");
            const { storageId } = (await response.json()) as { storageId: string };
            setStatus("publishing");
            await createVideo({
                title: title.trim(),
                description: description.trim(),
                imageId: storageId as Id<"_storage">,
                mediaType: "video",
                kind,
                ...(kind === "full" ? { slot } : {}),
                published: true,
                publishedAt: Date.now(),
            });
            setTitle("");
            setDescription("");
            setMedia(null);
            setStatus("success");
        } catch (submissionError) {
            console.error(submissionError);
            setError("Could not publish this video. Please try again.");
            setStatus("idle");
        }
    }

    const fullVideos = videos?.filter((video) => video.kind === "full");
    const shortsCount = videos?.filter((video) => video.kind === "short").length ?? 0;
    const isSubmitting = status === "uploading" || status === "publishing";

    return (
        <main className="mx-auto min-h-screen max-w-[1250px] bg-background px-4 py-10 text-foreground sm:px-6">
            <div className="mb-8 border-b border-border pb-5">
                <Link to="/admin" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Back to admin</Link>
                <p className="text-xs font-bold tracking-widest text-primary uppercase">Development admin</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight">Manage Videos</h1>
                <p className="mt-2 text-sm text-muted-foreground">Upload three landscape video slots and as many shorts as needed.</p>
            </div>

            <form onSubmit={onSubmit} className="grid gap-5 lg:grid-cols-2">
                <div className="space-y-5">
                    <label className="block text-sm font-bold">Title<input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 w-full border border-border px-3 py-2 font-normal" placeholder="Video headline" /></label>
                    <label className="block text-sm font-bold">Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} className="mt-2 min-h-28 w-full border border-border px-3 py-2 font-normal" placeholder="A short description" /></label>
                    <label className="block text-sm font-bold">Video file<input type="file" accept="video/*" onChange={(event) => setMedia(event.target.files?.[0] ?? null)} className="mt-2 block w-full border border-border px-3 py-2 text-sm font-normal" /></label>
                </div>
                <div className="space-y-5">
                    <label className="block text-sm font-bold">Video type<select value={kind} onChange={(event) => setKind(event.target.value as "full" | "short")} className="mt-2 w-full border border-border bg-background px-3 py-2 font-normal"><option value="full">Landscape video</option><option value="short">Short</option></select></label>
                    {kind === "full" && <label className="block text-sm font-bold">Landscape slot<select value={slot} onChange={(event) => setSlot(Number(event.target.value))} className="mt-2 w-full border border-border bg-background px-3 py-2 font-normal">{FULL_SLOTS.map((slotNumber) => <option key={slotNumber} value={slotNumber}>Video {slotNumber}</option>)}</select></label>}
                    {error && <p className="border border-primary/30 bg-tint px-3 py-2 text-sm text-primary">{error}</p>}
                    {status === "success" && <p className="border border-green-600/30 bg-green-50 px-3 py-2 text-sm text-green-700">Video published successfully.</p>}
                    <button type="submit" disabled={isSubmitting} className="w-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60">{status === "uploading" ? "Uploading video..." : status === "publishing" ? "Publishing..." : "Publish video"}</button>
                </div>
            </form>

            <section className="mt-8 border border-border bg-muted/30 p-4" aria-labelledby="video-status-heading">
                <div className="flex items-baseline justify-between gap-4"><h2 id="video-status-heading" className="text-sm font-black uppercase">Video status</h2><span className="text-xs text-muted-foreground">{shortsCount} shorts uploaded</span></div>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">{FULL_SLOTS.map((slotNumber) => { const video = fullVideos?.find((item) => item.slot === slotNumber); return <div key={slotNumber} className="border border-border bg-background p-3 text-xs"><p className="font-bold">Landscape video {slotNumber}</p><p className="mt-1 truncate text-muted-foreground">{video?.title ?? "Available"}</p></div>; })}</div>
            </section>
        </main>
    );
}

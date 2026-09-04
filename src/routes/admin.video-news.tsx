import { useMutation, useQuery } from "convex/react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

const MAX_MEDIA_SIZE = 100 * 1024 * 1024;
const FULL_SLOTS = [1, 2, 3] as const;

export const Route = createFileRoute("/admin/video-news")({
    component: AdminVideoNews,
});

function AdminVideoNews() {
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const createVideo = useMutation(api.videos.create);
    const updateVideo = useMutation(api.videos.update);
    const moveVideo = useMutation(api.videos.move);
    const videos = useQuery(api.videos.adminList);
    const [editingVideoId, setEditingVideoId] = useState<Id<"videos"> | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [kind, setKind] = useState<"full" | "short">("full");
    const [slot, setSlot] = useState(1);
    const [media, setMedia] = useState<File | null>(null);
    const [status, setStatus] = useState<"idle" | "uploading" | "publishing" | "success">("idle");
    const [error, setError] = useState("");
    const [positionMessage, setPositionMessage] = useState("");
    const [movingVideoId, setMovingVideoId] = useState<Id<"videos"> | null>(null);

    useEffect(() => {
        setError("");
    }, [kind]);

    function startEditing(video: NonNullable<typeof videos>[number]) {
        setEditingVideoId(video._id);
        setTitle(video.title);
        setDescription(video.description);
        setKind(video.kind);
        setSlot(video.slot ?? 1);
        setMedia(null);
        setStatus("idle");
        setError("");
    }

    function cancelEditing() {
        setEditingVideoId(null);
        setTitle("");
        setDescription("");
        setKind("full");
        setSlot(1);
        setMedia(null);
        setError("");
        setStatus("idle");
    }

    async function onPositionChange(videoId: Id<"videos">, nextSlot: number) {
        setError("");
        setPositionMessage("");
        setMovingVideoId(videoId);

        try {
            await moveVideo({ id: videoId, slot: nextSlot });
            setPositionMessage("Position updated successfully.");
        } catch (movementError) {
            console.error(movementError);
            setError("Could not change this video's position. Please try again.");
        } finally {
            setMovingVideoId(null);
        }
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!title.trim() || (!editingVideoId && !media)) {
            setError(editingVideoId ? "Title is required." : "Title and video file are required.");
            return;
        }
        if (media && !media.type.startsWith("video/")) {
            setError("Please select a video file.");
            return;
        }
        if (media && media.size > MAX_MEDIA_SIZE) {
            setError("Please select a video smaller than 100 MB.");
            return;
        }

        try {
            setError("");
            let storageId: Id<"_storage"> | undefined;
            if (media) {
                setStatus("uploading");
                const uploadUrl = await generateUploadUrl({});
                const response = await fetch(uploadUrl, { method: "POST", headers: { "Content-Type": media.type }, body: media });
                if (!response.ok) throw new Error("Video upload failed.");
                const uploaded = (await response.json()) as { storageId: string };
                storageId = uploaded.storageId as Id<"_storage">;
            }
            setStatus("publishing");
            if (editingVideoId) {
                await updateVideo({
                    id: editingVideoId,
                    title: title.trim(),
                    description: description.trim(),
                    ...(storageId ? { imageId: storageId } : {}),
                    kind,
                    ...(kind === "full" ? { slot } : {}),
                    published: true,
                    publishedAt: Date.now(),
                });
            } else {
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
            }
            const wasEditing = Boolean(editingVideoId);
            setEditingVideoId(null);
            setTitle("");
            setDescription("");
            setMedia(null);
            setStatus("success");
            setError(wasEditing ? "Video updated successfully." : "Video published successfully.");
        } catch (submissionError) {
            console.error(submissionError);
            setError(editingVideoId ? "Could not update this video. Please try again." : "Could not publish this video. Please try again.");
            setStatus("idle");
        }
    }

    const fullVideos = videos?.filter((video) => video.kind === "full");
    const shortsCount = videos?.filter((video) => video.kind === "short").length ?? 0;
    const isSubmitting = status === "uploading" || status === "publishing";

    return (
        <main className="mx-auto min-h-screen max-w-[1250px] bg-background px-4 py-10 text-foreground sm:px-6">
            <div className="mb-8 border-b border-border pb-5">
                <Link to="/admin" className="mb-10 inline-flex items-center gap-2 text-xs font-bold text-white bg-primary px-3 py-2 hover:underline"><ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back to admin
                </Link>

                <p className="text-xs font-bold tracking-widest text-primary uppercase">Development admin</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight">Manage Videos</h1>
                <p className="mt-2 text-sm text-muted-foreground">Upload three landscape video slots and as many shorts as needed.</p>
            </div>

            <div className="wrapper mb-10 pb-1 border-b border-border">
                <section className="my-8 border border-primary bg-muted/30 p-4" aria-labelledby="video-status-heading">
                    <div className="flex items-baseline justify-between gap-4"><h2 id="video-status-heading" className="text-sm font-black uppercase">Video status</h2><span className="text-xs text-muted-foreground">{shortsCount} shorts uploaded</span></div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-3">{FULL_SLOTS.map((slotNumber) => { const video = fullVideos?.find((item) => item.slot === slotNumber); return <div key={slotNumber} className="flex min-w-0 items-start justify-between gap-3 border border-border bg-background p-3 text-xs"><div className="min-w-0"><p className="font-bold">Landscape video {slotNumber}</p><p className="mt-1 truncate text-muted-foreground">{video?.title ?? "Available"}</p>{video && <button type="button" onClick={() => startEditing(video)} className="mt-3 inline-flex items-center gap-1 font-bold text-primary hover:underline"><Pencil className="h-3 w-3" aria-hidden="true" />Edit</button>}</div>{video ? <div className="flex shrink-0 items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-green-600" aria-label="Uploaded" title="Uploaded" /><select aria-label={`Move ${video.title}`} value={video.slot} disabled={movingVideoId === video._id} onChange={(event) => onPositionChange(video._id, Number(event.target.value))} className="w-24 border border-border bg-background px-1 py-1 text-[10px] font-bold disabled:opacity-60">{FULL_SLOTS.map((position) => <option key={position} value={position}>{position === video.slot ? "Current" : `Video ${position}`}</option>)}</select></div> : <span className="flex shrink-0 items-center gap-1 font-bold text-red-700"><span className="h-2.5 w-2.5 rounded-full bg-red-600" aria-label="Available" title="Available" />Available</span>}</div>; })}</div>
                    {positionMessage && <p className="mt-3 text-xs font-bold text-green-700">{positionMessage}</p>}
                    <div className="mt-4 space-y-2">{videos?.filter((video) => video.kind === "short").map((video) => <div key={video._id} className="flex items-center justify-between gap-3 border border-border bg-background p-3 text-xs"><div className="min-w-0"><p className="font-bold">Short</p><p className="truncate text-muted-foreground">{video.title}</p></div><button type="button" onClick={() => startEditing(video)} className="inline-flex shrink-0 items-center gap-1 font-bold text-primary hover:underline"><Pencil className="h-3 w-3" aria-hidden="true" />Edit</button></div>)}</div>
                </section>
            </div>

            <form onSubmit={onSubmit} className="">
                <div className="wrapper grid gap-5 lg:grid-cols-2 mb-5">
                    <div className="space-y-5">
                        <label className="block text-sm font-bold">Title<input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 w-full border border-border px-3 py-2 font-normal" placeholder="Video headline" /></label>
                        <label className="block text-sm font-bold">Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} className="mt-2 min-h-28 w-full border border-border px-3 py-2 font-normal" placeholder="A short description" /></label>
                        <label className="block text-sm font-bold">Video file<input type="file" accept="video/*" onChange={(event) => setMedia(event.target.files?.[0] ?? null)} className="mt-2 block w-full border border-border px-3 py-2 text-sm font-normal" />{editingVideoId && <span className="mt-1 block text-xs font-normal text-muted-foreground">Leave empty to keep the current video.</span>}</label>
                    </div>
                    <div className="space-y-5">
                        <label className="block text-sm font-bold">
                            Video type
                            <select value={kind} onChange={(event) => setKind(event.target.value as "full" | "short")} className="mt-2 w-full border border-border bg-background px-3 py-2 font-normal">
                                <option value="full">Landscape video</option>
                                <option value="short">Short</option>
                            </select>
                        </label>
                    </div>
                </div>

                <div className="buttons flex flex-col justify-start gap-5">
                    {kind === "full" && <label className="block text-sm font-bold">Landscape slot<select value={slot} onChange={(event) => setSlot(Number(event.target.value))} className="mt-2 w-full border border-border bg-background px-3 py-2 font-normal">{FULL_SLOTS.map((slotNumber) => <option key={slotNumber} value={slotNumber}>Video {slotNumber}</option>)}</select></label>}

                    {error && status !== "success" && <p className="border border-primary/30 bg-tint px-3 py-2 text-sm text-primary">{error}</p>}

                    {status === "success" && <p className="border border-green-600/30 bg-green-50 px-3 py-2 text-sm text-green-700">{error}</p>}

                    <div className="flex gap-2">
                        <button type="submit" disabled={isSubmitting} className="flex-1 bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60">
                            {status === "uploading" ? "Uploading video..." : status === "publishing" ? "Saving..." : editingVideoId ? "Save changes" : "Publish video"}
                        </button>
                        {editingVideoId && <button type="button" disabled={isSubmitting} onClick={cancelEditing} className="border border-border px-5 py-3 text-sm font-bold disabled:opacity-60">Cancel</button>}
                    </div>
                </div>
            </form>


        </main>
    );
}

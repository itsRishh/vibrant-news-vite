import { useMutation, useQuery } from "convex/react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

const MAX_MEDIA_SIZE = 50 * 1024 * 1024;
const SHORT_NEWS_MIN_POSITION = 6;
const SHORT_NEWS_MAX_POSITION = 11;

const isShortNewsPosition = (position: number) => position >= SHORT_NEWS_MIN_POSITION && position <= SHORT_NEWS_MAX_POSITION;

const POSITION_OPTIONS = [
    { value: 1, label: "Hero", group: "Hero" },
    { value: 2, label: "Sub hero 1", group: "Sub heroes" },
    { value: 3, label: "Sub hero 2", group: "Sub heroes" },
    { value: 4, label: "Sub hero 3", group: "Sub heroes" },
    { value: 5, label: "Sub hero 4", group: "Sub heroes" },
    { value: 6, label: "Short news 1", group: "Short news" },
    { value: 7, label: "Short news 2", group: "Short news" },
    { value: 8, label: "Short news 3", group: "Short news" },
    { value: 9, label: "Short news 4", group: "Short news" },
    { value: 10, label: "Short news 5", group: "Short news" },
    { value: 11, label: "Short news 6", group: "Short news" },
] as const;

export const Route = createFileRoute("/admin/latest-news")({
    beforeLoad: () => {
        if (import.meta.env["VITE_APP_SURFACE"] !== "admin") {
            throw notFound();
        }
    },
    component: AdminLatestNews,
});

function AdminLatestNews() {
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const createLatestNews = useMutation(api.latestNews.create);
    const moveLatestNews = useMutation(api.latestNews.move);
    const publishedArticles = useQuery(api.latestNews.list);

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [category, setCategory] = useState("LATEST");
    const [badge, setBadge] = useState("LATEST");
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

        const objectUrl = URL.createObjectURL(media);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
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
            await moveLatestNews({
                id: articleId as Id<"latestNews">,
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

        if (!title.trim() || !category || !excerpt.trim() || (requiresMediaForPosition && !media)) {
            setError(
                requiresMediaForPosition
                    ? "Headline, category, excerpt, and media file are required."
                    : "Headline, category, and excerpt are required.",
            );
            return;
        }

        try {
            setError("");
            let storageId: Id<"_storage"> | undefined;

            if (requiresMediaForPosition && media) {
                setStatus("uploading");

                const uploadUrl = await generateUploadUrl({});
                const uploadResponse = await fetch(uploadUrl, {
                    method: "POST",
                    headers: { "Content-Type": media.type },
                    body: media,
                });

                if (!uploadResponse.ok) {
                    throw new Error("Media upload failed.");
                }

                const response = (await uploadResponse.json()) as { storageId: string };
                storageId = response.storageId as Id<"_storage">;
            }

            setStatus("publishing");
            await createLatestNews({
                title: title.trim(),
                body: body.trim(),
                category,
                badge,
                excerpt: excerpt.trim(),
                imageId: storageId,
                mediaType: storageId && media ? (media.type.startsWith("video/") ? "video" : "image") : undefined,
                slug: `${title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
                featured,
                published,
                order: position,
                position,
                publishedAt: Date.now(),
            });

            setStatus("success");
            setTitle("");
            setBody("");
            setExcerpt("");
            setPosition(1);
            setMedia(null);
            setFeatured(true);
            setPublished(true);
        } catch (submissionError) {
            console.error(submissionError);
            setError("Could not publish this article. Please try again.");
            setStatus("idle");
        }
    }

    const isSubmitting = status === "uploading" || status === "publishing";
    const articlesByPosition = new Map((publishedArticles ?? []).map((article) => [article.position, article]));
    const selectedPositionArticle = articlesByPosition.get(position);
    const selectedPositionIsShortNews = isShortNewsPosition(position);
    const requiresMediaForPosition = !selectedPositionIsShortNews;

    return (
        <main className="mx-auto min-h-screen max-w-[1250px] bg-background px-4 py-10 text-foreground sm:px-6">
            <div className="mb-8 border-b border-border pb-5 lg:px-0 px-3">
                <Link to="/admin" className="mb-10 inline-flex items-center gap-2 text-xs font-bold text-white hover:underline bg-primary px-3 py-2">
                    <ArrowLeft className="h-2 w-2" aria-hidden="true" />
                    Back to admin
                </Link>
                <p className="text-xs font-bold tracking-widest text-primary uppercase">Development admin</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight">Publish Latest News</h1>
                <p className="mt-2 text-sm text-muted-foreground">Upload an image or video to Convex Storage and publish a latest-news article for the homepage layout.</p>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col  lg:items-start justify-center gap-4">
                <div className="wrapper flex w-full flex-col items-center justify-start gap-5 lg:flex-row lg:items-start">
                    <div className="flex lg:w-[50%] flex-col items-center justify-start gap-5">

                    <label className="block w-full text-sm font-bold">
                        Display position
                        <select
                            value={position}
                            onChange={(event) => {
                                const nextPosition = Number(event.target.value);
                                setPosition(nextPosition);
                                if (isShortNewsPosition(nextPosition)) {
                                    setMedia(null);
                                }
                            }}
                            className="mt-2 w-full border border-border bg-background px-3 py-2 font-normal"
                        >
                            {(["Hero", "Sub heroes", "Short news"] as const).map((group) => (
                                <optgroup key={group} label={group}>
                                    {POSITION_OPTIONS.filter((option) => option.group === group).map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                        <span className="mt-1 block text-xs font-normal text-muted-foreground">
                            Choose the hero, sub-hero, or short-news slot for this article.
                        </span>
                    </label>

                    <label className="block w-full text-sm font-bold">
                        Headline
                        <input
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            className="mt-2 w-full border border-border px-3 py-2 font-normal"
                            placeholder="Latest News Headline"
                        />
                    </label>

                    <div className="grid w-full gap-5 sm:grid-cols-2">
                        <label className="block text-sm font-bold">
                            Category
                            <select
                                value={category}
                                onChange={(event) => setCategory(event.target.value)}
                                className="mt-2 w-full border border-border bg-background px-3 py-2 font-normal"
                            >
                                <option>LATEST</option>
                                <option>POLITICS</option>
                                <option>SPORTS</option>
                                <option>BUSINESS</option>
                                <option>ENTERTAINMENT</option>
                                <option>REGIONAL</option>
                            </select>
                        </label>

                        <label className="block text-sm font-bold">
                            Badge
                            <select
                                value={badge}
                                onChange={(event) => setBadge(event.target.value)}
                                className="mt-2 w-full border border-border bg-background px-3 py-2 font-normal"
                            >
                                <option>LATEST</option>
                                <option>LIVE</option>
                                <option>EXCLUSIVE</option>
                                <option>ANALYSIS</option>
                            </select>
                        </label>
                    </div>

                    <label className="block w-full text-sm font-bold">
                        Excerpt
                        <textarea
                            value={excerpt}
                            onChange={(event) => setExcerpt(event.target.value)}
                            className="mt-2 min-h-28 w-full border border-border px-3 py-2 font-normal"
                            placeholder="A short summary for the latest news card."
                        />
                    </label>

                    <label className="block w-full text-sm font-bold">
                        Article body
                        <textarea
                            value={body}
                            onChange={(event) => setBody(event.target.value)}
                            className="mt-2 min-h-36 w-full border border-border px-3 py-2 font-normal"
                            placeholder="Full article content for the story popup."
                        />
                    </label>

                    {previewUrl && media?.type.startsWith("video/") ? (
                        <video src={previewUrl} controls muted playsInline className="max-h-72 w-full object-cover" />
                    ) : previewUrl ? (
                        <img src={previewUrl} alt="Selected article preview" className="max-h-72 w-full object-cover" />
                    ) : null}

                    <div className="flex w-full flex-wrap gap-5 text-sm">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} />
                            Featured
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} />
                            Published
                        </label>
                    </div>

                    {error && <p className="border border-primary/30 bg-tint px-3 py-2 text-sm text-primary">{error}</p>}
                    {status === "success" && (
                        <p className="border border-green-600/30 bg-green-50 px-3 py-2 text-sm text-green-700">
                            Article published successfully.
                        </p>
                    )}

                    
                    </div>

                    <div className="flex lg:w-[50%] flex-col items-center justify-start gap-5">
                        
                        {!selectedPositionIsShortNews && (
                            <label className="block w-full text-sm font-bold">
                                Image or video
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={(event) => onMediaChange(event.target.files?.[0])}
                                    className="mt-2 block w-full border border-border px-3 py-2 text-sm font-normal"
                                />
                            </label>
                        )}

                        <section className="w-full border border-border bg-muted/30 p-4" aria-labelledby="latest-position-status-heading">
                            <div className="flex items-baseline justify-between gap-4">
                                <h2 id="latest-position-status-heading" className="text-sm font-black uppercase">
                                    Published positions
                                </h2>
                                <span className="text-xs text-muted-foreground">Live status</span>
                            </div>

                            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {POSITION_OPTIONS.map((option) => {
                                    const article = articlesByPosition.get(option.value);

                                    return (
                                        <div
                                            key={option.value}
                                            className="flex min-w-0 items-start justify-between gap-3 border border-border bg-background px-3 py-2 text-xs"
                                        >
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{option.group}</p>
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
                                <p className="mt-3 text-xs text-primary">
                                    This will replace the current article in {POSITION_OPTIONS.find((option) => option.value === position)?.label}.
                                </p>
                            )}
                            {positionMessage && <p className="mt-3 text-xs font-bold text-green-700">{positionMessage}</p>}
                        </section>
                    </div>
                </div>

                <div className="buttons">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {status === "uploading" ? "Uploading media..." : status === "publishing" ? "Publishing..." : "Publish article"}
                    </button>
                </div>
            </form>
        </main>
    );
}

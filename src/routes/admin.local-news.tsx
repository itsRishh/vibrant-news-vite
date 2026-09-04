import { useMutation, useQuery } from "convex/react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

const MAX_MEDIA_SIZE = 50 * 1024 * 1024;
const POSITION_OPTIONS = [
  { value: 1, label: "Hero" },
  { value: 2, label: "Sub hero 1" },
  { value: 3, label: "Sub hero 2" },
  { value: 4, label: "Sub hero 3" },
  { value: 5, label: "Ad slot" },
] as const;

export const Route = createFileRoute("/admin/local-news")({
  component: AdminLocalNews,
});

function AdminLocalNews() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createLocalNews = useMutation(api.localNews.create);
  const updateLocalNews = useMutation(api.localNews.update);
  const moveLocalNews = useMutation(api.localNews.move);
  const publishedArticles = useQuery(api.localNews.adminList);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("LOCAL");
  const [badge, setBadge] = useState("LOCAL");
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
  const [editingArticleId, setEditingArticleId] = useState<Id<"localNews"> | null>(null);

  const isAdSlot = position === 5;
  const requiresMedia = !isAdSlot ? true : true;

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
      await moveLocalNews({
        id: articleId as Id<"localNews">,
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

  function startEditing(article: NonNullable<typeof publishedArticles>[number]) {
    setEditingArticleId(article._id); setTitle(article.title); setBody(article.body ?? "");
    setCategory(article.category); setBadge(article.badge); setExcerpt(article.excerpt);
    setPosition(article.position); setFeatured(article.featured); setPublished(article.published);
    setMedia(null); setStatus("idle"); setError("");
  }

  function cancelEditing() {
    setEditingArticleId(null); setTitle(""); setBody(""); setExcerpt(""); setPosition(1);
    setMedia(null); setFeatured(true); setPublished(true); setStatus("idle"); setError("");
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !category || !excerpt.trim() || (!media && !editingArticleId)) {
      setError(editingArticleId ? "Headline, category, and excerpt are required." : "Headline, category, excerpt, and media file are required.");
      return;
    }

    try {
      setError("");
      let storageId: Id<"_storage"> | undefined;

      if (media) {
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
      const articleArgs = {
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
      };
      if (editingArticleId) await updateLocalNews({ id: editingArticleId, ...articleArgs });
      else await createLocalNews(articleArgs);

      setStatus("success");
      setEditingArticleId(null);
      setTitle("");
      setBody("");
      setExcerpt("");
      setPosition(1);
      setMedia(null);
      setFeatured(true);
      setPublished(true);
    } catch (submissionError) {
      console.error(submissionError);
      setError(editingArticleId ? "Could not update this article. Please try again." : "Could not publish this article. Please try again.");
      setStatus("idle");
    }
  }

  const isSubmitting = status === "uploading" || status === "publishing";
  const articlesByPosition = new Map((publishedArticles ?? []).map((article) => [article.position, article]));

  return (
    <main className="mx-auto min-h-screen max-w-[1250px] bg-background px-4 py-10 text-foreground sm:px-6">
      <div className="mb-8 border-b border-border pb-5">
        <Link to="/admin" className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-white bg-primary px-3 py-2 hover:underline">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to admin
        </Link>
        <p className="text-xs font-bold tracking-widest text-primary uppercase">Development admin</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Publish Local News</h1>
        <p className="mt-2 text-sm text-muted-foreground">Manage the local hero, three sub-hero cards, and the ad slot for the local news section.</p>
      </div>

      <div className="wrapper border-b border-border pb-10 mb-5">
        <section className="w-full border border-border bg-muted/30 p-4" aria-labelledby="local-position-status-heading">
                <div className="flex items-baseline justify-between gap-4">
                <h2 id="local-position-status-heading" className="text-sm font-black uppercase">Published positions</h2>
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
                        {article && <button type="button" onClick={() => startEditing(article)} className="mt-2 inline-flex items-center gap-1 font-bold text-primary hover:underline"><Pencil className="h-3 w-3" aria-hidden="true" />Edit</button>}
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
                                {positionOption.label}
                                </option>
                            ))}
                            </select>
                        </div>
                        ) : (
                        <span className="flex shrink-0 items-center gap-1 font-bold text-red-700">
                            <span className="h-2.5 w-2.5 rounded-full bg-red-600" aria-label="Available" title="Available" />
                            Free
                        </span>
                        )}
                    </div>
                    );
                })}
                </div>

                {positionMessage && <p className="mt-3 text-xs font-bold text-green-700">{positionMessage}</p>}
            </section>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col items-start justify-center gap-4">
        <div className="wrapper flex w-full flex-col items-center justify-start gap-5 lg:flex-row lg:items-start">
            <div className="flex w-[50%] flex-col items-center justify-start gap-5">
          <label className="block w-full text-sm font-bold">
            Display position
            <select
              value={position}
              onChange={(event) => {
                const nextPosition = Number(event.target.value);
                setPosition(nextPosition);
                if (nextPosition === 5) {
                  setMedia(null);
                }
              }}
              className="mt-2 w-full border border-border bg-background px-3 py-2 font-normal"
            >
              {POSITION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <span className="mt-1 block text-xs font-normal text-muted-foreground">
              Choose the local hero, sub-hero, or ad slot for this article.
            </span>
          </label>

          <label className="block w-full text-sm font-bold">
            Headline
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full border border-border px-3 py-2 font-normal"
              placeholder="Local News Headline"
            />
          </label>

          <div className="grid w-full gap-5 sm:grid-cols-2">
            <label className="block text-sm font-bold">
              Category
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 w-full border border-border bg-background px-3 py-2 font-normal">
                <option>LOCAL</option>
                <option>POLITICS</option>
                <option>REGIONAL</option>
                <option>CRIME</option>
                <option>GOVERNMENT</option>
              </select>
            </label>

            <label className="block text-sm font-bold">
              Badge
              <select value={badge} onChange={(event) => setBadge(event.target.value)} className="mt-2 w-full border border-border bg-background px-3 py-2 font-normal">
                <option>LOCAL</option>
                <option>LIVE</option>
                <option>EXCLUSIVE</option>
                <option>UPDATE</option>
              </select>
            </label>
          </div>

          <label className="block w-full text-sm font-bold">
            Excerpt
            <textarea value={excerpt} onChange={(event) => setExcerpt(event.target.value)} className="mt-2 min-h-28 w-full border border-border px-3 py-2 font-normal" placeholder="A short summary for the local news card." />
          </label>

          <label className="block w-full text-sm font-bold">
            Article body
            <textarea value={body} onChange={(event) => setBody(event.target.value)} className="mt-2 min-h-36 w-full border border-border px-3 py-2 font-normal" placeholder="Full article content for the story popup." />
          </label>
            </div>

            <div className="flex w-[50%] flex-col items-center justify-start gap-5">
                <>
                {previewUrl && media?.type.startsWith("video/") ? (
                    <video src={previewUrl} controls muted playsInline className="max-h-72 w-full object-cover" />
                ) : previewUrl ? (
                    <img src={previewUrl} alt="Selected article preview" className="max-h-72 w-full object-cover" />
                ) : null}

                <label className="block w-full text-sm font-bold">
                    Image or video
                    <input type="file" accept="image/*,video/*" onChange={(event) => onMediaChange(event.target.files?.[0])} className="mt-2 block w-full border border-border px-3 py-2 text-sm font-normal" />
                    {editingArticleId && <span className="mt-1 block text-xs font-normal text-muted-foreground">Leave empty to keep the current media.</span>}
                </label>
                </>


            
            </div>
        </div>

        <div className="buttons flex w-full flex-col justify-center gap-5">
            <div className="flex w-full flex-wrap gap-5 text-sm">
                <label className="flex items-center gap-2"><input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} /> Featured</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} /> Published</label>
            </div>

            {error && <p className="border border-primary/30 bg-tint px-3 py-2 text-sm text-primary">{error}</p>}
            {status === "success" && <p className="border border-green-600/30 bg-green-50 px-3 py-2 text-sm text-green-700">Article saved successfully.</p>}

            <button type="submit" disabled={isSubmitting} className="w-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60">
            {status === "uploading" ? "Uploading media..." : status === "publishing" ? "Saving..." : editingArticleId ? "Save changes" : "Publish article"}
            </button>
            {editingArticleId && <button type="button" onClick={cancelEditing} disabled={isSubmitting} className="w-full border border-border px-5 py-3 text-sm font-bold disabled:opacity-60">Cancel</button>}
        </div>
      </form>
    </main>
  );
}

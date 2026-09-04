import { useMutation, useQuery } from "convex/react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

const MAX_MEDIA_SIZE = 50 * 1024 * 1024;
const POSITION_OPTIONS = [
  { value: 1, label: "Center hero" },
  { value: 2, label: "Left story 1" },
  { value: 3, label: "Left story 2" },
  { value: 4, label: "Left story 3" },
  { value: 5, label: "Left story 4" },
  { value: 6, label: "Right story 1" },
  { value: 7, label: "Right story 2" },
  { value: 8, label: "Right story 3" },
  { value: 9, label: "Right story 4" },
] as const;

const requiresMediaForPosition = (position: number) => position === 1;

export const Route = createFileRoute("/admin/india-news")({
  component: AdminIndiaNews,
});

function AdminIndiaNews() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createLatestNews = useMutation(api.latestNews.create);
  const updateLatestNews = useMutation(api.latestNews.update);
  const moveLatestNews = useMutation(api.latestNews.move);
  const publishedArticles = useQuery(api.latestNews.adminList);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("INDIA");
  const [badge, setBadge] = useState("INDIA");
  const [excerpt, setExcerpt] = useState("");
  const [position, setPosition] = useState(1);
  const [media, setMedia] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [featured, setFeatured] = useState(true);
  const [published, setPublished] = useState(true);
  const [status, setStatus] = useState<"idle" | "uploading" | "publishing" | "success">("idle");
  const [error, setError] = useState("");
  const [movingArticleId, setMovingArticleId] = useState<string | null>(null);
  const [editingArticleId, setEditingArticleId] = useState<Id<"latestNews"> | null>(null);

  const selectedPositionRequiresMedia = requiresMediaForPosition(position);

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
    setMovingArticleId(articleId);

    try {
      await moveLatestNews({
        id: articleId as Id<"latestNews">,
        position: nextPosition,
      });
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

    if (!title.trim() || !category || !excerpt.trim() || (selectedPositionRequiresMedia && !media && !editingArticleId)) {
      setError(
        selectedPositionRequiresMedia
          ? "Headline, category, excerpt, and a hero image/video are required."
          : "Headline, category, and excerpt are required for this text-only slot.",
      );
      return;
    }

    try {
      setError("");
      let storageId: Id<"_storage"> | undefined;

      if (selectedPositionRequiresMedia && media) {
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
        ...(storageId ? { imageId: storageId } : {}),
        ...(storageId && media ? { mediaType: media.type.startsWith("video/") ? ("video" as const) : ("image" as const) } : {}),
        slug: `${title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
        featured,
        published,
        order: position,
        position,
        publishedAt: Date.now(),
      };
      if (editingArticleId) await updateLatestNews({ id: editingArticleId, ...articleArgs });
      else await createLatestNews(articleArgs);

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
        <Link to="/admin" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to admin
        </Link>
        <p className="text-xs font-bold tracking-widest text-primary uppercase">Development admin</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Publish India News</h1>
        <p className="mt-2 text-sm text-muted-foreground">Center hero uses media. Left and right side columns are text-first story slots without visuals.</p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="flex w-full flex-col gap-5 lg:w-[50%]">
          <label className="block w-full text-sm font-bold">
            Display position
            <select
              value={position}
              onChange={(event) => {
                const nextPosition = Number(event.target.value);
                setPosition(nextPosition);
                if (!requiresMediaForPosition(nextPosition)) {
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
              Use the center hero for the large visual story. Left and right story slots stay text-only.
            </span>
          </label>

          <label className="block w-full text-sm font-bold">
            Headline
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full border border-border px-3 py-2 font-normal"
              placeholder="India news headline"
            />
          </label>

          <div className="grid w-full gap-5 sm:grid-cols-2">
            <label className="block text-sm font-bold">
              Category
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 w-full border border-border bg-background px-3 py-2 font-normal">
                <option>INDIA</option>
                <option>POLITICS</option>
                <option>ECONOMY</option>
                <option>CRIME</option>
                <option>GOVERNMENT</option>
              </select>
            </label>

            <label className="block text-sm font-bold">
              Badge
              <select value={badge} onChange={(event) => setBadge(event.target.value)} className="mt-2 w-full border border-border bg-background px-3 py-2 font-normal">
                <option>INDIA</option>
                <option>LIVE</option>
                <option>EXCLUSIVE</option>
                <option>UPDATE</option>
              </select>
            </label>
          </div>

          <label className="block w-full text-sm font-bold">
            Excerpt
            <textarea value={excerpt} onChange={(event) => setExcerpt(event.target.value)} className="mt-2 min-h-28 w-full border border-border px-3 py-2 font-normal" placeholder="Short summary for the India card or text block." />
          </label>

          <label className="block w-full text-sm font-bold">
            Article body
            <textarea value={body} onChange={(event) => setBody(event.target.value)} className="mt-2 min-h-36 w-full border border-border px-3 py-2 font-normal" placeholder="Full article content for the story popup." />
          </label>
        </div>

        <div className="flex w-full flex-col gap-5 lg:w-[50%]">
          {selectedPositionRequiresMedia ? (
            <>
              {previewUrl && media?.type.startsWith("video/") ? (
                <video src={previewUrl} controls muted playsInline className="max-h-72 w-full object-cover" />
              ) : previewUrl ? (
                <img src={previewUrl} alt="Selected article preview" className="max-h-72 w-full object-cover" />
              ) : null}

              <label className="block w-full text-sm font-bold">
                Hero image or video
                <input type="file" accept="image/*,video/*" onChange={(event) => onMediaChange(event.target.files?.[0])} className="mt-2 block w-full border border-border px-3 py-2 text-sm font-normal" />
                {editingArticleId && <span className="mt-1 block text-xs font-normal text-muted-foreground">Leave empty to keep the current media.</span>}
              </label>
            </>
          ) : (
            <div className="flex min-h-32 items-center justify-center border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
              This story sits in a text-only sidebar slot.
            </div>
          )}

          <div className="flex flex-wrap gap-5 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} /> Featured</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} /> Published</label>
          </div>

          {error && <p className="border border-primary/30 bg-tint px-3 py-2 text-sm text-primary">{error}</p>}
          {status === "success" && <p className="border border-green-600/30 bg-green-50 px-3 py-2 text-sm text-green-700">Article saved successfully.</p>}

          <button type="submit" disabled={isSubmitting} className="w-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60">
            {status === "uploading" ? "Uploading image..." : status === "publishing" ? "Saving..." : editingArticleId ? "Save changes" : "Publish article"}
          </button>
          {editingArticleId && <button type="button" onClick={cancelEditing} disabled={isSubmitting} className="w-full border border-border px-5 py-3 text-sm font-bold disabled:opacity-60">Cancel</button>}
        </div>
      </form>

      <section className="mt-8 rounded border border-border bg-muted/20 p-4">
        <h2 className="text-sm font-black uppercase tracking-wide">Published positions</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {POSITION_OPTIONS.map((option) => {
            const article = articlesByPosition.get(option.value);
            return (
              <div key={option.value} className="flex items-center justify-between gap-3 border border-border bg-background px-3 py-2 text-xs">
                <div className="min-w-0">
                  <p className="font-bold">{option.label}</p>
                  <p className="mt-1 truncate text-muted-foreground">{article?.title ?? "Available"}</p>
                  {article && <button type="button" onClick={() => startEditing(article)} className="mt-2 inline-flex items-center gap-1 font-bold text-primary hover:underline"><Pencil className="h-3 w-3" aria-hidden="true" />Edit</button>}
                </div>
                {article ? (
                  <select
                    aria-label={`Move ${article.title}`}
                    value={article.position}
                    disabled={movingArticleId === article._id}
                    onChange={(event) => onPositionChange(article._id, Number(event.target.value))}
                    className="w-28 border border-border bg-background px-1 py-1 text-[10px] font-bold disabled:opacity-60"
                  >
                    {POSITION_OPTIONS.map((positionOption) => (
                      <option key={positionOption.value} value={positionOption.value}>{positionOption.label}</option>
                    ))}
                  </select>
                ) : (
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Open</span>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

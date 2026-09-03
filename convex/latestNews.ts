import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const MIN_POSITION = 1;
const MAX_POSITION = 11;
const SHORT_NEWS_MIN_POSITION = 6;
const SHORT_NEWS_MAX_POSITION = 11;

const isShortNewsPosition = (position: number) => position >= SHORT_NEWS_MIN_POSITION && position <= SHORT_NEWS_MAX_POSITION;

const latestNewsArgs = {
    title: v.string(),
    body: v.optional(v.string()),
    category: v.string(),
    badge: v.string(),
    excerpt: v.string(),
    imageId: v.optional(v.id("_storage")),
    mediaType: v.optional(v.union(v.literal("image"), v.literal("video"))),
    slug: v.string(),
    featured: v.boolean(),
    published: v.boolean(),
    order: v.number(),
    position: v.number(),
    publishedAt: v.number(),
};

export const create = mutation({
  args: latestNewsArgs,
  handler: async (ctx, args) => {
    if (args.position < MIN_POSITION || args.position > MAX_POSITION) {
      throw new Error("Latest News position must be between 1 and 11.");
    }

    if (!isShortNewsPosition(args.position) && (!args.imageId || !args.mediaType)) {
      throw new Error("Image/video is required for hero and sub-hero latest news positions.");
    }

    if (args.imageId && !args.mediaType) {
      throw new Error("Media type is required when an uploaded file is present.");
    }

    if (!args.imageId && args.mediaType) {
      throw new Error("Image/video upload is required when media type is set.");
    }

    return ctx.db.insert("latestNews", args);
  },
});

export const move = mutation({
  args: {
    id: v.id("latestNews"),
    position: v.number(),
  },
  handler: async (ctx, { id, position }) => {
    if (position < MIN_POSITION || position > MAX_POSITION) {
      throw new Error("Latest News position must be between 1 and 11.");
    }
    const article = await ctx.db.get(id);
    if (!article) throw new Error("latest News article was not found.");

    const destinationArticles = await ctx.db
      .query("latestNews")
      .withIndex("by_published_position", (q) =>
        q.eq("published", article.published).eq("position", position),
      )
      .collect();

    for (const destinationArticle of destinationArticles) {
      if (destinationArticle._id !== id) {
        await ctx.db.patch(destinationArticle._id, {
          position: article.position,
          order: article.position,
        });
      }
    }

    await ctx.db.patch(id, { position, order: position });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const articles = await ctx.db
      .query("latestNews")
      .withIndex("by_published_position", (q) => q.eq("published", true))
      .order("asc")
      .collect();

    const articlesByPosition = new Map<number, (typeof articles)[number]>();
    for (const article of articles) {
      const current = articlesByPosition.get(article.position);
      if (!current || article._creationTime > current._creationTime) {
        articlesByPosition.set(article.position, article);
      }
    }

    return Promise.all(
      [...articlesByPosition.values()].map(async ({ _id, _creationTime, imageId, ...article }) => ({
        ...article,
        _id,
        imageId,
        imageUrl: imageId ? await ctx.storage.getUrl(imageId) : undefined,
      })),
    );
  },
});

export const update = mutation({
  args: {
    id: v.id("latestNews"),
    ...latestNewsArgs,
  },
  handler: async (ctx, { id, imageId, mediaType, ...args }) => {
    if (args.position < MIN_POSITION || args.position > MAX_POSITION) {
      throw new Error("Latest News position must be between 1 and 11.");
    }
    const article = await ctx.db.get(id);
    if (!article) throw new Error("Latest News article was not found.");
    const finalImageId = imageId ?? article.imageId;
    const finalMediaType = mediaType ?? article.mediaType;
    if (!isShortNewsPosition(args.position) && (!finalImageId || !finalMediaType)) {
      throw new Error("Image/video is required for hero and sub-hero latest news positions.");
    }
    if (finalImageId && !finalMediaType) throw new Error("Media type is required when an uploaded file is present.");
    if (!finalImageId && finalMediaType) throw new Error("Image/video upload is required when media type is set.");
    await ctx.db.patch(id, {
      ...args,
      ...(imageId ? { imageId } : {}),
      ...(mediaType ? { mediaType } : {}),
    });
  },
});
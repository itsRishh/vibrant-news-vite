import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const MIN_POSITION = 1;
const MAX_POSITION = 11;
const HERO_MIN_POSITION = 1;
const HERO_MAX_POSITION = 1;
const SUB_HERO_MIN_POSITION = 2;
const SUB_HERO_MAX_POSITION = 5;
const AD_POSITION = 6;
const NO_VISUAL_MIN_POSITION = 7;
const NO_VISUAL_MAX_POSITION = 11;

const requiresMediaForPosition = (position: number) =>
  (position >= HERO_MIN_POSITION && position <= HERO_MAX_POSITION) ||
  (position >= SUB_HERO_MIN_POSITION && position <= SUB_HERO_MAX_POSITION) ||
  position === AD_POSITION;

const regionalNewsArgs = {
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
  args: regionalNewsArgs,
  handler: async (ctx, args) => {
    if (args.position < MIN_POSITION || args.position > MAX_POSITION) {
      throw new Error("Regional News position must be between 1 and 11.");
    }

    if (requiresMediaForPosition(args.position) && (!args.imageId || !args.mediaType)) {
      throw new Error("Hero, sub-hero, and ad regional news positions require an image or video upload.");
    }

    if (args.imageId && !args.mediaType) {
      throw new Error("Media type is required when an uploaded file is present.");
    }

    if (!args.imageId && args.mediaType) {
      throw new Error("Image/video upload is required when media type is set.");
    }

    return ctx.db.insert("regionalNews", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("regionalNews"),
    ...regionalNewsArgs,
  },
  handler: async (ctx, { id, imageId, mediaType, ...args }) => {
    if (args.position < MIN_POSITION || args.position > MAX_POSITION) {
      throw new Error("Regional News position must be between 1 and 11.");
    }
    const article = await ctx.db.get(id);
    if (!article) throw new Error("Regional News article was not found.");
    const finalImageId = imageId ?? article.imageId;
    const finalMediaType = mediaType ?? article.mediaType;
    if (requiresMediaForPosition(args.position) && (!finalImageId || !finalMediaType)) {
      throw new Error("Hero, sub-hero, and ad regional news positions require an image or video upload.");
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

export const move = mutation({
  args: {
    id: v.id("regionalNews"),
    position: v.number(),
  },
  handler: async (ctx, { id, position }) => {
    if (position < MIN_POSITION || position > MAX_POSITION) {
      throw new Error("Regional News position must be between 1 and 11.");
    }

    const article = await ctx.db.get(id);
    if (!article) throw new Error("Regional News article was not found.");

    const destinationArticles = await ctx.db
      .query("regionalNews")
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
    const positions = Array.from({ length: 11 }, (_, index) => index + 1);
    const articlesAtPositions = await Promise.all(positions.map((position) =>
      ctx.db.query("regionalNews").withIndex("by_published_position", (q) =>
        q.eq("published", true).eq("position", position),
      ).collect(),
    ));
    const articlesByPosition = new Map<number, (typeof articlesAtPositions)[number][number]>();
    articlesAtPositions.forEach((articles) => {
      const article = articles.reduce((latest, candidate) =>
        !latest || candidate._creationTime > latest._creationTime ? candidate : latest,
      undefined as (typeof articles)[number] | undefined);
      if (article) articlesByPosition.set(article.position, article);
    });

    return Promise.all([...articlesByPosition.values()].map(async (article) => ({
      _id: article._id,
      title: article.title,
      category: article.category,
      badge: article.badge,
      excerpt: article.excerpt,
      imageUrl: article.imageId ? await ctx.storage.getUrl(article.imageId) : null,
      mediaType: article.mediaType,
      slug: article.slug,
      publishedAt: article.publishedAt,
      position: article.position,
    })));
  },
});

export const adminList = query({
  args: {},
  handler: async (ctx) => ctx.db.query("regionalNews").order("desc").collect(),
});

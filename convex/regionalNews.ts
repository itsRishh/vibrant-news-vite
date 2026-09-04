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
    const articles = await ctx.db
      .query("regionalNews")
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

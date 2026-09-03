import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const breakingNewsArgs = {
  title: v.string(),
  body: v.string(),
  category: v.string(),
  badge: v.string(),
  excerpt: v.string(),
  imageId: v.id("_storage"),
  mediaType: v.union(v.literal("image"), v.literal("video")),
  slug: v.string(),
  featured: v.boolean(),
  published: v.boolean(),
  order: v.number(),
  position: v.number(),
  publishedAt: v.number(),
};

export const create = mutation({
  args: breakingNewsArgs,
  handler: async (ctx, args) => ctx.db.insert("breakingNews", args),
});

export const update = mutation({
  args: {
    id: v.id("breakingNews"),
    title: v.string(),
    body: v.string(),
    category: v.string(),
    badge: v.string(),
    excerpt: v.string(),
    imageId: v.optional(v.id("_storage")),
    mediaType: v.union(v.literal("image"), v.literal("video")),
    slug: v.string(),
    featured: v.boolean(),
    published: v.boolean(),
    order: v.number(),
    position: v.number(),
    publishedAt: v.number(),
  },
  handler: async (ctx, { id, imageId, ...args }) => {
    if (args.position < 1 || args.position > 6) {
      throw new Error("Breaking News position must be between 1 and 6.");
    }
    const article = await ctx.db.get(id);
    if (!article) throw new Error("Breaking News article was not found.");
    if (!imageId && !article.imageId) throw new Error("Breaking News entries require an image or video upload.");
    await ctx.db.patch(id, imageId ? { ...args, imageId } : args);
  },
});

export const move = mutation({
  args: {
    id: v.id("breakingNews"),
    position: v.number(),
  },
  handler: async (ctx, { id, position }) => {
    const article = await ctx.db.get(id);
    if (!article) throw new Error("Breaking News article was not found.");

    const destinationArticles = await ctx.db
      .query("breakingNews")
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
      .query("breakingNews")
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
        imageUrl: await ctx.storage.getUrl(imageId),
      })),
    );
  },
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const MIN_POSITION = 1;
const MAX_POSITION = 5;
const AD_POSITION = 5;

const isAdPosition = (position: number) => position === AD_POSITION;

const localNewsArgs = {
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
  args: localNewsArgs,
  handler: async (ctx, args) => {
    if (args.position < MIN_POSITION || args.position > MAX_POSITION) {
      throw new Error("Local News position must be between 1 and 5.");
    }

    if (!args.imageId || !args.mediaType) {
      throw new Error("Local News entries require an image or video upload for every position.");
    }

    if (args.imageId && !args.mediaType) {
      throw new Error("Media type is required when a file is uploaded.");
    }

    if (!args.imageId && args.mediaType) {
      throw new Error("You must upload a file when media type is present.");
    }

    return ctx.db.insert("localNews", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("localNews"),
    ...localNewsArgs,
  },
  handler: async (ctx, { id, imageId, mediaType, ...args }) => {
    if (args.position < MIN_POSITION || args.position > MAX_POSITION) {
      throw new Error("Local News position must be between 1 and 5.");
    }
    const article = await ctx.db.get(id);
    if (!article) throw new Error("Local News article was not found.");
    const finalImageId = imageId ?? article.imageId;
    const finalMediaType = mediaType ?? article.mediaType;
    if (!finalImageId || !finalMediaType) throw new Error("Local News entries require an image or video upload for every position.");
    if (finalImageId && !finalMediaType) throw new Error("Media type is required when a file is uploaded.");
    if (!finalImageId && finalMediaType) throw new Error("You must upload a file when media type is present.");
    await ctx.db.patch(id, {
      ...args,
      ...(imageId ? { imageId } : {}),
      ...(mediaType ? { mediaType } : {}),
    });
  },
});

export const move = mutation({
  args: {
    id: v.id("localNews"),
    position: v.number(),
  },
  handler: async (ctx, { id, position }) => {
    if (position < MIN_POSITION || position > MAX_POSITION) {
      throw new Error("Local News position must be between 1 and 5.");
    }

    const article = await ctx.db.get(id);
    if (!article) throw new Error("Local News article was not found.");

    const destinationArticles = await ctx.db
      .query("localNews")
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
    const positions = [1, 2, 3, 4, 5];
    const articlesAtPositions = await Promise.all(positions.map((position) =>
      ctx.db.query("localNews").withIndex("by_published_position", (q) =>
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
  handler: async (ctx) => ctx.db.query("localNews").order("desc").collect(),
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const videoArgs = {
  title: v.string(),
  description: v.string(),
  imageId: v.id("_storage"),
  mediaType: v.literal("video"),
  kind: v.union(v.literal("full"), v.literal("short")),
  slot: v.optional(v.number()),
  published: v.boolean(),
  publishedAt: v.number(),
};

export const create = mutation({
  args: videoArgs,
  handler: async (ctx, args) => {
    if (args.kind === "full" && (!args.slot || args.slot < 1 || args.slot > 3)) {
      throw new Error("Full videos must use slot 1, 2, or 3.");
    }
    if (args.kind === "short" && args.slot !== undefined) {
      throw new Error("Short videos cannot have a full-video slot.");
    }
    return ctx.db.insert("videos", args);
  },
});

export const move = mutation({
  args: {
    id: v.id("videos"),
    slot: v.number(),
  },
  handler: async (ctx, { id, slot }) => {
    if (slot < 1 || slot > 3) {
      throw new Error("Landscape video slot must be between 1 and 3.");
    }

    const video = await ctx.db.get(id);
    if (!video) throw new Error("Video was not found.");
    if (video.kind !== "full" || video.slot === undefined) {
      throw new Error("Only landscape videos can be moved.");
    }

    const destinationVideos = await ctx.db
      .query("videos")
      .withIndex("by_kind", (q) => q.eq("kind", "full"))
      .collect();

    for (const destinationVideo of destinationVideos) {
      if (destinationVideo._id !== id && destinationVideo.slot === slot) {
        await ctx.db.patch(destinationVideo._id, { slot: video.slot });
      }
    }

    await ctx.db.patch(id, { slot });
  },
});

export const update = mutation({
  args: {
    id: v.id("videos"),
    title: v.string(),
    description: v.string(),
    imageId: v.optional(v.id("_storage")),
    kind: v.union(v.literal("full"), v.literal("short")),
    slot: v.optional(v.number()),
    published: v.boolean(),
    publishedAt: v.number(),
  },
  handler: async (ctx, args) => {
    if (args.kind === "full" && (!args.slot || args.slot < 1 || args.slot > 3)) {
      throw new Error("Full videos must use slot 1, 2, or 3.");
    }
    if (args.kind === "short" && args.slot !== undefined) {
      throw new Error("Short videos cannot have a full-video slot.");
    }

    const { id, imageId, ...video } = args;
    await ctx.db.patch(id, {
      ...video,
      ...(imageId ? { imageId } : {}),
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const videos = await ctx.db.query("videos").order("desc").collect();
    return Promise.all(
      videos.map(async ({ _id, _creationTime, imageId, ...video }) => ({
        ...video,
        _id,
        imageId,
        imageUrl: await ctx.storage.getUrl(imageId),
      })),
    );
  },
});

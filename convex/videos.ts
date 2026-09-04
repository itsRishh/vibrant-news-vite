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

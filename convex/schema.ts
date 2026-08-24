import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  breakingNews: defineTable({
    title: v.string(),
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
  })
    .index("by_order", ["order"])
    .index("by_published", ["published"])
    .index("by_published_order", ["published", "order"])
    .index("by_published_position", ["published", "position"]),
});
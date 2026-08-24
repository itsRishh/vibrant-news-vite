import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  breakingNews: defineTable({
    title: v.string(),
    category: v.string(),
    badge: v.string(),
    image: v.string(),
    excerpt: v.string(),
    timestamp: v.string(),
    slug: v.string(),
    featured: v.boolean(),
    order: v.number(),
    published: v.boolean(),
  })
    .index("by_order", ["order"])
    .index("by_published", ["published"]),
});
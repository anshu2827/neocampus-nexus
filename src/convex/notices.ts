import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("notices").order("desc").take(20);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    category: v.string(),
    deadline: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("notices", args);
  },
});

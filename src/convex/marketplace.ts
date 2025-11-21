import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("marketplaceItems")
      .withIndex("by_status", (q) => q.eq("status", "available"))
      .order("desc")
      .take(50);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    await ctx.db.insert("marketplaceItems", {
      ...args,
      sellerId: userId,
      status: "available",
    });
  },
});

export const buy = mutation({
  args: { itemId: v.id("marketplaceItems") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    
    await ctx.db.patch(args.itemId, { status: "sold" });
  },
});

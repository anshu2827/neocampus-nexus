import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const confessions = await ctx.db.query("confessions").order("desc").take(50);
    return confessions;
  },
});

export const post = mutation({
  args: { content: v.string(), isAnonymous: v.boolean() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    
    await ctx.db.insert("confessions", {
      content: args.content,
      authorId: userId && !args.isAnonymous ? userId : undefined,
      isAnonymous: args.isAnonymous,
      reactions: {
        fire: 0,
        laugh: 0,
        cry: 0,
        skull: 0,
      },
      flagged: false,
    });
  },
});

export const react = mutation({
  args: { 
    confessionId: v.id("confessions"), 
    type: v.union(v.literal("fire"), v.literal("laugh"), v.literal("cry"), v.literal("skull")) 
  },
  handler: async (ctx, args) => {
    const confession = await ctx.db.get(args.confessionId);
    if (!confession) throw new Error("Confession not found");

    const reactions = { ...confession.reactions };
    reactions[args.type]++;

    await ctx.db.patch(args.confessionId, { reactions });
  },
});

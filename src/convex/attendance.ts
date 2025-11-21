import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getMyAttendance = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("attendance")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const updateSubject = mutation({
  args: {
    subject: v.string(),
    totalClasses: v.number(),
    attendedClasses: v.number(),
    id: v.optional(v.id("attendance")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    if (args.id) {
      await ctx.db.patch(args.id, {
        totalClasses: args.totalClasses,
        attendedClasses: args.attendedClasses,
        lastUpdated: Date.now(),
      });
    } else {
      await ctx.db.insert("attendance", {
        userId,
        subject: args.subject,
        totalClasses: args.totalClasses,
        attendedClasses: args.attendedClasses,
        lastUpdated: Date.now(),
      });
    }
  },
});

export const deleteSubject = mutation({
  args: { id: v.id("attendance") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    
    const record = await ctx.db.get(args.id);
    if (!record || record.userId !== userId) throw new Error("Unauthorized");

    await ctx.db.delete(args.id);
  },
});

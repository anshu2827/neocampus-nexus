import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getPotentialMatches = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    const users = await ctx.db.query("users").take(20);
    
    // Filter out current user and return others
    return users.filter(u => u._id !== userId);
  },
});

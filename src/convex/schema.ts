import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
      
      // CampusVerse specific fields
      major: v.optional(v.string()),
      semester: v.optional(v.number()),
      bio: v.optional(v.string()),
      interests: v.optional(v.array(v.string())),
      studyStyle: v.optional(v.string()), // e.g., "Night Owl", "Early Bird"
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Attendance Predictor
    attendance: defineTable({
      userId: v.id("users"),
      subject: v.string(),
      totalClasses: v.number(),
      attendedClasses: v.number(),
      lastUpdated: v.number(),
    }).index("by_user", ["userId"]),

    // Anonymous Confessions
    confessions: defineTable({
      content: v.string(),
      authorId: v.optional(v.id("users")), // Optional for true anonymity, or hashed
      isAnonymous: v.boolean(),
      reactions: v.object({
        fire: v.number(),
        laugh: v.number(),
        cry: v.number(),
        skull: v.number(),
      }),
      flagged: v.boolean(),
    }),

    // Events & Hype Meter
    events: defineTable({
      title: v.string(),
      description: v.string(),
      date: v.number(),
      location: v.string(),
      organizerId: v.id("users"),
      hypeScore: v.number(),
      category: v.string(),
      image: v.optional(v.string()),
    }).index("by_date", ["date"]),

    eventAttendees: defineTable({
      eventId: v.id("events"),
      userId: v.id("users"),
    }).index("by_event", ["eventId"]).index("by_user", ["userId"]),

    // Campus Marketplace
    marketplaceItems: defineTable({
      title: v.string(),
      description: v.string(),
      price: v.number(),
      sellerId: v.id("users"),
      category: v.string(), // Books, Electronics, etc.
      status: v.union(v.literal("available"), v.literal("sold")),
      image: v.optional(v.string()),
    }).index("by_status", ["status"]),

    // No-BS Notice Board
    notices: defineTable({
      title: v.string(),
      content: v.string(), // Extracted text
      deadline: v.optional(v.number()),
      category: v.string(),
      originalFileUrl: v.optional(v.string()),
    }).index("by_deadline", ["deadline"]),

    // Study Buddy Matches (Graph Edges)
    studyMatches: defineTable({
      user1Id: v.id("users"),
      user2Id: v.id("users"),
      score: v.number(), // Similarity score
      status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("rejected")),
    }).index("by_user1", ["user1Id"]).index("by_user2", ["user2Id"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
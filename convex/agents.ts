import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: { onlyActive: v.optional(v.boolean()) },
  handler: async (ctx, { onlyActive }) => {
    if (onlyActive) {
      return ctx.db
        .query("agents")
        .withIndex("by_active", (q) => q.eq("isActive", true))
        .collect();
    }
    return ctx.db.query("agents").collect();
  },
});

export const getById = query({
  args: { id: v.id("agents") },
  handler: async (ctx, { id }) => ctx.db.get(id),
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    role: v.union(v.literal("agent"), v.literal("manager"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("agents")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    if (existing) throw new Error("An agent with this email already exists.");
    return ctx.db.insert("agents", { ...args, isActive: true });
  },
});

export const update = mutation({
  args: {
    id: v.id("agents"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.optional(v.union(v.literal("agent"), v.literal("manager"), v.literal("admin"))),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...patch }) => {
    await ctx.db.patch(id, patch);
  },
});

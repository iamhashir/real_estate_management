import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { logActivity } from "./helpers";

const entityTypeV    = v.union(v.literal("property"), v.literal("client"), v.literal("deal"));
const activityTypeV  = v.union(
  v.literal("created"), v.literal("updated"), v.literal("note"),
  v.literal("call"), v.literal("viewing"), v.literal("offer"), v.literal("status_change")
);

export const listForEntity = query({
  args: {
    entityType: entityTypeV,
    entityId:   v.string(),
    limit:      v.optional(v.number()),
  },
  handler: async (ctx, { entityType, entityId, limit }) => {
    return ctx.db
      .query("activity")
      .withIndex("by_entity", (q) => q.eq("entityType", entityType).eq("entityId", entityId))
      .order("desc")
      .take(limit ?? 50);
  },
});

export const addNote = mutation({
  args: {
    entityType: entityTypeV,
    entityId:   v.string(),
    content:    v.string(),
    type:       v.optional(activityTypeV),
    agentId:    v.optional(v.id("agents")),
  },
  handler: async (ctx, { entityType, entityId, content, type, agentId }) => {
    await logActivity(ctx, {
      entityType,
      entityId,
      activityType: type ?? "note",
      content,
      agentId: agentId as any,
    });
  },
});

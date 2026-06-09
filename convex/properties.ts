import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { logActivity, now } from "./helpers";
import { paginationOptsV } from "./helpers";

// ─── Validators (reused across query/mutation args) ───────────────────────────

const propertyTypeV = v.union(
  v.literal("villa"), v.literal("apartment"), v.literal("office"),
  v.literal("land"), v.literal("commercial")
);
const listingTypeV  = v.union(v.literal("sale"), v.literal("rent"));
const statusV = v.union(
  v.literal("available"), v.literal("under_negotiation"),
  v.literal("sold"), v.literal("rented")
);

// ─── Queries ──────────────────────────────────────────────────────────────────

export const list = query({
  args: {
    status:      v.optional(statusV),
    type:        v.optional(propertyTypeV),
    listingType: v.optional(listingTypeV),
    city:        v.optional(v.string()),
    agentId:     v.optional(v.id("agents")),
    paginationOpts: paginationOptsV,
  },
  handler: async (ctx, { status, type, listingType, city, agentId, paginationOpts }) => {
    // Use the most selective index available, then filter in memory.
    // Convex reactive cache handles re-runs — no manual invalidation needed.
    let base = ctx.db.query("properties");

    if (status && type) {
      base = base.withIndex("by_status_type", (q) =>
        q.eq("status", status).eq("type", type)
      ) as any;
    } else if (status) {
      base = base.withIndex("by_status", (q) => q.eq("status", status)) as any;
    } else if (type) {
      base = base.withIndex("by_type", (q) => q.eq("type", type)) as any;
    } else if (agentId) {
      base = base.withIndex("by_agent", (q) => q.eq("agentId", agentId)) as any;
    }

    const all = await base.collect();

    // Secondary in-memory filters for non-indexed fields
    const filtered = all.filter((p) => {
      if (listingType && p.listingType !== listingType) return false;
      if (city && p.city !== city) return false;
      return true;
    });

    // Manual cursor-based pagination
    const { cursor, numItems } = paginationOpts;
    const startIdx = cursor ? filtered.findIndex((p) => p._id === cursor) + 1 : 0;
    const page = filtered.slice(startIdx, startIdx + numItems);
    const nextCursor = page.length === numItems ? page[page.length - 1]._id : null;

    return { page, nextCursor, totalCount: filtered.length };
  },
});

export const getById = query({
  args: { id: v.id("properties") },
  handler: async (ctx, { id }) => ctx.db.get(id),
});

export const getByIds = query({
  args: { ids: v.array(v.id("properties")) },
  handler: async (ctx, { ids }) =>
    Promise.all(ids.map((id) => ctx.db.get(id))),
});

export const countByStatus = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("properties").collect();
    return all.reduce<Record<string, number>>((acc, p) => {
      acc[p.status] = (acc[p.status] ?? 0) + 1;
      return acc;
    }, {});
  },
});

// ─── Mutations ────────────────────────────────────────────────────────────────

export const create = mutation({
  args: {
    name:         v.string(),
    address:      v.string(),
    city:         v.string(),
    area:         v.optional(v.string()),
    type:         propertyTypeV,
    listingType:  listingTypeV,
    price:        v.number(),
    size:         v.number(),
    bedrooms:     v.optional(v.number()),
    bathrooms:    v.optional(v.number()),
    floor:        v.optional(v.number()),
    features:     v.optional(v.array(v.string())),
    description:  v.optional(v.string()),
    agentId:      v.optional(v.id("agents")),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("properties", {
      ...args,
      status: "available",
    });
    await logActivity(ctx, {
      entityType: "property",
      entityId: id,
      activityType: "created",
      content: `Property "${args.name}" created.`,
      agentId: args.agentId as any,
    });
    return id;
  },
});

export const update = mutation({
  args: {
    id:          v.id("properties"),
    name:        v.optional(v.string()),
    address:     v.optional(v.string()),
    city:        v.optional(v.string()),
    area:        v.optional(v.string()),
    type:        v.optional(propertyTypeV),
    listingType: v.optional(listingTypeV),
    price:       v.optional(v.number()),
    size:        v.optional(v.number()),
    bedrooms:    v.optional(v.number()),
    bathrooms:   v.optional(v.number()),
    floor:       v.optional(v.number()),
    features:    v.optional(v.array(v.string())),
    description: v.optional(v.string()),
    agentId:     v.optional(v.id("agents")),
  },
  handler: async (ctx, { id, ...patch }) => {
    await ctx.db.patch(id, patch);
    await logActivity(ctx, {
      entityType: "property",
      entityId: id,
      activityType: "updated",
      content: "Property details updated.",
    });
  },
});

export const updateStatus = mutation({
  args: {
    id:     v.id("properties"),
    status: statusV,
    agentId: v.optional(v.id("agents")),
  },
  handler: async (ctx, { id, status, agentId }) => {
    const prev = await ctx.db.get(id);
    if (!prev) throw new Error("Property not found.");
    await ctx.db.patch(id, { status });
    await logActivity(ctx, {
      entityType: "property",
      entityId: id,
      activityType: "status_change",
      content: `Status changed from "${prev.status}" to "${status}".`,
      agentId: agentId as any,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("properties") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

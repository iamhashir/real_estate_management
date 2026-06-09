import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { logActivity } from "./helpers";

// ─── Validators ───────────────────────────────────────────────────────────────

const clientTypeV = v.union(v.literal("buyer"), v.literal("seller"), v.literal("both"));
const statusV     = v.union(v.literal("active"), v.literal("inactive"), v.literal("closed"));

// ─── Queries ──────────────────────────────────────────────────────────────────

export const list = query({
  args: {
    clientType: v.optional(clientTypeV),
    status:     v.optional(statusV),
    agentId:    v.optional(v.id("agents")),
    search:     v.optional(v.string()),
  },
  handler: async (ctx, { clientType, status, agentId, search }) => {
    let base = ctx.db.query("clients");

    if (clientType) {
      base = base.withIndex("by_client_type", (q) => q.eq("clientType", clientType)) as any;
    } else if (status) {
      base = base.withIndex("by_status", (q) => q.eq("status", status)) as any;
    } else if (agentId) {
      base = base.withIndex("by_agent", (q) => q.eq("agentId", agentId)) as any;
    }

    const all = await base.collect();

    return all.filter((c) => {
      if (status && c.status !== status) return false;
      if (agentId && c.agentId !== agentId) return false;
      if (search) {
        const q = search.toLowerCase();
        const name = `${c.firstName} ${c.lastName}`.toLowerCase();
        if (!name.includes(q) && !c.phone.includes(q) && !c.email?.toLowerCase().includes(q))
          return false;
      }
      return true;
    });
  },
});

export const getById = query({
  args: { id: v.id("clients") },
  handler: async (ctx, { id }) => ctx.db.get(id),
});

// Full client profile: client + all their deals + linked properties
export const getProfile = query({
  args: { id: v.id("clients") },
  handler: async (ctx, { id }) => {
    const client = await ctx.db.get(id);
    if (!client) return null;

    // Parallelise both deal lookups — no sequential waterfall
    const [buyerDeals, sellerDeals] = await Promise.all([
      ctx.db.query("deals").withIndex("by_buyer", (q) => q.eq("buyerId", id)).collect(),
      ctx.db.query("deals").withIndex("by_seller", (q) => q.eq("sellerId", id)).collect(),
    ]);

    const allDeals = [...buyerDeals, ...sellerDeals];

    // Load linked properties in one parallel batch
    const propertyIds = [...new Set(allDeals.map((d) => d.propertyId))];
    const properties = await Promise.all(propertyIds.map((pid) => ctx.db.get(pid)));

    const activity = await ctx.db
      .query("activity")
      .withIndex("by_entity", (q) => q.eq("entityType", "client").eq("entityId", id))
      .order("desc")
      .take(50);

    return { client, deals: allDeals, properties, activity };
  },
});

// ─── Mutations ────────────────────────────────────────────────────────────────

export const create = mutation({
  args: {
    clientType:             clientTypeV,
    firstName:              v.string(),
    lastName:               v.string(),
    email:                  v.optional(v.string()),
    phone:                  v.string(),
    nationality:            v.optional(v.string()),
    budgetMin:              v.optional(v.number()),
    budgetMax:              v.optional(v.number()),
    preferredPropertyTypes: v.optional(v.array(v.string())),
    preferredLocations:     v.optional(v.array(v.string())),
    notes:                  v.optional(v.string()),
    agentId:                v.optional(v.id("agents")),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("clients", { ...args, status: "active" });
    await logActivity(ctx, {
      entityType: "client",
      entityId: id,
      activityType: "created",
      content: `Client "${args.firstName} ${args.lastName}" added.`,
      agentId: args.agentId as any,
    });
    return id;
  },
});

export const update = mutation({
  args: {
    id:                     v.id("clients"),
    clientType:             v.optional(clientTypeV),
    firstName:              v.optional(v.string()),
    lastName:               v.optional(v.string()),
    email:                  v.optional(v.string()),
    phone:                  v.optional(v.string()),
    nationality:            v.optional(v.string()),
    budgetMin:              v.optional(v.number()),
    budgetMax:              v.optional(v.number()),
    preferredPropertyTypes: v.optional(v.array(v.string())),
    preferredLocations:     v.optional(v.array(v.string())),
    notes:                  v.optional(v.string()),
    agentId:                v.optional(v.id("agents")),
  },
  handler: async (ctx, { id, ...patch }) => {
    await ctx.db.patch(id, patch);
    await logActivity(ctx, {
      entityType: "client",
      entityId: id,
      activityType: "updated",
      content: "Client profile updated.",
    });
  },
});

export const updateStatus = mutation({
  args: { id: v.id("clients"), status: statusV },
  handler: async (ctx, { id, status }) => {
    const prev = await ctx.db.get(id);
    if (!prev) throw new Error("Client not found.");
    await ctx.db.patch(id, { status });
    await logActivity(ctx, {
      entityType: "client",
      entityId: id,
      activityType: "status_change",
      content: `Status changed from "${prev.status}" to "${status}".`,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("clients") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

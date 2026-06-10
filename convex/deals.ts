import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { logActivity, calculateCommission } from "./helpers";

// ─── Validators ───────────────────────────────────────────────────────────────

const stageV    = v.union(
  v.literal("lead"), v.literal("viewing"), v.literal("offer"),
  v.literal("contract"), v.literal("closed"), v.literal("cancelled")
);
const dealTypeV = v.union(v.literal("sale"), v.literal("rent"));

// ─── Queries ──────────────────────────────────────────────────────────────────

export const list = query({
  args: {
    stage:    v.optional(stageV),
    agentId:  v.optional(v.id("agents")),
    dealType: v.optional(dealTypeV),
  },
  handler: async (ctx, { stage, agentId, dealType }) => {
    let base = ctx.db.query("deals");

    if (stage) {
      base = base.withIndex("by_stage", (q) => q.eq("stage", stage)) as any;
    } else if (agentId) {
      base = base.withIndex("by_agent", (q) => q.eq("agentId", agentId)) as any;
    }

    const deals = await base.collect();

    return deals.filter((d) => {
      if (dealType && d.dealType !== dealType) return false;
      if (agentId && d.agentId !== agentId) return false;
      return true;
    });
  },
});

// Pipeline view: all active deals grouped by stage with hydrated data
export const pipeline = query({
  args: { agentId: v.optional(v.id("agents")) },
  handler: async (ctx, { agentId }) => {
    let base = ctx.db.query("deals");
    if (agentId) {
      base = base.withIndex("by_agent", (q) => q.eq("agentId", agentId)) as any;
    }

    const deals = await base.collect();
    const active = deals.filter((d) => d.stage !== "cancelled" && d.stage !== "closed");

    // Batch-load all related records in parallel — no waterfall
    const [properties, buyers, sellers, agents] = await Promise.all([
      Promise.all([...new Set(active.map((d) => d.propertyId))].map((id) => ctx.db.get(id))),
      Promise.all([...new Set(active.filter((d) => d.buyerId).map((d) => d.buyerId!))].map((id) => ctx.db.get(id))),
      Promise.all([...new Set(active.filter((d) => d.sellerId).map((d) => d.sellerId!))].map((id) => ctx.db.get(id))),
      Promise.all([...new Set(active.map((d) => d.agentId))].map((id) => ctx.db.get(id))),
    ]);

    const propMap    = Object.fromEntries(properties.filter(Boolean).map((p) => [p!._id, p]));
    const buyerMap   = Object.fromEntries(buyers.filter(Boolean).map((c) => [c!._id, c]));
    const sellerMap  = Object.fromEntries(sellers.filter(Boolean).map((c) => [c!._id, c]));
    const agentMap   = Object.fromEntries(agents.filter(Boolean).map((a) => [a!._id, a]));

    return active.map((d) => ({
      ...d,
      property: propMap[d.propertyId],
      buyer:    d.buyerId ? buyerMap[d.buyerId] : null,
      seller:   d.sellerId ? sellerMap[d.sellerId] : null,
      agent:    agentMap[d.agentId],
    }));
  },
});

export const getById = query({
  args: { id: v.id("deals") },
  handler: async (ctx, { id }) => {
    const deal = await ctx.db.get(id);
    if (!deal) return null;

    const [property, buyer, seller, agent, activity] = await Promise.all([
      ctx.db.get(deal.propertyId),
      deal.buyerId  ? ctx.db.get(deal.buyerId)  : null,
      deal.sellerId ? ctx.db.get(deal.sellerId) : null,
      ctx.db.get(deal.agentId),
      ctx.db.query("activity")
        .withIndex("by_entity", (q) => q.eq("entityType", "deal").eq("entityId", id))
        .order("desc")
        .take(50),
    ]);

    return { deal, property, buyer, seller, agent, activity };
  },
});

export const listAll = query({
  args: {
    stage:    v.optional(stageV),
    dealType: v.optional(dealTypeV),
  },
  handler: async (ctx, { stage, dealType }) => {
    let base = ctx.db.query("deals");
    if (stage) {
      base = base.withIndex("by_stage", (q) => q.eq("stage", stage)) as any;
    }
    const all = await base.collect();
    const filtered = all.filter((d) => !dealType || d.dealType === dealType);
    if (!filtered.length) return [];

    const propertyIds = [...new Set(filtered.map((d) => d.propertyId))];
    const buyerIds    = [...new Set(filtered.filter((d) => d.buyerId).map((d) => d.buyerId!))];
    const sellerIds   = [...new Set(filtered.filter((d) => d.sellerId).map((d) => d.sellerId!))];

    const [properties, buyers, sellers] = await Promise.all([
      Promise.all(propertyIds.map((id) => ctx.db.get(id))),
      Promise.all(buyerIds.map((id) => ctx.db.get(id))),
      Promise.all(sellerIds.map((id) => ctx.db.get(id))),
    ]);

    const propMap   = Object.fromEntries(properties.filter(Boolean).map((p) => [p!._id, p]));
    const buyerMap  = Object.fromEntries(buyers.filter(Boolean).map((c) => [c!._id, c]));
    const sellerMap = Object.fromEntries(sellers.filter(Boolean).map((c) => [c!._id, c]));

    return filtered
      .sort((a, b) => b._creationTime - a._creationTime)
      .map((d) => ({
        _id:             d._id,
        _creationTime:   d._creationTime,
        stage:           d.stage,
        dealType:        d.dealType,
        listPrice:       d.listPrice,
        agreedPrice:     d.agreedPrice,
        commissionRate:  d.commissionRate,
        commissionAmount: d.commissionAmount,
        propertyName:  propMap[d.propertyId]?.name ?? "Unknown Property",
        buyerName:  d.buyerId  && buyerMap[d.buyerId]
          ? `${buyerMap[d.buyerId]!.firstName} ${buyerMap[d.buyerId]!.lastName}` : null,
        sellerName: d.sellerId && sellerMap[d.sellerId]
          ? `${sellerMap[d.sellerId]!.firstName} ${sellerMap[d.sellerId]!.lastName}` : null,
      }));
  },
});

export const search = query({
  args: { q: v.string() },
  handler: async (ctx, { q }) => {
    const all = await ctx.db.query("deals").collect();
    const propertyIds = [...new Set(all.map((d) => d.propertyId))];
    const properties = await Promise.all(propertyIds.map((id) => ctx.db.get(id)));
    const propMap = Object.fromEntries(
      properties.filter(Boolean).map((p) => [p!._id, p])
    );
    const lower = q.toLowerCase();
    return all
      .filter((d) => (propMap[d.propertyId]?.name ?? "").toLowerCase().includes(lower))
      .slice(0, 5)
      .map((d) => ({
        _id: d._id,
        stage: d.stage,
        dealType: d.dealType,
        listPrice: d.listPrice,
        agreedPrice: d.agreedPrice,
        propertyName: propMap[d.propertyId]?.name ?? "Unknown",
      }));
  },
});

// ─── Mutations ────────────────────────────────────────────────────────────────

export const create = mutation({
  args: {
    propertyId:     v.id("properties"),
    buyerId:        v.optional(v.id("clients")),
    sellerId:       v.optional(v.id("clients")),
    agentId:        v.id("agents"),
    dealType:       dealTypeV,
    listPrice:      v.number(),
    agreedPrice:    v.optional(v.number()),
    commissionRate: v.number(),
    contractDate:   v.optional(v.number()),
    handoverDate:   v.optional(v.number()),
    notes:          v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const commissionAmount = args.agreedPrice
      ? calculateCommission(args.agreedPrice, args.commissionRate)
      : undefined;

    const id = await ctx.db.insert("deals", {
      ...args,
      stage: "lead",
      commissionAmount,
    });

    await logActivity(ctx, {
      entityType: "deal",
      entityId: id,
      activityType: "created",
      content: `Deal created at "${args.listPrice}" — stage: Lead.`,
      agentId: args.agentId as any,
    });

    return id;
  },
});

export const update = mutation({
  args: {
    id:             v.id("deals"),
    buyerId:        v.optional(v.id("clients")),
    sellerId:       v.optional(v.id("clients")),
    agentId:        v.optional(v.id("agents")),
    listPrice:      v.optional(v.number()),
    agreedPrice:    v.optional(v.number()),
    commissionRate: v.optional(v.number()),
    contractDate:   v.optional(v.number()),
    handoverDate:   v.optional(v.number()),
    notes:          v.optional(v.string()),
  },
  handler: async (ctx, { id, agreedPrice, commissionRate, ...rest }) => {
    const current = await ctx.db.get(id);
    if (!current) throw new Error("Deal not found.");

    const rate   = commissionRate ?? current.commissionRate;
    const price  = agreedPrice   ?? current.agreedPrice;
    const commissionAmount = price ? calculateCommission(price, rate) : undefined;

    await ctx.db.patch(id, { ...rest, agreedPrice, commissionRate, commissionAmount });
    await logActivity(ctx, {
      entityType: "deal",
      entityId: id,
      activityType: "updated",
      content: "Deal details updated.",
    });
  },
});

export const advanceStage = mutation({
  args: {
    id:      v.id("deals"),
    stage:   stageV,
    agentId: v.optional(v.id("agents")),
  },
  handler: async (ctx, { id, stage, agentId }) => {
    const prev = await ctx.db.get(id);
    if (!prev) throw new Error("Deal not found.");
    await ctx.db.patch(id, { stage });
    await logActivity(ctx, {
      entityType: "deal",
      entityId: id,
      activityType: "status_change",
      content: `Stage advanced from "${prev.stage}" to "${stage}".`,
      agentId: agentId as any,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("deals") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

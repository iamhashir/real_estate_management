import { query } from "./_generated/server";
import { v } from "convex/values";

// Single query that powers the entire dashboard — one round-trip, no N+1.
// All aggregation happens server-side in Convex; the client gets clean numbers.

export const stats = query({
  args: { agentId: v.optional(v.id("agents")) },
  handler: async (ctx, { agentId }) => {
    // Fetch raw collections — filtered by agent if scoped
    const [allProperties, allDeals, allClients] = await Promise.all([
      ctx.db.query("properties").collect(),
      ctx.db.query("deals").collect(),
      ctx.db.query("clients").collect(),
    ]);

    const properties = agentId
      ? allProperties.filter((p) => p.agentId === agentId)
      : allProperties;

    const deals = agentId
      ? allDeals.filter((d) => d.agentId === agentId)
      : allDeals;

    const clients = agentId
      ? allClients.filter((c) => c.agentId === agentId)
      : allClients;

    // ── Property stats
    const propertiesByStatus = properties.reduce<Record<string, number>>((acc, p) => {
      acc[p.status] = (acc[p.status] ?? 0) + 1;
      return acc;
    }, {});

    // ── Deal stats
    const dealsByStage = deals.reduce<Record<string, number>>((acc, d) => {
      acc[d.stage] = (acc[d.stage] ?? 0) + 1;
      return acc;
    }, {});

    const closedDeals = deals.filter((d) => d.stage === "closed");

    const totalRevenue       = closedDeals.reduce((s, d) => s + (d.agreedPrice ?? 0), 0);
    const totalCommission    = closedDeals.reduce((s, d) => s + (d.commissionAmount ?? 0), 0);

    // This month's closed deals
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const dealsThisMonth = closedDeals.filter(
      (d) => d.contractDate && d.contractDate >= startOfMonth.getTime()
    );

    const revenueThisMonth     = dealsThisMonth.reduce((s, d) => s + (d.agreedPrice ?? 0), 0);
    const commissionThisMonth  = dealsThisMonth.reduce((s, d) => s + (d.commissionAmount ?? 0), 0);

    // ── Pipeline: active deals with hydrated property + client names
    const activeDeals = deals.filter((d) => d.stage !== "closed" && d.stage !== "cancelled");

    const [hydratedProperties, hydratedBuyers] = await Promise.all([
      Promise.all([...new Set(activeDeals.map((d) => d.propertyId))].map((id) => ctx.db.get(id))),
      Promise.all(
        [...new Set(activeDeals.filter((d) => d.buyerId).map((d) => d.buyerId!))]
          .map((id) => ctx.db.get(id))
      ),
    ]);

    const propMap  = Object.fromEntries(hydratedProperties.filter(Boolean).map((p) => [p!._id, p]));
    const buyerMap = Object.fromEntries(hydratedBuyers.filter(Boolean).map((c) => [c!._id, c]));

    const pipeline = activeDeals.map((d) => ({
      _id:          d._id,
      stage:        d.stage,
      dealType:     d.dealType,
      listPrice:    d.listPrice,
      agreedPrice:  d.agreedPrice,
      propertyName: propMap[d.propertyId]?.name ?? "Unknown Property",
      buyerName:    d.buyerId ? (() => { const b = buyerMap[d.buyerId]; return b ? `${b.firstName} ${b.lastName}` : null; })() : null,
    }));

    return {
      overview: {
        totalProperties:     properties.length,
        activeListings:      propertiesByStatus["available"] ?? 0,
        totalClients:        clients.length,
        activeClients:       clients.filter((c) => c.status === "active").length,
        closedDealsAllTime:  closedDeals.length,
        closedDealsThisMonth: dealsThisMonth.length,
        totalRevenue,
        totalCommission,
        revenueThisMonth,
        commissionThisMonth,
      },
      propertiesByStatus,
      dealsByStage,
      pipeline,
    };
  },
});

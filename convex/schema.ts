import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// ─── Shared validators ────────────────────────────────────────────────────────
// Reused across tables — change once, applies everywhere.

const propertyTypeV = v.union(
  v.literal("villa"),
  v.literal("apartment"),
  v.literal("office"),
  v.literal("land"),
  v.literal("commercial")
);

const listingTypeV = v.union(v.literal("sale"), v.literal("rent"));

const propertyStatusV = v.union(
  v.literal("available"),
  v.literal("under_negotiation"),
  v.literal("sold"),
  v.literal("rented")
);

const clientTypeV = v.union(
  v.literal("buyer"),
  v.literal("seller"),
  v.literal("both")
);

const clientStatusV = v.union(
  v.literal("active"),
  v.literal("inactive"),
  v.literal("closed")
);

const dealStageV = v.union(
  v.literal("lead"),
  v.literal("viewing"),
  v.literal("offer"),
  v.literal("contract"),
  v.literal("closed"),
  v.literal("cancelled")
);

const dealTypeV = v.union(v.literal("sale"), v.literal("rent"));

const agentRoleV = v.union(
  v.literal("agent"),
  v.literal("manager"),
  v.literal("admin")
);

const activityTypeV = v.union(
  v.literal("created"),
  v.literal("updated"),
  v.literal("note"),
  v.literal("call"),
  v.literal("viewing"),
  v.literal("offer"),
  v.literal("status_change")
);

const entityTypeV = v.union(
  v.literal("property"),
  v.literal("client"),
  v.literal("deal")
);

// ─── Schema ───────────────────────────────────────────────────────────────────

export default defineSchema({
  // Agents — team members who manage listings and close deals
  agents: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    role: agentRoleV,
    isActive: v.boolean(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_active", ["isActive"]),

  // Properties — real estate listings
  properties: defineTable({
    name: v.string(),
    address: v.string(),
    city: v.string(),
    area: v.optional(v.string()),
    type: propertyTypeV,
    listingType: listingTypeV,
    status: propertyStatusV,
    price: v.number(),
    size: v.number(),                                  // sqm
    bedrooms: v.optional(v.number()),
    bathrooms: v.optional(v.number()),
    floor: v.optional(v.number()),
    features: v.optional(v.array(v.string())),
    description: v.optional(v.string()),
    agentId: v.optional(v.id("agents")),
  })
    .index("by_status", ["status"])
    .index("by_type", ["type"])
    .index("by_listing_type", ["listingType"])
    .index("by_city", ["city"])
    .index("by_agent", ["agentId"])
    .index("by_status_type", ["status", "type"]),

  // Clients — buyers and/or sellers
  clients: defineTable({
    clientType: clientTypeV,
    firstName: v.string(),
    lastName: v.string(),
    email: v.optional(v.string()),
    phone: v.string(),
    nationality: v.optional(v.string()),
    budgetMin: v.optional(v.number()),
    budgetMax: v.optional(v.number()),
    preferredPropertyTypes: v.optional(v.array(v.string())),
    preferredLocations: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    status: clientStatusV,
    agentId: v.optional(v.id("agents")),
  })
    .index("by_client_type", ["clientType"])
    .index("by_status", ["status"])
    .index("by_agent", ["agentId"]),

  // Deals — the core transaction joining property + buyer + seller + agent
  deals: defineTable({
    propertyId: v.id("properties"),
    buyerId: v.optional(v.id("clients")),
    sellerId: v.optional(v.id("clients")),
    agentId: v.id("agents"),
    dealType: dealTypeV,
    stage: dealStageV,
    listPrice: v.number(),
    agreedPrice: v.optional(v.number()),
    commissionRate: v.number(),    // percent (e.g. 2 = 2%)
    commissionAmount: v.optional(v.number()),
    contractDate: v.optional(v.number()),
    handoverDate: v.optional(v.number()),
    notes: v.optional(v.string()),
  })
    .index("by_stage", ["stage"])
    .index("by_property", ["propertyId"])
    .index("by_buyer", ["buyerId"])
    .index("by_seller", ["sellerId"])
    .index("by_agent", ["agentId"])
    .index("by_deal_type", ["dealType"]),

  // Activity — append-only log for properties, clients, and deals
  activity: defineTable({
    entityType: entityTypeV,
    entityId: v.string(),          // stored as string for polymorphic FK
    activityType: activityTypeV,
    content: v.string(),
    agentId: v.optional(v.id("agents")),
  })
    .index("by_entity", ["entityType", "entityId"])
    .index("by_agent", ["agentId"]),
});

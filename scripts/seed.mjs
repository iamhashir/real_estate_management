// Seeds the live Convex deployment with realistic Dubai data by calling the
// already-deployed public mutations. No CLI auth needed — just the URL.
//
//   node scripts/seed.mjs           # seeds only if empty
//   node scripts/seed.mjs --force   # seeds regardless
//
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import { readFileSync } from "node:fs";

// Read NEXT_PUBLIC_CONVEX_URL from .env.local
const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const url = env.match(/NEXT_PUBLIC_CONVEX_URL=(.+)/)?.[1]?.trim();
if (!url) throw new Error("NEXT_PUBLIC_CONVEX_URL not found in .env.local");

const client = new ConvexHttpClient(url);
const force = process.argv.includes("--force");

const MONTH_START = (() => {
  const d = new Date();
  d.setDate(1); d.setHours(0, 0, 0, 0);
  return d.getTime();
})();

async function main() {
  const existing = await client.query(api.properties.countByStatus, {});
  const count = Object.values(existing ?? {}).reduce((a, b) => a + b, 0);
  if (count > 0 && !force) {
    console.log(`Deployment already has ${count} properties — skipping. Use --force to seed anyway.`);
    return;
  }

  console.log("Seeding agents…");
  const layla = await client.mutation(api.agents.create, {
    name: "Layla Haddad", email: "layla@harbour.ae", phone: "+971 50 111 2233", role: "manager",
  });
  const omar = await client.mutation(api.agents.create, {
    name: "Omar Farouk", email: "omar@harbour.ae", phone: "+971 50 444 5566", role: "agent",
  });
  const agents = [layla, omar];

  console.log("Seeding properties…");
  const props = await Promise.all([
    client.mutation(api.properties.create, {
      name: "Marina Gate 2 — 2BR Sea View", address: "Marina Gate, Tower 2", city: "Dubai", area: "Dubai Marina",
      type: "apartment", listingType: "sale", price: 2850000, size: 112, bedrooms: 2, bathrooms: 3, floor: 34,
      features: ["Sea View", "Balcony", "Gym", "Swimming Pool", "Central A/C"], agentId: layla,
      description: "High-floor 2BR with full Marina and sea views, vacant on transfer.",
    }),
    client.mutation(api.properties.create, {
      name: "Palm Signature Villa", address: "Frond K, Palm Jumeirah", city: "Dubai", area: "Palm Jumeirah",
      type: "villa", listingType: "sale", price: 23500000, size: 650, bedrooms: 5, bathrooms: 6,
      features: ["Private Pool", "Sea View", "Garden", "Maid's Room", "Security"], agentId: layla,
    }),
    client.mutation(api.properties.create, {
      name: "Downtown Boulevard 1BR", address: "Boulevard Point", city: "Dubai", area: "Downtown Dubai",
      type: "apartment", listingType: "rent", price: 145000, size: 78, bedrooms: 1, bathrooms: 1, floor: 18,
      features: ["City View", "Gym", "Furnished", "Central A/C"], agentId: omar,
    }),
    client.mutation(api.properties.create, {
      name: "Business Bay Office Floor", address: "The Prism", city: "Dubai", area: "Business Bay",
      type: "office", listingType: "rent", price: 320000, size: 240, floor: 12,
      features: ["City View", "Parking", "Security"], agentId: omar,
    }),
    client.mutation(api.properties.create, {
      name: "Arabian Ranches 4BR", address: "Palmera 3", city: "Dubai", area: "Arabian Ranches",
      type: "villa", listingType: "sale", price: 5400000, size: 360, bedrooms: 4, bathrooms: 4,
      features: ["Garden", "Maid's Room", "Storage", "Parking"], agentId: layla,
    }),
    client.mutation(api.properties.create, {
      name: "JVC Land Plot", address: "District 12", city: "Dubai", area: "Jumeirah Village Circle",
      type: "land", listingType: "sale", price: 4100000, size: 520, agentId: omar,
    }),
    client.mutation(api.properties.create, {
      name: "Reem Island 3BR", address: "Tower C", city: "Abu Dhabi", area: "Al Reem Island",
      type: "apartment", listingType: "sale", price: 2200000, size: 165, bedrooms: 3, bathrooms: 3, floor: 22,
      features: ["Sea View", "Gym", "Swimming Pool"], agentId: omar,
    }),
    client.mutation(api.properties.create, {
      name: "Al Majaz Retail Unit", address: "Al Majaz Waterfront", city: "Sharjah", area: "Al Majaz",
      type: "commercial", listingType: "rent", price: 210000, size: 95,
      features: ["City View", "Parking"], agentId: layla,
    }),
  ]);

  console.log("Seeding clients…");
  const clients = await Promise.all([
    client.mutation(api.clients.create, {
      clientType: "buyer", firstName: "Sara", lastName: "Al Mansoori", phone: "+971 55 200 3000",
      email: "sara.m@example.ae", nationality: "Emirati", budgetMin: 2000000, budgetMax: 3500000,
      preferredPropertyTypes: ["apartment", "villa"], preferredLocations: ["Dubai Marina, Dubai", "Palm Jumeirah, Dubai"],
      notes: "Prefers high floor with sea view. Ready to transfer within 60 days.", agentId: layla,
    }),
    client.mutation(api.clients.create, {
      clientType: "buyer", firstName: "James", lastName: "Whitmore", phone: "+971 52 700 8000",
      email: "jwhitmore@example.com", nationality: "British", budgetMin: 4000000, budgetMax: 7000000,
      preferredPropertyTypes: ["villa"], preferredLocations: ["Arabian Ranches, Dubai"], agentId: layla,
    }),
    client.mutation(api.clients.create, {
      clientType: "seller", firstName: "Priya", lastName: "Nair", phone: "+971 50 900 1000",
      email: "priya.nair@example.com", nationality: "Indian", agentId: omar,
      notes: "Selling the Reem Island 3BR — motivated, flexible on price.",
    }),
    client.mutation(api.clients.create, {
      clientType: "both", firstName: "Khalid", lastName: "Rahman", phone: "+971 56 121 3434",
      email: "khalid.r@example.ae", nationality: "Pakistani", budgetMin: 1000000, budgetMax: 2500000,
      preferredPropertyTypes: ["apartment", "office"], preferredLocations: ["Business Bay, Dubai"], agentId: omar,
    }),
    client.mutation(api.clients.create, {
      clientType: "buyer", firstName: "Elena", lastName: "Petrova", phone: "+971 54 660 7788",
      email: "elena.p@example.com", nationality: "Russian", budgetMin: 15000000, budgetMax: 30000000,
      preferredPropertyTypes: ["villa"], preferredLocations: ["Palm Jumeirah, Dubai"],
      notes: "Cash buyer. Looking for a signature villa on the Palm.", agentId: layla,
    }),
    client.mutation(api.clients.create, {
      clientType: "buyer", firstName: "Marcus", lastName: "Lindqvist", phone: "+971 58 330 2211",
      email: "marcus.l@example.com", nationality: "Other", budgetMin: 100000, budgetMax: 180000,
      preferredPropertyTypes: ["apartment"], preferredLocations: ["Downtown Dubai, Dubai"], agentId: omar,
    }),
  ]);

  console.log("Seeding deals…");
  // [propertyIdx, buyerIdx|null, sellerIdx|null, agent, type, list, agreed, rate, stage]
  const dealSpecs = [
    [0, 0, null, layla, "sale", 2850000, 2780000, 2, "offer"],
    [1, 4, null, layla, "sale", 23500000, null, 2, "viewing"],
    [2, 5, null, omar, "rent", 145000, 145000, 5, "contract"],
    [6, null, 2, omar, "sale", 2200000, 2150000, 2, "closed"],
    [4, 1, null, layla, "sale", 5400000, 5250000, 2, "closed"],
    [3, 3, null, omar, "rent", 320000, null, 5, "lead"],
  ];

  for (const [pi, bi, si, agent, type, list, agreed, rate, stage] of dealSpecs) {
    const id = await client.mutation(api.deals.create, {
      propertyId: props[pi],
      buyerId: bi != null ? clients[bi] : undefined,
      sellerId: si != null ? clients[si] : undefined,
      agentId: agent,
      dealType: type,
      listPrice: list,
      agreedPrice: agreed ?? undefined,
      commissionRate: rate,
      contractDate: stage === "closed" || stage === "contract" ? MONTH_START + 3 * 86400000 : undefined,
    });
    if (stage !== "lead") {
      await client.mutation(api.deals.advanceStage, { id, stage, agentId: agent });
    }
    // Mark closed-deal properties as sold/rented for accurate inventory
    if (stage === "closed") {
      await client.mutation(api.properties.updateStatus, {
        id: props[pi], status: type === "rent" ? "rented" : "sold", agentId: agent,
      });
    }
  }

  console.log(`✓ Seeded ${agents.length} agents, ${props.length} properties, ${clients.length} clients, ${dealSpecs.length} deals.`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });

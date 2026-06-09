import { v } from "convex/values";
import type { QueryCtx, MutationCtx } from "./_generated/server";

// ─── Pagination ───────────────────────────────────────────────────────────────

export const paginationOptsV = v.object({
  cursor: v.union(v.string(), v.null()),
  numItems: v.number(),
});

// ─── Timestamp ────────────────────────────────────────────────────────────────

export function now(): number {
  return Date.now();
}

// ─── Activity helpers ─────────────────────────────────────────────────────────

export async function logActivity(
  ctx: MutationCtx,
  args: {
    entityType: "property" | "client" | "deal";
    entityId: string;
    activityType:
      | "created"
      | "updated"
      | "note"
      | "call"
      | "viewing"
      | "offer"
      | "status_change";
    content: string;
    agentId?: string;
  }
) {
  await ctx.db.insert("activity", {
    entityType: args.entityType,
    entityId: args.entityId,
    activityType: args.activityType,
    content: args.content,
    agentId: args.agentId as any,
  });
}

// ─── Commission ───────────────────────────────────────────────────────────────

export function calculateCommission(price: number, ratePercent: number): number {
  return Math.round((price * ratePercent) / 100);
}

// ─── Guard: require existing doc ──────────────────────────────────────────────

export async function requireDoc<T extends { _id: string }>(
  ctx: QueryCtx | MutationCtx,
  table: string,
  id: any
): Promise<T> {
  const doc = await (ctx.db as any).get(id);
  if (!doc) throw new Error(`${table} not found: ${id}`);
  return doc as T;
}

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { DashboardStats } from "@/lib/types";

export function useDashboard(agentId?: string) {
  const result = useQuery(
    api.dashboard.stats,
    agentId ? { agentId: agentId as any } : {}
  );
  return {
    stats:     (result ?? null) as DashboardStats | null,
    isLoading: result === undefined,
  };
}

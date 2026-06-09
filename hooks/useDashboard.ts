import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useDashboard(agentId?: string) {
  const result = useQuery(
    api.dashboard.stats,
    agentId ? { agentId: agentId as any } : {}
  );
  return {
    stats:     result ?? null,
    isLoading: result === undefined,
  };
}

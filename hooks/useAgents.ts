import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Agent } from "@/lib/types";

export function useAgents(onlyActive?: boolean) {
  const result = useQuery(api.agents.list, onlyActive ? { onlyActive: true } : {});
  return {
    agents:    (result ?? []) as Agent[],
    isLoading: result === undefined,
  };
}

/**
 * The "logged-in" agent. This app has no auth yet, so we treat the first
 * active agent as the current user — enough to attribute mutations and
 * render the sidebar identity. Swap for real auth when it lands.
 */
export function useCurrentAgent() {
  const result = useQuery(api.agents.list, { onlyActive: true });
  return {
    agent:     (result?.[0] ?? null) as Agent | null,
    isLoading: result === undefined,
  };
}

export function useCreateAgent() {
  return useMutation(api.agents.create);
}

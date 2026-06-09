import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { DealStage, DealType } from "@/lib/constants";
import type { Deal, HydratedDeal } from "@/lib/types";

export function useDeals(filters?: {
  stage?: DealStage;
  agentId?: string;
  dealType?: DealType;
}) {
  const result = useQuery(api.deals.list, (filters ?? {}) as any);
  return {
    deals:     (result ?? []) as Deal[],
    isLoading: result === undefined,
  };
}

export function usePipeline(agentId?: string) {
  const result = useQuery(api.deals.pipeline, agentId ? { agentId: agentId as any } : {});
  return {
    deals:     (result ?? []) as HydratedDeal[],
    isLoading: result === undefined,
  };
}

export function useDeal(id: string | null) {
  return useQuery(api.deals.getById, id ? { id: id as any } : "skip");
}

export function useCreateDeal() {
  return useMutation(api.deals.create);
}

export function useUpdateDeal() {
  return useMutation(api.deals.update);
}

export function useAdvanceDealStage() {
  return useMutation(api.deals.advanceStage);
}

export function useDeleteDeal() {
  return useMutation(api.deals.remove);
}

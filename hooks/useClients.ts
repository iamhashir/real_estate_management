import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { ClientType, ClientStatus } from "@/lib/constants";
import type { Client, ClientProfile } from "@/lib/types";

export function useClients(filters?: {
  clientType?: ClientType;
  status?: ClientStatus;
  agentId?: string;
  search?: string;
}) {
  const result = useQuery(api.clients.list, (filters ?? {}) as any);
  return {
    clients:   (result ?? []) as Client[],
    isLoading: result === undefined,
  };
}

export function useClient(id: string | null) {
  return useQuery(api.clients.getById, id ? { id: id as any } : "skip");
}

export function useClientProfile(id: string | null) {
  return useQuery(api.clients.getProfile, id ? { id: id as any } : "skip") as
    | ClientProfile
    | null
    | undefined;
}

export function useCreateClient() {
  return useMutation(api.clients.create);
}

export function useUpdateClient() {
  return useMutation(api.clients.update);
}

export function useUpdateClientStatus() {
  return useMutation(api.clients.updateStatus);
}

export function useDeleteClient() {
  return useMutation(api.clients.remove);
}

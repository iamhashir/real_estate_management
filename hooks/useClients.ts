import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { ClientType, ClientStatus } from "@/lib/constants";

export function useClients(filters?: {
  clientType?: ClientType;
  status?: ClientStatus;
  agentId?: string;
  search?: string;
}) {
  const result = useQuery(api.clients.list, filters ?? {});
  return {
    clients:   result ?? [],
    isLoading: result === undefined,
  };
}

export function useClient(id: string | null) {
  return useQuery(api.clients.getById, id ? { id: id as any } : "skip");
}

export function useClientProfile(id: string | null) {
  return useQuery(api.clients.getProfile, id ? { id: id as any } : "skip");
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

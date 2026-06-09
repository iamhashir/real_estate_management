import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { PropertyStatus, PropertyType, ListingType } from "@/lib/constants";
import { PAGE_SIZE } from "@/lib/constants";
import type { Property } from "@/lib/types";
import { useState } from "react";

export function useProperties(filters?: {
  status?: PropertyStatus;
  type?: PropertyType;
  listingType?: ListingType;
  city?: string;
  agentId?: string;
}) {
  const [cursor, setCursor] = useState<string | null>(null);

  const result = useQuery(api.properties.list, {
    ...filters,
    paginationOpts: { cursor, numItems: PAGE_SIZE },
  } as any);

  return {
    properties:  (result?.page ?? []) as Property[],
    totalCount:  (result?.totalCount ?? 0) as number,
    hasMore:     !!result?.nextCursor,
    loadMore:    () => result?.nextCursor && setCursor(result.nextCursor),
    isLoading:   result === undefined,
  };
}

export function useProperty(id: string | null) {
  return useQuery(api.properties.getById, id ? { id: id as any } : "skip");
}

export function usePropertyCounts() {
  return useQuery(api.properties.countByStatus, {});
}

export function useCreateProperty() {
  return useMutation(api.properties.create);
}

export function useUpdateProperty() {
  return useMutation(api.properties.update);
}

export function useUpdatePropertyStatus() {
  return useMutation(api.properties.updateStatus);
}

export function useDeleteProperty() {
  return useMutation(api.properties.remove);
}

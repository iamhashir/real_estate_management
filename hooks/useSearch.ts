"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function usePropertySearch(q: string) {
  return useQuery(api.properties.search, q.length >= 2 ? { q } : "skip") as any[] | undefined;
}

export function useClientSearch(q: string) {
  return useQuery(api.clients.search, q.length >= 2 ? { q } : "skip") as any[] | undefined;
}

export function useDealSearch(q: string) {
  return useQuery(api.deals.search, q.length >= 2 ? { q } : "skip") as any[] | undefined;
}

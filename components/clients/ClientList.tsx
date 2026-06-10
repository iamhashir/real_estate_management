"use client";

import { useState } from "react";
import { Search, Plus, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, Skeleton, EmptyState } from "@/components/ui";
import { ClientListItem } from "./ClientListItem";
import { CLIENT_TYPES, type ClientType } from "@/lib/constants";
import { useClients } from "@/hooks/useClients";

interface ClientListProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
}

export function ClientList({ selectedId, onSelect, onCreate }: ClientListProps) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<ClientType | undefined>();

  const { clients, isLoading } = useClients({
    search: search.trim() || undefined,
    clientType: type,
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-hairline shrink-0 space-y-3 bg-surface-card sticky top-0 z-10">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-h2 text-ink-900">Clients</h1>
          <Button size="sm" leftIcon={<Plus size={15} />} onClick={onCreate}>New</Button>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or phone…"
            className="w-full h-9 pl-9 pr-3 rounded-md text-base md:text-sm bg-surface-base border border-hairline text-ink-900 placeholder:text-ink-400 outline-none focus:border-aqua-400 focus:shadow-glow transition-all"
          />
        </div>
        <div className="flex gap-1.5">
          {CLIENT_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setType(type === t.value ? undefined : t.value)}
              className={cn(
                "px-3 py-2 rounded-full text-sm font-medium transition-colors border min-h-[44px]",
                type === t.value
                  ? "bg-aqua-100 text-sea-800 border-aqua-300"
                  : "bg-surface-card text-ink-600 border-hairline hover:border-aqua-300"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-md" />)}
          </div>
        ) : clients.length === 0 ? (
          <EmptyState
            icon={<Users size={22} />}
            title={search || type ? "No matches" : "No clients yet"}
            description={search || type ? "Try a different search or filter." : "Add your first client to get started."}
            action={!search && !type ? <Button onClick={onCreate}>Add Client</Button> : undefined}
          />
        ) : (
          <div className="divide-y divide-hairline">
            {clients.map((c) => (
              <ClientListItem
                key={c._id}
                client={c}
                active={c._id === selectedId}
                onClick={() => onSelect(c._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

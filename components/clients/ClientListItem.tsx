"use client";

import { cn, fullName } from "@/lib/utils";
import { Avatar, StatusPill, Badge } from "@/components/ui";
import { CLIENT_TYPES } from "@/lib/constants";
import type { Client } from "@/lib/types";

function typeLabel(value: string) {
  return CLIENT_TYPES.find((t) => t.value === value)?.label ?? value;
}

interface ClientListItemProps {
  client: Client;
  active: boolean;
  onClick: () => void;
}

export function ClientListItem({ client, active, onClick }: ClientListItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left flex items-center gap-3 px-4 py-3 transition-colors min-h-[44px]",
        "border-l-2",
        active
          ? "bg-aqua-100 border-l-aqua-500"
          : "border-l-transparent hover:bg-surface-base"
      )}
    >
      <Avatar firstName={client.firstName} lastName={client.lastName} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium text-ink-900 truncate">
            {fullName(client.firstName, client.lastName)}
          </p>
          <StatusPill value={client.status} variant="client" />
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-xs text-ink-400 truncate">{client.phone}</p>
          <Badge color="muted" size="sm">{typeLabel(client.clientType)}</Badge>
        </div>
      </div>
    </button>
  );
}

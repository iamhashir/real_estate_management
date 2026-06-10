"use client";

import {
  Avatar, StatusPill, Badge, Card, Skeleton, EmptyState, Reveal,
} from "@/components/ui";
import { ClientDealRow } from "./ClientDealRow";
import { fullName, formatCurrency, formatRelativeDate } from "@/lib/utils";
import { CLIENT_TYPES, PROPERTY_TYPES } from "@/lib/constants";
import { useClientProfile } from "@/hooks/useClients";
import {
  Mail, Phone, Globe, Wallet, FileSignature, Activity as ActivityIcon,
  PlusCircle, Pencil, MessageSquare, Eye, FileText, RefreshCw, Trash2,
} from "lucide-react";
import type { Property } from "@/lib/types";

function typeLabel(value: string) {
  return CLIENT_TYPES.find((t) => t.value === value)?.label ?? value;
}
function propTypeLabel(value: string) {
  return PROPERTY_TYPES.find((t) => t.value === value)?.label ?? value;
}

const ACTIVITY_ICON: Record<string, React.ReactNode> = {
  created: <PlusCircle size={14} />,
  updated: <Pencil size={14} />,
  note: <MessageSquare size={14} />,
  call: <Phone size={14} />,
  viewing: <Eye size={14} />,
  offer: <FileText size={14} />,
  status_change: <RefreshCw size={14} />,
};

export function ClientProfile({ clientId, onEdit, onDelete }: { clientId: string; onEdit?: () => void; onDelete?: () => void }) {
  const profile = useClientProfile(clientId);

  if (profile === undefined) {
    return (
      <div className="p-6 space-y-4 max-w-3xl mx-auto">
        <Skeleton className="h-24 rounded-md" />
        <Skeleton className="h-40 rounded-md" />
        <Skeleton className="h-40 rounded-md" />
      </div>
    );
  }

  if (profile === null) {
    return <EmptyState title="Client not found" description="This record may have been removed." />;
  }

  const { client, deals, properties, activity } = profile;
  const propMap = new Map(
    (properties.filter(Boolean) as Property[]).map((p) => [p._id, p])
  );

  const budget =
    client.budgetMin != null || client.budgetMax != null
      ? `${formatCurrency(client.budgetMin ?? 0)} — ${formatCurrency(client.budgetMax ?? 0)}`
      : null;

  return (
    <Reveal className="p-4 md:p-6 space-y-5 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Avatar firstName={client.firstName} lastName={client.lastName} size="xl" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-h1 text-ink-900 flex-1 min-w-0">{fullName(client.firstName, client.lastName)}</h1>
            <StatusPill value={client.status} variant="client" />
            {/* Edit / Delete actions */}
            <div className="flex items-center gap-1 ml-auto shrink-0">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="w-8 h-8 rounded-md grid place-items-center text-ink-400 hover:text-sea-700 hover:bg-aqua-100 transition-colors"
                  aria-label="Edit client"
                >
                  <Pencil size={15} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="w-8 h-8 rounded-md grid place-items-center text-ink-400 hover:text-danger hover:bg-danger/10 transition-colors"
                  aria-label="Delete client"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-ink-600">
            <Badge color="sea">{typeLabel(client.clientType)}</Badge>
            <a href={`tel:${client.phone}`} className="flex items-center gap-1.5 hover:text-aqua-500">
              <Phone size={14} />{client.phone}
            </a>
            {client.email && (
              <a href={`mailto:${client.email}`} className="flex items-center gap-1.5 hover:text-aqua-500">
                <Mail size={14} />{client.email}
              </a>
            )}
            {client.nationality && (
              <span className="flex items-center gap-1.5"><Globe size={14} />{client.nationality}</span>
            )}
          </div>
        </div>
      </div>

      {/* Budget & preferences */}
      <Card className="p-5">
        <h2 className="text-h3 text-ink-900 mb-4 flex items-center gap-2">
          <Wallet size={16} className="text-aqua-500" /> Budget & Preferences
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-label text-ink-400 mb-1">Budget</p>
            <p className="text-ink-900 text-money">{budget ?? "Not specified"}</p>
          </div>
          {client.preferredPropertyTypes?.length ? (
            <div>
              <p className="text-label text-ink-400 mb-1.5">Property types</p>
              <div className="flex flex-wrap gap-1.5">
                {client.preferredPropertyTypes.map((t) => <Badge key={t} color="aqua">{propTypeLabel(t)}</Badge>)}
              </div>
            </div>
          ) : null}
          {client.preferredLocations?.length ? (
            <div>
              <p className="text-label text-ink-400 mb-1.5">Preferred locations</p>
              <div className="flex flex-wrap gap-1.5">
                {client.preferredLocations.map((l) => <Badge key={l} color="sea">{l}</Badge>)}
              </div>
            </div>
          ) : null}
        </div>
      </Card>

      {/* Deals */}
      <Card className="p-5">
        <h2 className="text-h3 text-ink-900 mb-4 flex items-center gap-2">
          <FileSignature size={16} className="text-aqua-500" /> Deals
          <span className="text-sm text-ink-400 font-normal">({deals.length})</span>
        </h2>
        {deals.length === 0 ? (
          <p className="text-sm text-ink-400">No deals linked to this client yet.</p>
        ) : (
          <div className="space-y-2">
            {deals.map((d) => (
              <ClientDealRow key={d._id} deal={d} property={propMap.get(d.propertyId) ?? null} />
            ))}
          </div>
        )}
      </Card>

      {/* Notes */}
      {client.notes && (
        <Card className="p-5">
          <h2 className="text-h3 text-ink-900 mb-2">Notes</h2>
          <p className="text-sm text-ink-700 leading-relaxed whitespace-pre-wrap">{client.notes}</p>
        </Card>
      )}

      {/* Activity */}
      <Card className="p-5">
        <h2 className="text-h3 text-ink-900 mb-4 flex items-center gap-2">
          <ActivityIcon size={16} className="text-aqua-500" /> Activity
        </h2>
        {activity.length === 0 ? (
          <p className="text-sm text-ink-400">No activity recorded.</p>
        ) : (
          <ul className="space-y-3">
            {activity.map((a) => (
              <li key={a._id} className="flex gap-3">
                <span className="mt-0.5 w-7 h-7 rounded-full bg-aqua-100 text-aqua-500 grid place-items-center shrink-0">
                  {ACTIVITY_ICON[a.activityType] ?? <ActivityIcon size={14} />}
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-ink-900">{a.content}</p>
                  <p className="text-xs text-ink-400">{formatRelativeDate(a._creationTime)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </Reveal>
  );
}

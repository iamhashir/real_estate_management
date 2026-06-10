"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, Users, FileSignature, ChevronRight } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { usePropertySearch, useClientSearch, useDealSearch } from "@/hooks/useSearch";
import { shellNav } from "@/lib/shellNav";
import { DEAL_STAGES, CLIENT_TYPES } from "@/lib/constants";

interface Props {
  query: string;
  onClose: () => void;
}

function SectionHeader({
  icon: Icon,
  title,
  count,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  count: number;
}) {
  return (
    <div className="flex items-center gap-2 px-3 pt-3 pb-1.5">
      <Icon size={12} className="text-ink-400" />
      <span className="text-[11px] font-semibold text-ink-400 uppercase tracking-wider">{title}</span>
      <span className="ml-auto text-[11px] text-ink-300">{count}</span>
    </div>
  );
}

function ResultRow({
  icon,
  primary,
  secondary,
  trailing,
  onClick,
}: {
  icon: React.ReactNode;
  primary: string;
  secondary: string;
  trailing?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2 text-left",
        "hover:bg-aqua-100 active:bg-aqua-100 transition-colors rounded-md group",
        "touch-manipulation min-h-[44px]"
      )}
    >
      <span className="w-7 h-7 rounded-md bg-surface-base border border-hairline grid place-items-center shrink-0 group-hover:border-aqua-300 transition-colors">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink-900 truncate">{primary}</p>
        <p className="text-xs text-ink-400 truncate">{secondary}</p>
      </div>
      {trailing && (
        <span className="text-sm text-money text-ink-600 shrink-0">{trailing}</span>
      )}
      <ChevronRight size={13} className="text-ink-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

function SkeletonRows() {
  return (
    <div className="px-3 py-2 space-y-1">
      {[1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3 py-2">
          <div className="w-7 h-7 rounded-md bg-surface-base animate-pulse" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 rounded bg-surface-base animate-pulse w-3/4" />
            <div className="h-2.5 rounded bg-surface-base animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function GlobalSearchPanel({ query, onClose }: Props) {
  const router = useRouter();
  const properties = usePropertySearch(query);
  const clients = useClientSearch(query);
  const deals = useDealSearch(query);

  const loading = properties === undefined || clients === undefined || deals === undefined;
  const totalResults = (properties?.length ?? 0) + (clients?.length ?? 0) + (deals?.length ?? 0);

  const go = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.14, ease: "easeOut" }}
      className={cn(
        "absolute top-full left-0 right-0 mt-2 z-50",
        "bg-surface-card border border-hairline rounded-xl shadow-float",
        "max-h-[440px] overflow-y-auto overscroll-contain"
      )}
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="py-1.5">
        {/* Properties */}
        {loading && !properties ? (
          <>
            <SectionHeader icon={Building2} title="Properties" count={0} />
            <SkeletonRows />
          </>
        ) : properties && properties.length > 0 ? (
          <>
            <SectionHeader icon={Building2} title="Properties" count={properties.length} />
            <div className="px-1.5 pb-1">
              {properties.map((p) => (
                <ResultRow
                  key={p._id}
                  icon={<Building2 size={13} className="text-aqua-500" />}
                  primary={p.name}
                  secondary={[p.area, p.city].filter(Boolean).join(", ")}
                  trailing={formatCurrency(p.price)}
                  onClick={() => go("/properties")}
                />
              ))}
            </div>
          </>
        ) : null}

        {/* Clients */}
        {loading && !clients ? (
          <>
            {properties && properties.length > 0 && <div className="border-t border-hairline my-1" />}
            <SectionHeader icon={Users} title="Clients" count={0} />
            <SkeletonRows />
          </>
        ) : clients && clients.length > 0 ? (
          <>
            {properties && properties.length > 0 && <div className="border-t border-hairline my-1" />}
            <SectionHeader icon={Users} title="Clients" count={clients.length} />
            <div className="px-1.5 pb-1">
              {clients.map((c) => {
                const typeLabel = CLIENT_TYPES.find((t) => t.value === c.clientType)?.label ?? c.clientType;
                return (
                  <ResultRow
                    key={c._id}
                    icon={<Users size={13} className="text-sea-700" />}
                    primary={`${c.firstName} ${c.lastName}`}
                    secondary={`${typeLabel} · ${c.phone}`}
                    onClick={() => {
                      shellNav.client.fire(c._id);
                      go("/clients");
                    }}
                  />
                );
              })}
            </div>
          </>
        ) : null}

        {/* Deals */}
        {loading && !deals ? (
          <>
            {((properties?.length ?? 0) + (clients?.length ?? 0)) > 0 && (
              <div className="border-t border-hairline my-1" />
            )}
            <SectionHeader icon={FileSignature} title="Deals" count={0} />
            <SkeletonRows />
          </>
        ) : deals && deals.length > 0 ? (
          <>
            {((properties?.length ?? 0) + (clients?.length ?? 0)) > 0 && (
              <div className="border-t border-hairline my-1" />
            )}
            <SectionHeader icon={FileSignature} title="Deals" count={deals.length} />
            <div className="px-1.5 pb-1">
              {deals.map((d) => {
                const stageLabel = DEAL_STAGES.find((s) => s.value === d.stage)?.label ?? d.stage;
                return (
                  <ResultRow
                    key={d._id}
                    icon={<FileSignature size={13} className="text-coral-500" />}
                    primary={d.propertyName}
                    secondary={`${stageLabel} · ${d.dealType === "rent" ? "Rent" : "Sale"}`}
                    trailing={formatCurrency(d.agreedPrice ?? d.listPrice)}
                    onClick={() => {
                      shellNav.deal.fire(d._id);
                      go("/dashboard");
                    }}
                  />
                );
              })}
            </div>
          </>
        ) : null}

        {/* Empty state */}
        {!loading && totalResults === 0 && (
          <div className="px-4 py-7 text-center">
            <p className="text-sm text-ink-400">
              No results for{" "}
              <span className="font-medium text-ink-700">"{query}"</span>
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

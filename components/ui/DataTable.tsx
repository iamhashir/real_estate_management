"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Skeleton } from "./Skeleton";
import { EmptyState } from "./EmptyState";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { AlignJustify, List } from "lucide-react";

export interface TableColumn<T = Record<string, unknown>> {
  key:          string;
  header:       string;
  render:       (row: T, index: number) => React.ReactNode;
  width?:       string;
  align?:       "left" | "center" | "right";
  hideOnTablet?: boolean;
  railColor?:   (row: T) => string;
}

interface DataTableProps<T> {
  columns:      TableColumn<T>[];
  rows:         T[];
  getRowId:     (row: T) => string;
  renderCard:   (row: T) => React.ReactNode;
  isLoading?:   boolean;
  emptyState?:  React.ReactNode;
  onRowClick?:  (row: T) => void;
  railColor?:   (row: T) => string;
  highlightId?: string;
  className?:   string;
}

type Density = "comfortable" | "compact";

const rowPad: Record<Density, string> = {
  comfortable: "px-4 py-3.5",
  compact:     "px-4 py-2",
};

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  renderCard,
  isLoading = false,
  emptyState,
  onRowClick,
  railColor,
  highlightId,
  className,
}: DataTableProps<T>) {
  const { isMobile } = useBreakpoint();
  const [density, setDensity] = useState<Density>("comfortable");

  // ── Mobile: card list ─────────────────────────────────────────────────────
  if (isMobile) {
    if (isLoading) {
      return (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-md" />
          ))}
        </div>
      );
    }
    if (!rows.length) return <>{emptyState}</>;
    return (
      <div className={cn("space-y-2", className)}>
        {rows.map((row) => (
          <div
            key={getRowId(row)}
            onClick={() => onRowClick?.(row)}
            role={onRowClick ? "button" : undefined}
            tabIndex={onRowClick ? 0 : undefined}
            onKeyDown={(e) => {
              if (onRowClick && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onRowClick(row);
              }
            }}
            className={cn(
              "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua-400",
              onRowClick && "cursor-pointer"
            )}
          >
            {renderCard(row)}
          </div>
        ))}
      </div>
    );
  }

  // ── Desktop / tablet: table ───────────────────────────────────────────────
  return (
    <div className={cn("bg-surface-card rounded-md shadow-card overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-end px-4 py-2 border-b border-hairline gap-2">
        <button
          onClick={() => setDensity(density === "comfortable" ? "compact" : "comfortable")}
          className="flex items-center gap-1.5 text-xs text-ink-400 hover:text-ink-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua-400 focus-visible:ring-offset-2 rounded-sm px-1.5 py-1"
          title={density === "comfortable" ? "Switch to compact" : "Switch to comfortable"}
        >
          {density === "comfortable"
            ? <List size={13} />
            : <AlignJustify size={13} />}
          <span className="hidden lg:inline capitalize">{density}</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-surface-base">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-2.5 text-left text-label text-ink-400 font-medium whitespace-nowrap",
                    "border-b border-hairline sticky top-0 bg-surface-base",
                    col.align === "right"  && "text-right",
                    col.align === "center" && "text-center",
                    col.hideOnTablet       && "hidden xl:table-cell",
                    col.width
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-hairline">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className={cn(rowPad[density], col.hideOnTablet && "hidden xl:table-cell")}>
                      <Skeleton className="h-4 rounded" style={{ opacity: 1 - i * 0.12 }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  {emptyState ?? (
                    <EmptyState
                      variant="search"
                      title="Nothing here yet"
                      description="No records match your current filters."
                    />
                  )}
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const rail    = railColor?.(row);
                const rowId   = getRowId(row);
                const flashed = highlightId === rowId;
                return (
                  <tr
                    key={rowId}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      "group relative transition-colors",
                      "hover:bg-aqua-100/40",
                      onRowClick && "cursor-pointer focus-visible:bg-aqua-100/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-aqua-400",
                      flashed && "row-flash"
                    )}
                    role={onRowClick ? "button" : undefined}
                    tabIndex={onRowClick ? 0 : undefined}
                    onKeyDown={(e) => {
                      if (onRowClick && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        onRowClick(row);
                      }
                    }}
                  >
                    {columns.map((col, ci) => (
                      <td
                        key={col.key}
                        className={cn(
                          rowPad[density],
                          "text-sm text-ink-900 whitespace-nowrap",
                          ci === 0 && rail && "pl-5 border-l-[3px]",
                          col.align === "right"  && "text-right tabular-nums",
                          col.align === "center" && "text-center",
                          col.hideOnTablet       && "hidden xl:table-cell"
                        )}
                        style={ci === 0 && rail ? { borderLeftColor: rail } : undefined}
                      >
                        {col.render(row, rows.indexOf(row))}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

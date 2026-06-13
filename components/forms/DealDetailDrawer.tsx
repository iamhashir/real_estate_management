"use client";

import React, { useState } from "react";
import { Drawer, StatusPill, Skeleton, Button, Modal, useToast } from "@/components/ui";
import { DEAL_STAGES, type DealStage } from "@/lib/constants";
import { formatCurrency, formatDate, formatRelativeDate } from "@/lib/utils";
import { useDeal, useAdvanceDealStage, useDeleteDeal } from "@/hooks/useDeals";
import { useCurrentAgent } from "@/hooks/useAgents";
import { cn } from "@/lib/utils";
import {
  Building2, User, Calendar, Trash2, ChevronRight, Check,
  Activity as ActivityIcon, PlusCircle, Pencil, MessageSquare,
  Phone, Eye, FileText, RefreshCw,
} from "lucide-react";

interface DealDetailDrawerProps {
  dealId: string | null;
  onClose: () => void;
}

const MAIN_STAGES = DEAL_STAGES.filter((s) => s.value !== "cancelled");

const ACTIVITY_ICON: Record<string, React.ReactNode> = {
  created:       <PlusCircle size={12} />,
  updated:       <Pencil size={12} />,
  note:          <MessageSquare size={12} />,
  call:          <Phone size={12} />,
  viewing:       <Eye size={12} />,
  offer:         <FileText size={12} />,
  status_change: <RefreshCw size={12} />,
};

export function DealDetailDrawer({ dealId, onClose }: DealDetailDrawerProps) {
  const toast = useToast();
  const advanceStage = useAdvanceDealStage();
  const deleteDeal   = useDeleteDeal();
  const { agent }    = useCurrentAgent();

  const [advancing, setAdvancing]           = useState(false);
  const [cancelling, setCancelling]         = useState(false);
  const [showDelete, setShowDelete]         = useState(false);
  const [deleting, setDeleting]             = useState(false);

  const data    = useDeal(dealId) as any;
  const isOpen  = !!dealId;
  const loading = data === undefined && isOpen;

  const deal     = data?.deal     ?? null;
  const property = data?.property ?? null;
  const buyer    = data?.buyer    ?? null;
  const seller   = data?.seller   ?? null;
  const agentRec = data?.agent    ?? null;
  const activity = (data?.activity ?? []) as any[];

  const currentIdx  = deal ? MAIN_STAGES.findIndex((s) => s.value === deal.stage) : -1;
  const isCancelled = deal?.stage === "cancelled";
  const isClosed    = deal?.stage === "closed" || isCancelled;
  const nextStage   = !isClosed && currentIdx < MAIN_STAGES.length - 1
    ? MAIN_STAGES[currentIdx + 1]
    : null;
  const stageMeta   = DEAL_STAGES.find((s) => s.value === deal?.stage);

  const handleAdvance = async () => {
    if (!deal || !nextStage) return;
    setAdvancing(true);
    try {
      await advanceStage({ id: deal._id as never, stage: nextStage.value as DealStage, agentId: agent?._id as never });
      toast.success(`Moved to ${nextStage.label}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not advance stage");
    } finally { setAdvancing(false); }
  };

  const handleCancel = async () => {
    if (!deal) return;
    setCancelling(true);
    try {
      await advanceStage({ id: deal._id as never, stage: "cancelled", agentId: agent?._id as never });
      toast.success("Deal cancelled");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not cancel deal");
    } finally { setCancelling(false); }
  };

  const handleDelete = async () => {
    if (!deal) return;
    setDeleting(true);
    try {
      await deleteDeal({ id: deal._id as never });
      toast.success("Deal deleted");
      setShowDelete(false);
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete deal");
      setDeleting(false);
    }
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title={loading ? "Loading…" : (property?.name ?? "Deal")}
        description={deal ? `${deal.dealType === "rent" ? "Rental" : "Sale"} · ${stageMeta?.label ?? deal.stage}` : undefined}
        size="lg"
        footer={
          deal ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDelete(true)}
                className="inline-flex items-center gap-1.5 text-sm text-danger hover:bg-danger/10 rounded-md px-2.5 py-1.5 min-h-[44px] transition-colors"
                aria-label="Delete deal"
              >
                <Trash2 size={14} />
                <span className="hidden sm:inline">Delete</span>
              </button>

              <div className="flex-1" />

              {!isClosed && (
                <Button variant="secondary" size="sm" loading={cancelling} onClick={handleCancel}>
                  Cancel Deal
                </Button>
              )}

              {nextStage && (
                <Button size="sm" loading={advancing} rightIcon={<ChevronRight size={14} />} onClick={handleAdvance}>
                  {nextStage.label}
                </Button>
              )}

              {deal.stage === "closed" && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-success/10 border border-success/20">
                  <Check size={14} className="text-success" />
                  <span className="text-sm font-medium text-success">Closed</span>
                </div>
              )}

              {isCancelled && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-danger/10 border border-danger/20">
                  <span className="text-sm font-medium text-danger">Cancelled</span>
                </div>
              )}
            </div>
          ) : null
        }
      >
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 rounded-md" />
            <Skeleton className="h-28 rounded-md" />
            <Skeleton className="h-24 rounded-md" />
            <Skeleton className="h-20 rounded-md" />
          </div>
        ) : !deal ? (
          <p className="text-sm text-ink-500">Deal not found.</p>
        ) : (
          <div className="space-y-6">

            {/* Stage stepper */}
            <div>
              <p className="text-label text-ink-600 mb-4">Pipeline Stage</p>
              <div className="flex items-start">
                {MAIN_STAGES.map((stage, i) => {
                  const isPast    = !isCancelled && i < currentIdx;
                  const isCurrent = !isCancelled && i === currentIdx;
                  const isLast    = i === MAIN_STAGES.length - 1;

                  return (
                    <React.Fragment key={stage.value}>
                      <div className="flex flex-col items-center gap-1.5 shrink-0">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors text-xs font-semibold",
                          isCurrent
                            ? "bg-aqua-500 border-aqua-500 text-sea-950"
                            : isPast
                              ? "bg-success/15 border-success text-success"
                              : "bg-surface-base border-hairline text-ink-400"
                        )}>
                          {isPast ? <Check size={13} /> : <span>{i + 1}</span>}
                        </div>
                        <p className={cn(
                          "text-[10px] font-medium leading-tight text-center",
                          isCurrent ? "text-aqua-500" : isPast ? "text-success" : "text-ink-400"
                        )}>
                          {stage.label}
                        </p>
                      </div>
                      {!isLast && (
                        <div className={cn(
                          "flex-1 h-0.5 mt-4 mx-1",
                          isPast ? "bg-success/40" : "bg-hairline"
                        )} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
              {isCancelled && (
                <p className="text-xs text-danger mt-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-danger inline-block" />
                  This deal was cancelled
                </p>
              )}
            </div>

            {/* Parties */}
            <Section title="Parties">
              {property && (
                <InfoRow icon={<Building2 size={14} />} label="Property">
                  <p className="text-sm font-medium text-ink-900">{property.name}</p>
                  <p className="text-xs text-ink-500">{property.area ? `${property.area}, ` : ""}{property.city}</p>
                </InfoRow>
              )}
              <InfoRow icon={<User size={14} />} label="Buyer">
                {buyer
                  ? <><p className="text-sm font-medium text-ink-900">{buyer.firstName} {buyer.lastName}</p><p className="text-xs text-ink-500">{buyer.phone}</p></>
                  : <span className="text-sm text-ink-500">—</span>
                }
              </InfoRow>
              <InfoRow icon={<User size={14} />} label="Seller">
                {seller
                  ? <><p className="text-sm font-medium text-ink-900">{seller.firstName} {seller.lastName}</p><p className="text-xs text-ink-500">{seller.phone}</p></>
                  : <span className="text-sm text-ink-500">—</span>
                }
              </InfoRow>
              {agentRec && (
                <InfoRow icon={<User size={14} />} label="Agent">
                  <p className="text-sm font-medium text-ink-900">{agentRec.name}</p>
                  <p className="text-xs text-ink-500 capitalize">{agentRec.role}</p>
                </InfoRow>
              )}
            </Section>

            {/* Financials */}
            <Section title="Financials">
              <div className="grid grid-cols-2 gap-2.5">
                <MetricPill label="List Price"       value={formatCurrency(deal.listPrice)} />
                <MetricPill label="Agreed Price"     value={deal.agreedPrice ? formatCurrency(deal.agreedPrice) : "Pending"} dim={!deal.agreedPrice} />
                <MetricPill label={`Commission (${deal.commissionRate}%)`} value={deal.commissionAmount ? formatCurrency(deal.commissionAmount) : "—"} />
                <MetricPill label="Type"             value={deal.dealType === "rent" ? "Rental" : "Sale"} />
              </div>
            </Section>

            {/* Dates */}
            {(deal.contractDate || deal.handoverDate) && (
              <Section title="Dates">
                <div className="grid grid-cols-2 gap-2.5">
                  {deal.contractDate  && <MetricPill label="Contract date"  value={formatDate(deal.contractDate)} />}
                  {deal.handoverDate  && <MetricPill label="Handover date"  value={formatDate(deal.handoverDate)} />}
                </div>
              </Section>
            )}

            {/* Notes */}
            {deal.notes && (
              <Section title="Notes">
                <p className="text-sm text-ink-700 leading-relaxed whitespace-pre-wrap">{deal.notes}</p>
              </Section>
            )}

            {/* Activity */}
            {activity.length > 0 && (
              <Section title="Activity">
                <ul className="space-y-3">
                  {activity.slice(0, 10).map((a: any) => (
                    <li key={a._id} className="flex gap-2.5">
                      <span className="mt-0.5 w-6 h-6 rounded-full bg-aqua-100 text-aqua-500 grid place-items-center shrink-0">
                        {ACTIVITY_ICON[a.activityType] ?? <ActivityIcon size={12} />}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm text-ink-900">{a.content}</p>
                        <p className="text-xs text-ink-500">{formatRelativeDate(a._creationTime)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

          </div>
        )}
      </Drawer>

      <Modal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete this deal?"
        description="All activity for this deal will be permanently removed. This cannot be undone."
        confirmLabel="Delete Deal"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-label text-ink-600 border-b border-hairline pb-2">{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-aqua-500 shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-ink-600 uppercase tracking-wide font-medium mb-0.5">{label}</p>
        {children}
      </div>
    </div>
  );
}

function MetricPill({ label, value, dim }: { label: string; value: string; dim?: boolean }) {
  return (
    <div className="rounded-md bg-surface-base border border-hairline px-3 py-2.5">
      <p className="text-[10px] text-ink-600 font-medium uppercase tracking-wide leading-tight">{label}</p>
      <p className={cn("text-sm font-medium mt-1 text-money", dim ? "text-ink-500" : "text-ink-900")}>{value}</p>
    </div>
  );
}

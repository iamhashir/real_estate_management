"use client";

import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { Drawer, Input, SegmentedToggle, Combobox, DatePicker, Textarea, Button, useToast } from "@/components/ui";
import { FormSection } from "./formHelpers";
import { DEAL_TYPES, DEFAULT_COMMISSION_RATE } from "@/lib/constants";
import { calcCommission, formatCurrency, fullName } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useProperties } from "@/hooks/useProperties";
import { useClients } from "@/hooks/useClients";
import { useAgents } from "@/hooks/useAgents";
import { useCreateDeal } from "@/hooks/useDeals";

interface DealFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (id: string) => void;
}

// ─── Animated commission figure ─────────────────────────────────────────────────

function AnimatedAED({ value }: { value: number }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => formatCurrency(Math.round(v)));
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.5, ease: [0.22, 1, 0.36, 1] });
    return controls.stop;
  }, [value, mv]);
  return <motion.span>{rounded}</motion.span>;
}

const STEPS = ["Property", "Parties", "Terms"];

export function DealFormDrawer({ isOpen, onClose, onCreated }: DealFormDrawerProps) {
  const toast = useToast();
  const createDeal = useCreateDeal();

  const { properties } = useProperties();
  const { clients } = useClients();
  const { agents } = useAgents(true);

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [propertyId, setPropertyId] = useState("");
  const [dealType, setDealType] = useState("sale");
  const [buyerId, setBuyerId] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [agentId, setAgentId] = useState("");
  const [listPrice, setListPrice] = useState("");
  const [agreedPrice, setAgreedPrice] = useState("");
  const [commissionRate, setCommissionRate] = useState(String(DEFAULT_COMMISSION_RATE));
  const [contractDate, setContractDate] = useState<number | undefined>();
  const [handoverDate, setHandoverDate] = useState<number | undefined>();
  const [notes, setNotes] = useState("");

  // Default the agent to the first active one once loaded
  useEffect(() => {
    if (!agentId && agents.length) setAgentId(agents[0]._id);
  }, [agents, agentId]);

  const availableProps = properties.filter((p) => p.status === "available");
  const propertyOptions = (availableProps.length ? availableProps : properties).map((p) => ({
    value: p._id,
    label: p.name,
    sublabel: formatCurrency(p.price),
  }));
  const clientOptions = clients.map((c) => ({
    value: c._id,
    label: fullName(c.firstName, c.lastName),
    sublabel: c.phone,
  }));
  const agentOptions = agents.map((a) => ({ value: a._id, label: a.name, sublabel: a.role }));

  const commissionBase = Number(agreedPrice || listPrice || 0);
  const commission = calcCommission(commissionBase, Number(commissionRate || 0));

  const reset = () => {
    setStep(0); setPropertyId(""); setDealType("sale");
    setBuyerId(""); setSellerId(""); setListPrice(""); setAgreedPrice("");
    setCommissionRate(String(DEFAULT_COMMISSION_RATE));
    setContractDate(undefined); setHandoverDate(undefined); setNotes("");
    setErrors({});
  };

  const onPickProperty = (id: string) => {
    setPropertyId(id);
    const p = properties.find((pr) => pr._id === id);
    if (p) {
      setDealType(p.listingType);
      if (!listPrice) setListPrice(String(p.price));
    }
  };

  const step0Ok = () => {
    const e: Record<string, string> = {};
    if (!propertyId) e.propertyId = "Select a property";
    setErrors(e);
    return !Object.keys(e).length;
  };
  const step1Ok = () => {
    const e: Record<string, string> = {};
    if (!agentId) e.agentId = "Assign an agent";
    setErrors(e);
    return !Object.keys(e).length;
  };
  const step2Ok = () => {
    const e: Record<string, string> = {};
    if (!listPrice || Number(listPrice) <= 0) e.listPrice = "Enter the list price";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const next = () => {
    if (step === 0 && step0Ok()) setStep(1);
    else if (step === 1 && step1Ok()) setStep(2);
  };
  const back = () => setStep((s) => Math.max(0, s - 1));
  const handleClose = () => { setStep(0); onClose(); };

  const handleSubmit = async () => {
    if (!step2Ok()) return;
    setSaving(true);
    try {
      const id = await createDeal({
        propertyId: propertyId as never,
        buyerId: (buyerId as never) || undefined,
        sellerId: (sellerId as never) || undefined,
        agentId: agentId as never,
        dealType: dealType as "sale" | "rent",
        listPrice: Number(listPrice),
        agreedPrice: agreedPrice ? Number(agreedPrice) : undefined,
        commissionRate: Number(commissionRate || 0),
        contractDate,
        handoverDate,
        notes: notes.trim() || undefined,
      });
      toast.success("Deal created");
      reset();
      onClose();
      onCreated?.(id as string);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create deal");
    } finally {
      setSaving(false);
    }
  };

  const noAgents = agents.length === 0;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="New Deal"
      description={`Step ${step + 1} of 3 — ${STEPS[step]}`}
      size="lg"
      footer={
        <div className="flex gap-2">
          {step > 0
            ? <Button variant="secondary" fullWidth onClick={back}>Back</Button>
            : <Button variant="secondary" fullWidth onClick={handleClose}>Cancel</Button>}
          {step < 2
            ? <Button fullWidth onClick={next}>Continue</Button>
            : <Button fullWidth loading={saving} onClick={handleSubmit} disabled={noAgents}>Create Deal</Button>}
        </div>
      }
    >
      {/* Progress rail */}
      <div className="flex gap-1.5 mb-6">
        {STEPS.map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full bg-hairline overflow-hidden">
            <motion.div
              className="h-full bg-gradient-foam"
              initial={false}
              animate={{ width: step >= i ? "100%" : "0%" }}
              transition={{ duration: 0.3 }}
            />
          </div>
        ))}
      </div>

      {/* Step 0 — property */}
      <div className={cn(step === 0 ? "block" : "hidden", "space-y-6")}>
        <FormSection title="Property">
          <Combobox
            label="Select property"
            value={propertyId}
            onChange={onPickProperty}
            options={propertyOptions}
            error={errors.propertyId}
            hint={availableProps.length ? undefined : "No available listings — showing all"}
          />
          <SegmentedToggle
            fullWidth
            options={DEAL_TYPES.map((t) => ({ value: t.value, label: t.label }))}
            value={dealType}
            onChange={setDealType}
          />
        </FormSection>
      </div>

      {/* Step 1 — parties */}
      <div className={cn(step === 1 ? "block" : "hidden", "space-y-6")}>
        <FormSection title="Parties">
          <Combobox
            label="Buyer"
            value={buyerId}
            onChange={setBuyerId}
            options={clientOptions}
            hint="Optional for listings without a buyer yet"
          />
          <Combobox
            label="Seller"
            value={sellerId}
            onChange={setSellerId}
            options={clientOptions}
          />
          <Combobox
            label="Agent"
            value={agentId}
            onChange={setAgentId}
            options={agentOptions}
            error={errors.agentId}
            hint={noAgents ? "Add an agent in Convex first" : undefined}
          />
        </FormSection>
      </div>

      {/* Step 2 — terms */}
      <div className={cn(step === 2 ? "block" : "hidden", "space-y-6")}>
        <FormSection title="Pricing & commission">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="List price (AED)"
              type="number"
              inputMode="numeric"
              value={listPrice}
              error={errors.listPrice}
              onChange={(e) => setListPrice(e.target.value)}
              onBlur={step2Ok}
            />
            <Input
              label="Agreed price (AED)"
              type="number"
              inputMode="numeric"
              value={agreedPrice}
              onChange={(e) => setAgreedPrice(e.target.value)}
            />
          </div>
          <Input
            label="Commission rate (%)"
            type="number"
            inputMode="decimal"
            value={commissionRate}
            onChange={(e) => setCommissionRate(e.target.value)}
          />

          {/* Live commission preview */}
          <div className="rounded-md bg-gradient-tide p-4 text-white shadow-card">
            <p className="text-[10px] font-medium tracking-wide uppercase text-aqua-100">
              Commission preview
            </p>
            <p className="text-display-xl font-display font-600 mt-1 text-money">
              <AnimatedAED value={commission} />
            </p>
            <p className="text-xs text-aqua-100 mt-1">
              {commissionRate || 0}% of {formatCurrency(commissionBase)}
            </p>
          </div>
        </FormSection>

        <FormSection title="Dates">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DatePicker label="Contract date" value={contractDate} onChange={setContractDate} />
            <DatePicker label="Handover date" value={handoverDate} onChange={setHandoverDate} />
          </div>
        </FormSection>

        <FormSection title="Notes">
          <Textarea label="Deal notes" value={notes} rows={3} onChange={(e) => setNotes(e.target.value)} />
        </FormSection>
      </div>
    </Drawer>
  );
}

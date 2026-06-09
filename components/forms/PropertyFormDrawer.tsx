"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Drawer, Input, SegmentedToggle, Combobox, Textarea, Button, useToast } from "@/components/ui";
import { ChipToggleGroup, FormSection, useDraft } from "./formHelpers";
import {
  PROPERTY_TYPES, LISTING_TYPES, PROPERTY_FEATURES, CITIES, AREAS_BY_CITY,
} from "@/lib/constants";
import { useCreateProperty } from "@/hooks/useProperties";
import { useCurrentAgent } from "@/hooks/useAgents";
import { cn } from "@/lib/utils";

interface PropertyFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (id: string) => void;
}

interface Draft {
  name: string;
  address: string;
  city: string;
  area: string;
  type: string;
  listingType: string;
  price: string;
  size: string;
  bedrooms: string;
  bathrooms: string;
  floor: string;
  features: string[];
  description: string;
}

const EMPTY: Draft = {
  name: "", address: "", city: "", area: "",
  type: "apartment", listingType: "sale",
  price: "", size: "", bedrooms: "", bathrooms: "", floor: "",
  features: [], description: "",
};

export function PropertyFormDrawer({ isOpen, onClose, onCreated }: PropertyFormDrawerProps) {
  const toast = useToast();
  const createProperty = useCreateProperty();
  const { agent } = useCurrentAgent();

  const [form, setForm, clearDraft] = useDraft<Draft>("draft:property", EMPTY, isOpen);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const areaOptions = (AREAS_BY_CITY[form.city] ?? []).map((a) => ({ value: a, label: a }));

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())    e.name = "Required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city)           e.city = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!form.price || Number(form.price) <= 0) e.price = "Enter a price";
    if (!form.size  || Number(form.size)  <= 0) e.size = "Enter a size";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep1()) { setStep(1); setErrors({}); } };
  const back = () => { setStep(0); setErrors({}); };

  const reset = () => { setForm(EMPTY); setStep(0); setErrors({}); clearDraft(); };

  const handleClose = () => { setStep(0); onClose(); };

  const num = (s: string) => (s.trim() === "" ? undefined : Number(s));

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setSaving(true);
    try {
      const id = await createProperty({
        name: form.name.trim(),
        address: form.address.trim(),
        city: form.city,
        area: form.area || undefined,
        type: form.type as "villa" | "apartment" | "office" | "land" | "commercial",
        listingType: form.listingType as "sale" | "rent",
        price: Number(form.price),
        size: Number(form.size),
        bedrooms: num(form.bedrooms),
        bathrooms: num(form.bathrooms),
        floor: num(form.floor),
        features: form.features.length ? form.features : undefined,
        description: form.description.trim() || undefined,
        agentId: (agent?._id as never) ?? undefined,
      });
      toast.success(`"${form.name}" listed`);
      reset();
      onClose();
      onCreated?.(id as string);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create listing");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="New Property"
      description={step === 0 ? "Step 1 — Details" : "Step 2 — Pricing & specs"}
      footer={
        step === 0 ? (
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={handleClose}>Cancel</Button>
            <Button fullWidth onClick={next}>Continue</Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={back}>Back</Button>
            <Button fullWidth loading={saving} onClick={handleSubmit}>Create Listing</Button>
          </div>
        )
      }
    >
      {/* Progress rail */}
      <div className="flex gap-1.5 mb-6">
        {[0, 1].map((i) => (
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

      <div className={cn(step === 0 ? "block" : "hidden", "space-y-6")}>
        <FormSection title="Listing">
          <SegmentedToggle
            fullWidth
            options={LISTING_TYPES.map((t) => ({ value: t.value, label: t.label }))}
            value={form.listingType}
            onChange={(v) => set("listingType", v)}
          />
          <SegmentedToggle
            fullWidth
            size="sm"
            options={PROPERTY_TYPES.map((t) => ({ value: t.value, label: t.label }))}
            value={form.type}
            onChange={(v) => set("type", v)}
          />
          <Input
            label="Listing name"
            value={form.name}
            error={errors.name}
            onChange={(e) => set("name", e.target.value)}
            onBlur={validateStep1}
            hint="e.g. Marina Gate 2 — 2BR with full sea view"
          />
          <Input
            label="Address"
            value={form.address}
            error={errors.address}
            onChange={(e) => set("address", e.target.value)}
            onBlur={validateStep1}
          />
          <div className="grid grid-cols-2 gap-3">
            <Combobox
              label="City"
              value={form.city}
              onChange={(v) => { set("city", v); set("area", ""); }}
              options={CITIES.map((c) => ({ value: c, label: c }))}
              error={errors.city}
            />
            <Combobox
              label="Area"
              value={form.area}
              onChange={(v) => set("area", v)}
              options={areaOptions}
              hint={!form.city ? "Pick a city first" : undefined}
            />
          </div>
        </FormSection>
      </div>

      <div className={cn(step === 1 ? "block" : "hidden", "space-y-6")}>
        <FormSection title="Pricing">
          <Input
            label={`Price (AED${form.listingType === "rent" ? " / year" : ""})`}
            type="number"
            inputMode="numeric"
            value={form.price}
            error={errors.price}
            onChange={(e) => set("price", e.target.value)}
            onBlur={validateStep2}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Size (sqm)"
              type="number"
              inputMode="numeric"
              value={form.size}
              error={errors.size}
              onChange={(e) => set("size", e.target.value)}
              onBlur={validateStep2}
            />
            <Input
              label="Floor"
              type="number"
              inputMode="numeric"
              value={form.floor}
              onChange={(e) => set("floor", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Bedrooms"
              type="number"
              inputMode="numeric"
              value={form.bedrooms}
              onChange={(e) => set("bedrooms", e.target.value)}
            />
            <Input
              label="Bathrooms"
              type="number"
              inputMode="numeric"
              value={form.bathrooms}
              onChange={(e) => set("bathrooms", e.target.value)}
            />
          </div>
        </FormSection>

        <FormSection title="Features">
          <ChipToggleGroup
            label="Amenities"
            options={PROPERTY_FEATURES}
            selected={form.features}
            onToggle={(v) =>
              set("features",
                form.features.includes(v)
                  ? form.features.filter((f) => f !== v)
                  : [...form.features, v]
              )
            }
          />
        </FormSection>

        <FormSection title="Description">
          <Textarea
            label="Describe the property"
            value={form.description}
            rows={4}
            onChange={(e) => set("description", e.target.value)}
          />
        </FormSection>
      </div>
    </Drawer>
  );
}

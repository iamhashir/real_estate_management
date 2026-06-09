"use client";

import { useState } from "react";
import { Drawer, Input, SegmentedToggle, Combobox, RangeSlider, Textarea, Button, useToast } from "@/components/ui";
import { ChipToggleGroup, FormSection, compactAED, useDraft } from "./formHelpers";
import {
  CLIENT_TYPES, PROPERTY_TYPES, NATIONALITIES, CITIES, AREAS_BY_CITY,
} from "@/lib/constants";
import { useCreateClient } from "@/hooks/useClients";
import { useCurrentAgent } from "@/hooks/useAgents";
import { X } from "lucide-react";

interface ClientFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (id: string) => void;
}

const BUDGET_MAX = 50_000_000;

interface Draft {
  clientType: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  nationality: string;
  budget: [number, number];
  preferredPropertyTypes: string[];
  preferredLocations: string[];
  notes: string;
}

const EMPTY: Draft = {
  clientType: "buyer",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  nationality: "",
  budget: [500_000, 5_000_000],
  preferredPropertyTypes: [],
  preferredLocations: [],
  notes: "",
};

const ALL_AREAS = CITIES.flatMap((city) =>
  (AREAS_BY_CITY[city] ?? []).map((area) => ({
    value: `${area}, ${city}`,
    label: area,
    sublabel: city,
  }))
);

export function ClientFormDrawer({ isOpen, onClose, onCreated }: ClientFormDrawerProps) {
  const toast = useToast();
  const createClient = useCreateClient();
  const { agent } = useCurrentAgent();

  const [form, setForm, clearDraft] = useDraft<Draft>("draft:client", EMPTY, isOpen);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleIn = (key: "preferredPropertyTypes" | "preferredLocations", value: string) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim())  e.lastName = "Required";
    if (!form.phone.trim())     e.phone = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const reset = () => { setForm(EMPTY); setErrors({}); clearDraft(); };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const id = await createClient({
        clientType: form.clientType as "buyer" | "seller" | "both",
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        nationality: form.nationality || undefined,
        budgetMin: form.budget[0],
        budgetMax: form.budget[1],
        preferredPropertyTypes: form.preferredPropertyTypes.length ? form.preferredPropertyTypes : undefined,
        preferredLocations: form.preferredLocations.length ? form.preferredLocations : undefined,
        notes: form.notes.trim() || undefined,
        agentId: (agent?._id as never) ?? undefined,
      });
      toast.success(`${form.firstName} ${form.lastName} added`);
      reset();
      onClose();
      onCreated?.(id as string);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add client");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="New Client"
      description="Add a buyer or seller to your book"
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" fullWidth onClick={onClose}>Cancel</Button>
          <Button fullWidth loading={saving} onClick={handleSubmit}>Add Client</Button>
        </div>
      }
    >
      <div className="space-y-6">
        <FormSection title="Profile">
          <SegmentedToggle
            fullWidth
            options={CLIENT_TYPES.map((t) => ({ value: t.value, label: t.label }))}
            value={form.clientType}
            onChange={(v) => set("clientType", v)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First name"
              value={form.firstName}
              error={errors.firstName}
              onChange={(e) => set("firstName", e.target.value)}
              onBlur={validate}
            />
            <Input
              label="Last name"
              value={form.lastName}
              error={errors.lastName}
              onChange={(e) => set("lastName", e.target.value)}
              onBlur={validate}
            />
          </div>
          <Input
            label="Phone"
            type="tel"
            value={form.phone}
            error={errors.phone}
            onChange={(e) => set("phone", e.target.value)}
            onBlur={validate}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
          <Combobox
            label="Nationality"
            value={form.nationality}
            onChange={(v) => set("nationality", v)}
            options={NATIONALITIES.map((n) => ({ value: n, label: n }))}
          />
        </FormSection>

        <FormSection title="Preferences">
          <RangeSlider
            label="Budget (AED)"
            min={0}
            max={BUDGET_MAX}
            step={50_000}
            value={form.budget}
            onChange={(v) => set("budget", v)}
            formatValue={compactAED}
          />
          <ChipToggleGroup
            label="Preferred property types"
            options={PROPERTY_TYPES}
            selected={form.preferredPropertyTypes}
            onToggle={(v) => toggleIn("preferredPropertyTypes", v)}
          />

          {/* Preferred locations — add via combobox, shown as removable chips */}
          <div className="space-y-2">
            <Combobox
              label="Add preferred location"
              value=""
              onChange={(v) => v && toggleIn("preferredLocations", v)}
              options={ALL_AREAS.filter((a) => !form.preferredLocations.includes(a.value))}
            />
            {form.preferredLocations.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.preferredLocations.map((loc) => (
                  <span
                    key={loc}
                    className="inline-flex items-center gap-1 pl-3 pr-1.5 py-1 rounded-full text-sm bg-aqua-100 text-sea-800 border border-aqua-300"
                  >
                    {loc}
                    <button
                      type="button"
                      onClick={() => toggleIn("preferredLocations", loc)}
                      className="text-sea-700/60 hover:text-sea-800 p-0.5"
                      aria-label={`Remove ${loc}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </FormSection>

        <FormSection title="Notes">
          <Textarea
            label="Anything worth remembering"
            value={form.notes}
            rows={4}
            onChange={(e) => set("notes", e.target.value)}
          />
        </FormSection>
      </div>
    </Drawer>
  );
}

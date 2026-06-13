"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, RotateCcw } from "lucide-react";
import { Drawer, Input, SegmentedToggle, Combobox, Textarea, Button, useToast, MapLocationPicker } from "@/components/ui";
import { ChipToggleGroup, FormSection, FormStepper, useDraft } from "./formHelpers";
import { formatCurrency } from "@/lib/utils";
import {
  PROPERTY_TYPES, LISTING_TYPES, PROPERTY_FEATURES,
  COUNTRIES, CITIES_BY_COUNTRY, AREAS_BY_CITY,
} from "@/lib/constants";
import { useCreateProperty, useUpdateProperty } from "@/hooks/useProperties";
import { useCurrentAgent } from "@/hooks/useAgents";
import { cn } from "@/lib/utils";
import type { Property } from "@/lib/types";

interface PropertyFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (id: string) => void;
  initialData?: Property;
}

interface Draft {
  country: string;
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
  latitude?: number;
  longitude?: number;
}

const EMPTY: Draft = {
  country: "ae",
  name: "", address: "", city: "", area: "",
  type: "apartment", listingType: "sale",
  price: "", size: "", bedrooms: "", bathrooms: "", floor: "",
  features: [], description: "",
  latitude: undefined, longitude: undefined,
};

function draftFromProperty(p: Property): Draft {
  return {
    country: "ae",  // existing data is UAE; extend when country is stored on Property
    name: p.name, address: p.address, city: p.city, area: p.area ?? "",
    type: p.type, listingType: p.listingType,
    price: String(p.price), size: String(p.size),
    bedrooms: p.bedrooms != null ? String(p.bedrooms) : "",
    bathrooms: p.bathrooms != null ? String(p.bathrooms) : "",
    floor: p.floor != null ? String(p.floor) : "",
    features: p.features ?? [], description: p.description ?? "",
    latitude: p.latitude, longitude: p.longitude,
  };
}

const HAS_ROOMS = new Set(["apartment", "villa"]);

export function PropertyFormDrawer({ isOpen, onClose, onCreated, initialData }: PropertyFormDrawerProps) {
  const isEdit = !!initialData;
  const toast  = useToast();
  const createProperty = useCreateProperty();
  const updateProperty = useUpdateProperty();
  const { agent } = useCurrentAgent();

  const [form, setForm, clearDraft, hasDraft] = useDraft<Draft>("draft:property", EMPTY, isOpen && !isEdit);
  const [step, setStep]   = useState(0);
  const [dir, setDir]     = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showDraftBanner, setShowDraftBanner] = useState(false);

  // Show draft banner when a non-trivial draft was restored
  useEffect(() => {
    if (hasDraft) setShowDraftBanner(true);
  }, [hasDraft]);

  // Reset form when edit drawer opens for a (possibly different) property
  useEffect(() => {
    if (!initialData || !isOpen) return;
    setForm(draftFromProperty(initialData));
    setStep(0);
    setErrors({});
    setShowMap(false);
    setShowDraftBanner(false);
  }, [initialData?._id, isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset showMap when drawer closes
  useEffect(() => {
    if (!isOpen) setShowMap(false);
  }, [isOpen]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const cityOptions  = (CITIES_BY_COUNTRY[form.country] ?? []).map((c) => ({ value: c, label: c }));
  const areaOptions  = (AREAS_BY_CITY[form.city] ?? []).map((a) => ({ value: a, label: a }));

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())    e.name    = "Required";
    if (!form.city)           e.city    = "Required";
    if (!form.address.trim()) e.address = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!form.price || Number(form.price) <= 0) e.price = "Enter a price";
    if (!form.size  || Number(form.size)  <= 0) e.size  = "Enter a size";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next  = () => { if (validateStep1()) { setDir(1); setStep(1); setErrors({}); } };
  const back  = () => { setDir(-1); setStep(0); setErrors({}); };
  const reset = () => { setForm(EMPTY); setStep(0); setErrors({}); clearDraft(); setShowDraftBanner(false); };

  const handleClose = () => { setStep(0); setShowMap(false); onClose(); };

  const num = (s: string) => (s.trim() === "" ? undefined : Number(s));

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setSaving(true);
    try {
      if (isEdit && initialData) {
        await updateProperty({
          id: initialData._id as never,
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
          latitude: form.latitude,
          longitude: form.longitude,
        });
        toast.success(`"${form.name}" updated`);
        onClose();
      } else {
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
          latitude: form.latitude,
          longitude: form.longitude,
          agentId: (agent?._id as never) ?? undefined,
        });
        toast.success(`"${form.name}" listed`);
        reset();
        onClose();
        onCreated?.(id as string);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : isEdit ? "Could not update listing" : "Could not create listing");
    } finally {
      setSaving(false);
    }
  };

  const showRooms = HAS_ROOMS.has(form.type);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? "Edit Property" : "New Property"}
      description={step === 0 ? "Step 1 of 2 — Details" : "Step 2 of 2 — Pricing & specs"}
      footer={
        step === 0 ? (
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={handleClose}>Cancel</Button>
            <Button fullWidth onClick={next}>Continue to Pricing</Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={back}>Back</Button>
            <Button fullWidth loading={saving} onClick={handleSubmit}>
              {isEdit ? "Save Changes" : "Create Listing"}
            </Button>
          </div>
        )
      }
    >
      {/* Progress rail */}
      <div className="flex gap-1.5 mb-1">
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
      <div className="flex justify-between mb-5">
        <p className="text-[10px] font-medium text-ink-400 uppercase tracking-wide">Details</p>
        <p className="text-[10px] font-medium text-ink-400 uppercase tracking-wide">Pricing & specs</p>
      </div>

      {/* Draft restored banner */}
      <AnimatePresence>
        {showDraftBanner && !isEdit && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border border-aqua-200 bg-aqua-50 text-sm overflow-hidden"
          >
            <span className="text-sea-800 font-medium">Draft restored</span>
            <button
              type="button"
              onClick={() => { reset(); setShowDraftBanner(false); }}
              className="flex items-center gap-1 text-xs text-ink-500 hover:text-coral-600 transition-colors touch-manipulation"
            >
              <RotateCcw size={11} />
              Start fresh
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false} custom={dir}>
        <motion.div
          key={step}
          custom={dir}
          variants={{
            enter:  (d: number) => ({ opacity: 0, x: d > 0 ? 24 : -24 }),
            center: { opacity: 1, x: 0 },
            exit:   (d: number) => ({ opacity: 0, x: d > 0 ? -24 : 24 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          {/* ── Step 1: Details ─────────────────────────────────────────── */}
          {step === 0 && (
            <FormSection title="Listing">

              {/* Sale vs Rent — first decision */}
              <SegmentedToggle
                fullWidth
                options={LISTING_TYPES.map((t) => ({ value: t.value, label: t.label }))}
                value={form.listingType}
                onChange={(v) => set("listingType", v)}
              />

              {/* Property type — chip group: wraps, 44px targets, works on mobile */}
              <ChipToggleGroup
                label="Property type"
                options={PROPERTY_TYPES}
                selected={[form.type]}
                onToggle={(v) => set("type", v)}
              />

              {/* Listing name */}
              <Input
                label="Listing name"
                value={form.name}
                error={errors.name}
                onChange={(e) => set("name", e.target.value)}
                onBlur={validateStep1}
                hint="e.g. Marina Gate 2 — 2BR with full sea view"
                autoComplete="off"
              />

              {/* Country toggle — SegmentedToggle since there are only 2 options */}
              <div className="space-y-1.5">
                <p className="text-label text-ink-600">Country</p>
                <SegmentedToggle
                  fullWidth
                  options={COUNTRIES.map((c) => ({ value: c.value, label: c.label }))}
                  value={form.country}
                  onChange={(v) => {
                    set("country", v);
                    set("city", "");
                    set("area", "");
                  }}
                />
              </div>

              {/* City + Area — area disabled until city is chosen */}
              <div className="grid grid-cols-2 gap-3">
                <Combobox
                  label="City"
                  value={form.city}
                  onChange={(v) => { set("city", v); set("area", ""); }}
                  options={cityOptions}
                  error={errors.city}
                />
                <Combobox
                  label="Area"
                  value={form.area}
                  onChange={(v) => set("area", v)}
                  options={areaOptions}
                  disabled={!form.city}
                  hint={!form.city ? "Pick a city first" : undefined}
                />
              </div>

              {/* Street address */}
              <Input
                label="Address"
                value={form.address}
                error={errors.address}
                onChange={(e) => set("address", e.target.value)}
                onBlur={validateStep1}
                autoComplete="street-address"
              />

              {/* Map — collapsible; tap to pin, auto-closes after pin is set */}
              {form.latitude && form.longitude && !showMap ? (
                <div className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border border-hairline bg-surface-base">
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin size={13} className="text-sea-700 shrink-0" />
                    <span className="text-xs text-ink-700 font-mono truncate">
                      {form.latitude.toFixed(4)}, {form.longitude.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowMap(true)}
                      className="text-xs text-aqua-500 font-medium touch-manipulation"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => { set("latitude", undefined); set("longitude", undefined); }}
                      className="text-xs text-coral-500 font-medium touch-manipulation"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : !showMap ? (
                <button
                  type="button"
                  onClick={() => setShowMap(true)}
                  className={cn(
                    "flex items-center gap-2 w-full px-3 py-3 rounded-lg border border-dashed text-sm",
                    "border-ink-200 text-ink-400",
                    "hover:border-aqua-400 hover:text-aqua-500 hover:bg-aqua-50",
                    "transition-colors min-h-[44px] touch-manipulation"
                  )}
                >
                  <MapPin size={14} />
                  Pin location on map
                  <span className="text-xs text-ink-300 ml-auto">optional</span>
                </button>
              ) : null}

              {showMap && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <MapLocationPicker
                    latitude={form.latitude}
                    longitude={form.longitude}
                    onLocationChange={(lat, lng) => {
                      set("latitude", lat);
                      set("longitude", lng);
                      setShowMap(false);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowMap(false)}
                    className="text-xs text-ink-400 hover:text-ink-600 w-full text-center py-1 touch-manipulation"
                  >
                    Collapse map
                  </button>
                </motion.div>
              )}
            </FormSection>
          )}

          {/* ── Step 2: Pricing & Specs ──────────────────────────────────── */}
          {step === 1 && (
            <>
              <FormSection title="Pricing">
                <Input
                  label={`Price${form.listingType === "rent" ? " (AED / year)" : " (AED)"}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={form.price}
                  error={errors.price}
                  hint={form.price && Number(form.price) > 0 ? formatCurrency(Number(form.price)) : undefined}
                  onChange={(e) => set("price", e.target.value.replace(/[^0-9]/g, ""))}
                  onBlur={validateStep2}
                  autoComplete="off"
                />
                <Input
                  label="Size (sqm)"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={form.size}
                  error={errors.size}
                  hint={form.size && Number(form.size) > 0 ? `${Number(form.size).toLocaleString()} sqm` : undefined}
                  onChange={(e) => set("size", e.target.value.replace(/[^0-9]/g, ""))}
                  onBlur={validateStep2}
                  autoComplete="off"
                />
              </FormSection>

              <FormSection title="Specifications">
                {/* Floor — belongs with physical specs, not next to size */}
                <Input
                  label="Floor number"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={form.floor}
                  onChange={(e) => set("floor", e.target.value.replace(/[^0-9]/g, ""))}
                  autoComplete="off"
                />

                {/* Bedrooms + Bathrooms only for property types that have rooms */}
                {showRooms && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormStepper
                      label="Bedrooms"
                      value={form.bedrooms === "" ? 0 : Number(form.bedrooms)}
                      max={10}
                      onChange={(v) => set("bedrooms", String(v))}
                    />
                    <FormStepper
                      label="Bathrooms"
                      value={form.bathrooms === "" ? 0 : Number(form.bathrooms)}
                      max={10}
                      onChange={(v) => set("bathrooms", String(v))}
                    />
                  </div>
                )}
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
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </Drawer>
  );
}

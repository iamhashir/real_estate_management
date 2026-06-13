"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, type Variants } from "framer-motion";
import { Drawer, Button, Badge, StatusPill } from "@/components/ui";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import { propertyImage } from "@/lib/propertyImage";
import { PROPERTY_TYPES, LISTING_TYPES } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  MapPin, BedDouble, Bath, Maximize, Layers,
  ChevronLeft, ChevronRight, Pencil, Trash2,
  Home, Building2, Building, LandPlot, Store,
} from "lucide-react";
import type { Property } from "@/lib/types";

// ─── Labels & icons ───────────────────────────────────────────────────────────

function typeLabel(value: string) {
  return PROPERTY_TYPES.find((t) => t.value === value)?.label ?? value;
}
function listingLabel(value: string) {
  return LISTING_TYPES.find((t) => t.value === value)?.label ?? value;
}

type IconType = React.ComponentType<{ size?: number | string; className?: string }>;

const TYPE_ICON: Record<string, IconType> = {
  villa: Home,
  apartment: Building2,
  office: Building,
  land: LandPlot,
  commercial: Store,
};

// ─── Image sources ────────────────────────────────────────────────────────────
// Properties don't carry an uploaded image field yet (see lib/propertyImage.ts).
// We future-proof against an `images: string[]` / `imageUrl: string` field, and
// otherwise derive a stable multi-shot gallery from the same curated pool the
// card thumbnail uses — salted ids deterministically pick sibling pool photos,
// so the same listing always shows the same gallery (canonical card photo first).

function galleryImages(p: Property): string[] {
  const maybe = p as Property & { images?: unknown; imageUrl?: unknown };
  if (Array.isArray(maybe.images) && maybe.images.length > 0) {
    return maybe.images.filter((u): u is string => typeof u === "string" && u.length > 0);
  }
  if (typeof maybe.imageUrl === "string" && maybe.imageUrl) return [maybe.imageUrl];

  const urls = [propertyImage(p, 1200)];
  for (let i = 0; urls.length < 3 && i < 8; i++) {
    const url = propertyImage({ ...p, _id: `${p._id || p.name}#${i}` }, 1200);
    if (!urls.includes(url)) urls.push(url);
  }
  return urls;
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

function ImageGallery({ property }: { property: Property }) {
  const reduceMotion = useReducedMotion();
  const images = useMemo(() => galleryImages(property), [property]);
  const multiple = images.length > 1;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: multiple, active: multiple });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(reduceMotion), [emblaApi, reduceMotion]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(reduceMotion), [emblaApi, reduceMotion]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i, reduceMotion), [emblaApi, reduceMotion]);

  const TypeIcon = TYPE_ICON[property.type] ?? Building2;

  // Graceful placeholder layer — sits behind each photo so a failed load (or no
  // photo at all) degrades to the property-type icon over a cream gradient.
  const placeholder = (
    <div className="absolute inset-0 grid place-items-center bg-gradient-deco">
      <TypeIcon size={44} className="text-sea-700/25" />
    </div>
  );

  if (images.length === 0) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden" aria-label={`No photos for ${property.name}`}>
        {placeholder}
      </div>
    );
  }

  return (
    <div
      className="relative group"
      role="region"
      aria-roledescription="carousel"
      aria-label={`Photos of ${property.name}`}
    >
      <div ref={emblaRef} className={cn("overflow-hidden rounded-xl", multiple && "touch-pan-y cursor-grab active:cursor-grabbing")}>
        <div className="flex">
          {images.map((src, i) => (
            <div key={src} className="relative min-w-0 flex-[0_0_100%] aspect-video">
              {placeholder}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${property.name} — photo ${i + 1} of ${images.length}`}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover select-none"
                onError={(e) => { e.currentTarget.style.opacity = "0"; }}
              />
            </div>
          ))}
        </div>
      </div>

      {multiple && (
        <>
          {/* Prev / next — glass buttons, always visible on touch, hover-revealed on desktop */}
          {[
            { onClick: scrollPrev, label: "Previous photo", Icon: ChevronLeft, side: "left-2" },
            { onClick: scrollNext, label: "Next photo", Icon: ChevronRight, side: "right-2" },
          ].map(({ onClick, label, Icon, side }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              aria-label={label}
              className={cn(
                "absolute top-1/2 -translate-y-1/2", side,
                "min-h-[44px] min-w-[44px] grid place-items-center rounded-full",
                "bg-white/80 backdrop-blur border border-white/60 shadow-card text-sea-800",
                "hover:bg-white transition-opacity touch-manipulation",
                "opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua-400"
              )}
            >
              <Icon size={18} />
            </button>
          ))}

          {/* Dot indicators */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-center pointer-events-none">
            <div className="pointer-events-auto flex items-center px-2 rounded-full">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => scrollTo(i)}
                  aria-label={`Go to photo ${i + 1}`}
                  aria-current={selected === i ? "true" : undefined}
                  className="h-[44px] px-1.5 flex items-center touch-manipulation focus-visible:outline-none group/dot"
                >
                  <span
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-200 shadow-card",
                      "group-focus-visible/dot:ring-2 group-focus-visible/dot:ring-aqua-400",
                      selected === i ? "w-4 bg-white" : "w-1.5 bg-white/60"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Spec tile ────────────────────────────────────────────────────────────────

function SpecTile({ icon: Icon, label, value }: { icon: IconType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-md border border-hairline bg-surface-base px-3 py-2.5 min-w-0">
      <Icon size={16} className="text-ink-500 shrink-0" />
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink-900 text-money truncate">{value}</p>
        <p className="text-xs text-ink-500">{label}</p>
      </div>
    </div>
  );
}

// ─── Drawer ───────────────────────────────────────────────────────────────────

interface PropertyDetailDrawerProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  /** Close this drawer and open the edit form for the property. */
  onEdit?: (property: Property) => void;
  onDelete?: (property: Property) => void;
}

export function PropertyDetailDrawer({ property, isOpen, onClose, onEdit, onDelete }: PropertyDetailDrawerProps) {
  const reduceMotion = useReducedMotion();

  // Hold the last property so content stays rendered during the exit animation
  // ("storing information from previous renders" — react.dev pattern).
  const [last, setLast] = useState<Property | null>(null);
  if (property && property !== last) setLast(property);
  const p = property ?? last;

  const container: Variants = {
    hidden: {},
    show: { transition: reduceMotion ? {} : { staggerChildren: 0.06, delayChildren: 0.08 } },
  };
  const section: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 12 },
    show: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] } },
  };

  if (!p) return null;

  const TypeIcon = TYPE_ICON[p.type] ?? Building2;
  const isRent = p.listingType === "rent";

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Property Details"
      footer={
        <div className="flex items-center gap-2">
          {onDelete && (
            <Button
              variant="ghost"
              onClick={() => onDelete(p)}
              aria-label="Delete listing"
              className="px-3 text-danger hover:bg-danger/10 hover:text-danger shrink-0"
            >
              <Trash2 size={16} />
            </Button>
          )}
          {onEdit && (
            <Button fullWidth leftIcon={<Pencil size={15} />} onClick={() => onEdit(p)}>
              Edit Listing
            </Button>
          )}
        </div>
      }
    >
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
        {/* 1 — Gallery */}
        <motion.section variants={section}>
          <ImageGallery property={p} />
        </motion.section>

        {/* 2 — Header */}
        <motion.section variants={section}>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill value={p.status} variant="property" />
            <Badge color="sea">{listingLabel(p.listingType)}</Badge>
          </div>
          <h3 className="font-display font-600 text-xl md:text-2xl text-ink-900 mt-2">{p.name}</h3>
          <p className="text-sm text-ink-600 flex items-center gap-1.5 mt-1">
            <MapPin size={14} className="text-ink-500 shrink-0" />
            <span>
              {p.address}
              {p.area ? `, ${p.area}` : ""}, {p.city}
            </span>
          </p>
        </motion.section>

        {/* 3 — Price */}
        <motion.section variants={section} className="rounded-md border border-hairline bg-aqua-100/40 px-4 py-3">
          <p className="font-display font-600 text-2xl text-ink-900 text-money">
            {formatCurrency(p.price)}
            {isRent && <span className="text-sm font-sans font-normal text-ink-500"> /yr</span>}
          </p>
          {p.size > 0 && (
            <p className="text-xs text-ink-500 mt-0.5 text-money">
              {formatCurrency(Math.round(p.price / p.size))} per m²{isRent ? " / year" : ""}
            </p>
          )}
        </motion.section>

        {/* 4 — Specs */}
        <motion.section variants={section}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {p.bedrooms != null && (
              <SpecTile icon={BedDouble} label="Bedrooms" value={String(p.bedrooms)} />
            )}
            {p.bathrooms != null && (
              <SpecTile icon={Bath} label="Bathrooms" value={String(p.bathrooms)} />
            )}
            <SpecTile icon={Maximize} label="Size" value={`${formatNumber(p.size)} m²`} />
            {p.floor != null && (
              <SpecTile icon={Layers} label="Floor" value={String(p.floor)} />
            )}
            <SpecTile icon={TypeIcon} label="Type" value={typeLabel(p.type)} />
          </div>
        </motion.section>

        {/* 5 — Features */}
        {p.features && p.features.length > 0 && (
          <motion.section variants={section}>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-600 mb-2">Features</p>
            <div className="flex flex-wrap gap-1.5">
              {p.features.map((f) => (
                <span key={f} className="rounded-full bg-aqua-100/60 text-sea-800 text-xs font-medium px-2.5 py-1">
                  {f}
                </span>
              ))}
            </div>
          </motion.section>
        )}

        {/* 6 — Description */}
        {p.description && (
          <motion.section variants={section}>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-600 mb-2">Description</p>
            <p className="text-sm text-ink-600 leading-relaxed whitespace-pre-wrap">{p.description}</p>
          </motion.section>
        )}
      </motion.div>
    </Drawer>
  );
}

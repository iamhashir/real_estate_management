"use client";

import { cn } from "@/lib/utils";
import React, { useCallback, useRef, useState } from "react";

interface RangeSliderProps {
  min:          number;
  max:          number;
  step?:        number;
  value:        [number, number];
  onChange:     (value: [number, number]) => void;
  formatValue?: (value: number) => string;
  label?:       string;
  className?:   string;
}

export function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue = (v) => String(v),
  label,
  className,
}: RangeSliderProps) {
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const snap  = (v: number) => Math.round(v / step) * step;

  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  const posToValue = useCallback(
    (clientX: number): number => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return min;
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return snap(clamp(min + ratio * (max - min)));
    },
    [min, max, step] // eslint-disable-line
  );

  const handlePointerDown = (
    e: React.PointerEvent<HTMLButtonElement>,
    which: "min" | "max"
  ) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(which);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging) return;
    const v = posToValue(e.clientX);
    if (dragging === "min") onChange([Math.min(v, value[1] - step), value[1]]);
    else                    onChange([value[0], Math.max(v, value[0] + step)]);
  };

  const handlePointerUp = () => setDragging(null);

  const loPercent = pct(value[0]);
  const hiPercent = pct(value[1]);

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <p className="text-label text-ink-600">{label}</p>
      )}

      {/* Value display */}
      <div className="flex items-center justify-between text-sm font-medium text-ink-900 text-money">
        <span>{formatValue(value[0])}</span>
        <span>{formatValue(value[1])}</span>
      </div>

      {/* Track */}
      <div ref={trackRef} className="relative h-10 flex items-center">
        {/* Background track */}
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-hairline" />

        {/* Active range */}
        <div
          className="absolute h-1.5 rounded-full bg-gradient-foam"
          style={{ left: `${loPercent}%`, right: `${100 - hiPercent}%` }}
        />

        {/* Min thumb */}
        <Thumb
          value={loPercent}
          label={formatValue(value[0])}
          dragging={dragging === "min"}
          onPointerDown={(e) => handlePointerDown(e, "min")}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          ariaLabel="Minimum value"
          ariaValueMin={min}
          ariaValueMax={value[1]}
          ariaValueNow={value[0]}
        />

        {/* Max thumb */}
        <Thumb
          value={hiPercent}
          label={formatValue(value[1])}
          dragging={dragging === "max"}
          onPointerDown={(e) => handlePointerDown(e, "max")}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          ariaLabel="Maximum value"
          ariaValueMin={value[0]}
          ariaValueMax={max}
          ariaValueNow={value[1]}
        />
      </div>
    </div>
  );
}

interface ThumbProps {
  value:         number;
  label:         string;
  dragging:      boolean;
  onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerUp:   () => void;
  ariaLabel:     string;
  ariaValueMin:  number;
  ariaValueMax:  number;
  ariaValueNow:  number;
}

function Thumb({
  value, label, dragging,
  onPointerDown, onPointerMove, onPointerUp,
  ariaLabel, ariaValueMin, ariaValueMax, ariaValueNow,
}: ThumbProps) {
  return (
    <button
      type="button"
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={ariaValueMin}
      aria-valuemax={ariaValueMax}
      aria-valuenow={ariaValueNow}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className={cn(
        "absolute -translate-x-1/2 w-5 h-5 rounded-full bg-white",
        "border-2 border-aqua-500 shadow-card",
        "focus-visible:outline-none focus-visible:shadow-glow",
        "transition-transform touch-manipulation",
        dragging && "scale-125 shadow-float cursor-grabbing",
        !dragging && "cursor-grab hover:scale-110"
      )}
      style={{ left: `${value}%` }}
    >
      {/* Floating label */}
      <span
        className={cn(
          "absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5",
          "px-1.5 py-0.5 rounded bg-sea-800 text-white text-[10px] font-medium whitespace-nowrap",
          "pointer-events-none transition-opacity",
          dragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        {label}
      </span>
    </button>
  );
}

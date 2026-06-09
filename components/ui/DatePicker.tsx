"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import React, { useId, useRef, useState } from "react";

interface DatePickerProps {
  label:        string;
  value?:       number;
  onChange:     (timestamp: number | undefined) => void;
  error?:       string;
  hint?:        string;
  min?:         number;
  max?:         number;
  className?:   string;
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

const QUICK_CHIPS = [
  { label: "Today",       offset: 0 },
  { label: "+30 days",    offset: 30 },
  { label: "End of month", offset: -1 },
];

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function chipDate(offset: number): Date {
  if (offset === -1) return endOfMonth(new Date());
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d;
}

function fmtDisplay(ts: number) {
  return new Date(ts).toLocaleDateString("en-AE", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export function DatePicker({
  label, value, onChange, error, hint, min, max, className,
}: DatePickerProps) {
  const id          = useId();
  const [open, setOpen]       = useState(false);
  const [focused, setFocused] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    const d = value ? new Date(value) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const close = () => { setOpen(false); setFocused(false); };

  // Build calendar days
  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay  = new Date(year, month, 1).getDay();
  const daysCount = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysCount }, (_, i) => i + 1),
  ];

  const selectDay = (day: number) => {
    const ts = new Date(year, month, day).getTime();
    onChange(ts);
    close();
  };

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isDaySelected = (day: number) => {
    if (!value) return false;
    const d = new Date(value);
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
  };

  const isDayDisabled = (day: number) => {
    const ts = new Date(year, month, day).getTime();
    if (min && ts < min) return true;
    if (max && ts > max) return true;
    return false;
  };

  const isToday = (day: number) => {
    const t = new Date();
    return t.getFullYear() === year && t.getMonth() === month && t.getDate() === day;
  };

  const hasValue = !!value;
  const floated  = focused || hasValue || open;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        className={cn(
          "relative flex items-center rounded-md border transition-all duration-150 bg-surface-card cursor-pointer",
          error
            ? "border-danger/60 shadow-[0_0_0_2px_rgba(229,72,77,0.15)]"
            : open || focused
              ? "border-aqua-400 shadow-glow"
              : "border-hairline hover:border-ink-200"
        )}
        onClick={() => { setOpen(!open); setFocused(true); }}
      >
        <Calendar size={14} className="absolute left-3 text-ink-400 pointer-events-none" />

        <div
          id={id}
          className="w-full bg-transparent pt-5 pb-1.5 pl-9 pr-8 text-base text-ink-900 min-h-[52px] flex items-end pb-2"
        >
          {hasValue ? fmtDisplay(value!) : ""}
        </div>

        <label
          htmlFor={id}
          className={cn(
            "absolute left-9 pointer-events-none transition-all duration-150 select-none",
            floated
              ? "top-1.5 text-[10px] font-medium tracking-wide uppercase"
              : "top-1/2 -translate-y-1/2 text-sm",
            error ? "text-danger" : focused || open ? "text-aqua-500" : "text-ink-400"
          )}
        >
          {label}
        </label>

        {hasValue && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(undefined); }}
            className="absolute right-2.5 text-ink-400 hover:text-ink-700 p-0.5 rounded"
          >
            <X size={12} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.14 }}
            className="absolute inset-x-0 top-full mt-1 z-50 bg-surface-card border border-hairline rounded-md shadow-float p-3 space-y-3"
          >
            {/* Quick chips */}
            <div className="flex gap-1.5 flex-wrap">
              {QUICK_CHIPS.map((chip) => {
                const d  = chipDate(chip.offset);
                const ts = d.getTime();
                return (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => { onChange(ts); close(); }}
                    className="px-2.5 py-1 text-xs rounded-full border border-hairline text-ink-600 hover:border-aqua-400 hover:text-aqua-500 hover:bg-aqua-100 transition-colors"
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>

            {/* Month navigation */}
            <div className="flex items-center justify-between">
              <button type="button" onClick={prevMonth} className="p-1 text-ink-400 hover:text-ink-700 rounded min-h-[32px] min-w-[32px] flex items-center justify-center">
                <ChevronLeft size={14} />
              </button>
              <span className="text-sm font-medium text-ink-900">
                {MONTHS[month]} {year}
              </span>
              <button type="button" onClick={nextMonth} className="p-1 text-ink-400 hover:text-ink-700 rounded min-h-[32px] min-w-[32px] flex items-center justify-center">
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-[10px] font-medium text-ink-400 py-1">
                  {d}
                </div>
              ))}
              {cells.map((day, i) =>
                day === null ? (
                  <div key={`empty-${i}`} />
                ) : (
                  <button
                    key={day}
                    type="button"
                    disabled={isDayDisabled(day)}
                    onClick={() => selectDay(day)}
                    className={cn(
                      "w-full aspect-square flex items-center justify-center text-sm rounded-md transition-colors",
                      "min-h-[30px]",
                      isDaySelected(day)
                        ? "bg-gradient-foam text-sea-900 font-medium"
                        : isToday(day)
                          ? "text-aqua-500 font-semibold border border-aqua-300"
                          : "text-ink-900 hover:bg-aqua-100",
                      isDayDisabled(day) && "opacity-30 cursor-not-allowed hover:bg-transparent"
                    )}
                  >
                    {day}
                  </button>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      {!error && hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}

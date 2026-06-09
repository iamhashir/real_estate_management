"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { Card } from "@/components/ui";

type Accent = "aqua" | "sea" | "success" | "coral";

interface StatCardProps {
  label: string;
  value: number;
  format?: (n: number) => string;
  subtitle?: string;
  accent?: Accent;
}

export function StatCard({ label, value, format = (n) => String(n), subtitle, accent = "aqua" }: StatCardProps) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => format(Math.round(v)));

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) { mv.set(value); return; }
    const controls = animate(mv, value, { duration: 0.5, ease: [0.22, 1, 0.36, 1] });
    return controls.stop;
  }, [value, mv]);

  return (
    <Card accent={accent} className="p-4">
      <p className="text-label text-ink-400">{label}</p>
      <p className="text-display-xl font-display font-600 text-ink-900 mt-1 text-money leading-none">
        <motion.span>{text}</motion.span>
      </p>
      {subtitle && <p className="text-sm text-ink-600 mt-2">{subtitle}</p>}
    </Card>
  );
}

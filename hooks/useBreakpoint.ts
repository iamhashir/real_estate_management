"use client";

import { useEffect, useState } from "react";

const BREAKPOINTS = {
  sm:  640,
  md:  768,
  lg:  1024,
  xl:  1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

function getActive(width: number): Breakpoint | "xs" {
  if (width >= BREAKPOINTS["2xl"]) return "2xl";
  if (width >= BREAKPOINTS.xl)    return "xl";
  if (width >= BREAKPOINTS.lg)    return "lg";
  if (width >= BREAKPOINTS.md)    return "md";
  if (width >= BREAKPOINTS.sm)    return "sm";
  return "xs";
}

export function useBreakpoint() {
  const [width, setWidth] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1280
  );

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    const mql = window.matchMedia(`(min-width: 0px)`);
    window.addEventListener("resize", handler, { passive: true });
    return () => window.removeEventListener("resize", handler);
  }, []);

  const active = getActive(width);

  return {
    width,
    active,
    isMobile:  width < BREAKPOINTS.md,
    isTablet:  width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
    isDesktop: width >= BREAKPOINTS.lg,
    /** true if viewport is at least this breakpoint */
    gte: (bp: Breakpoint) => width >= BREAKPOINTS[bp],
    /** true if viewport is strictly below this breakpoint */
    lt:  (bp: Breakpoint) => width < BREAKPOINTS[bp],
  };
}

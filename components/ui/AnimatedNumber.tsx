"use client";

import NumberFlow from "@number-flow/react";

interface AnimatedNumberProps {
  value: number;
  /** Render as AED currency. */
  currency?: boolean;
  decimals?: number;
  className?: string;
}

/**
 * Tactile animated number — digits roll/slide between values. Used for stats
 * and the live commission preview. Respects reduced-motion via NumberFlow.
 */
export function AnimatedNumber({ value, currency, decimals = 0, className }: AnimatedNumberProps) {
  return (
    <NumberFlow
      value={value}
      locales="en-AE"
      format={
        currency
          ? { style: "currency", currency: "AED", maximumFractionDigits: 0 }
          : { maximumFractionDigits: decimals }
      }
      className={className}
      willChange
    />
  );
}

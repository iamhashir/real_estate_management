"use client";

import { motion, useReducedMotion } from "framer-motion";

export type EmptyStateArtVariant =
  | "properties"
  | "clients"
  | "deals"
  | "search"
  | "generic";

interface EmptyStateArtProps {
  variant?: EmptyStateArtVariant;
  className?: string;
}

const DRAW = { duration: 1.2, ease: [0.45, 0, 0.2, 1] as const };

/**
 * Illustrated empty states — each variant is a small hand-drawn scene that
 * sketches itself in with a path-draw animation and then floats gently.
 * Line work in deep sea ink, fills in honey cream and aqua mist.
 */
export function EmptyStateArt({ variant = "generic", className }: EmptyStateArtProps) {
  const reduceMotion = useReducedMotion();

  const path = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { ...DRAW, delay },
        };

  const pop = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, scale: 0 },
          animate: { opacity: 1, scale: 1 },
          transition: { type: "spring" as const, stiffness: 300, damping: 18, delay: 0.8 + delay },
        };

  const scenes: Record<EmptyStateArtVariant, React.ReactNode> = {
    /* House with a key — no properties yet */
    properties: (
      <>
        <motion.circle cx="80" cy="64" r="50" fill="rgba(251,243,226,0.9)" {...pop(0)} />
        <motion.path
          d="M48 96 V64 L80 38 L112 64 V96 H48 Z"
          stroke="#115A70" strokeWidth="2.5" strokeLinejoin="round" fill="rgba(255,255,255,0.85)"
          {...path(0.1)}
        />
        <motion.path
          d="M70 96 V76 H90 V96"
          stroke="#C99E4E" strokeWidth="2.5" strokeLinejoin="round"
          {...path(0.4)}
        />
        <motion.circle cx="80" cy="58" r="6" stroke="#115A70" strokeWidth="2" fill="rgba(233,205,150,0.5)" {...pop(0.1)} />
        {/* Floating key */}
        <motion.g {...pop(0.3)}>
          <circle cx="124" cy="40" r="7" stroke="#C99E4E" strokeWidth="2.5" fill="none" />
          <path d="M129 45 L142 58 M136 52 L141 47 M139 55 L144 50" stroke="#C99E4E" strokeWidth="2.5" strokeLinecap="round" />
        </motion.g>
        {/* Sparkles */}
        <motion.path d="M36 38 L36 48 M31 43 L41 43" stroke="#17BFBA" strokeWidth="2" strokeLinecap="round" {...pop(0.45)} />
        <motion.circle cx="120" cy="92" r="2.5" fill="#FF6B5E" {...pop(0.55)} />
      </>
    ),

    /* Two figures — no clients yet */
    clients: (
      <>
        <motion.circle cx="80" cy="64" r="50" fill="rgba(221,250,246,0.8)" {...pop(0)} />
        {/* Figure 1 */}
        <motion.circle cx="62" cy="50" r="12" stroke="#115A70" strokeWidth="2.5" fill="rgba(255,255,255,0.9)" {...path(0.1)} />
        <motion.path
          d="M42 96 Q42 70 62 70 Q82 70 82 96"
          stroke="#115A70" strokeWidth="2.5" strokeLinecap="round" fill="rgba(251,243,226,0.9)"
          {...path(0.3)}
        />
        {/* Figure 2 */}
        <motion.circle cx="100" cy="56" r="10" stroke="#C99E4E" strokeWidth="2.5" fill="rgba(255,255,255,0.9)" {...path(0.45)} />
        <motion.path
          d="M84 96 Q84 73 100 73 Q116 73 116 96"
          stroke="#C99E4E" strokeWidth="2.5" strokeLinecap="round" fill="rgba(233,205,150,0.35)"
          {...path(0.6)}
        />
        {/* Greeting sparkle between them */}
        <motion.path d="M84 34 L84 44 M79 39 L89 39" stroke="#17BFBA" strokeWidth="2" strokeLinecap="round" {...pop(0.4)} />
        <motion.circle cx="124" cy="44" r="2.5" fill="#FF6B5E" {...pop(0.55)} />
      </>
    ),

    /* Contract with pen — no deals yet */
    deals: (
      <>
        <motion.circle cx="80" cy="64" r="50" fill="rgba(251,243,226,0.9)" {...pop(0)} />
        <motion.rect
          x="50" y="32" width="60" height="68" rx="6"
          stroke="#115A70" strokeWidth="2.5" fill="rgba(255,255,255,0.9)"
          {...path(0.1)}
        />
        {[46, 58, 70].map((y, i) => (
          <motion.line
            key={y}
            x1="60" y1={y} x2="100" y2={y}
            stroke="#ABA496" strokeWidth="2" strokeLinecap="round"
            {...path(0.3 + i * 0.12)}
          />
        ))}
        {/* Signature flourish */}
        <motion.path
          d="M60 86 Q68 78 74 86 Q80 94 88 84"
          stroke="#17BFBA" strokeWidth="2.5" strokeLinecap="round"
          {...path(0.7)}
        />
        {/* Pen */}
        <motion.g {...pop(0.35)}>
          <path d="M104 78 L122 60 L128 66 L110 84 L102 86 Z" stroke="#C99E4E" strokeWidth="2.5" strokeLinejoin="round" fill="rgba(233,205,150,0.5)" />
        </motion.g>
        <motion.path d="M36 44 L36 54 M31 49 L41 49" stroke="#17BFBA" strokeWidth="2" strokeLinecap="round" {...pop(0.5)} />
      </>
    ),

    /* Magnifier over map pin — no search results */
    search: (
      <>
        <motion.circle cx="80" cy="64" r="50" fill="rgba(221,250,246,0.8)" {...pop(0)} />
        <motion.circle
          cx="72" cy="58" r="24"
          stroke="#115A70" strokeWidth="3" fill="rgba(255,255,255,0.85)"
          {...path(0.1)}
        />
        <motion.line
          x1="90" y1="76" x2="108" y2="94"
          stroke="#115A70" strokeWidth="4" strokeLinecap="round"
          {...path(0.5)}
        />
        {/* Map pin inside the lens */}
        <motion.path
          d="M72 48 Q80 48 80 57 Q80 64 72 70 Q64 64 64 57 Q64 48 72 48 Z"
          stroke="#FF6B5E" strokeWidth="2.5" strokeLinejoin="round" fill="rgba(255,236,234,0.9)"
          {...path(0.35)}
        />
        <motion.circle cx="72" cy="57" r="2.5" fill="#FF6B5E" {...pop(0.3)} />
        <motion.path d="M116 40 L116 50 M111 45 L121 45" stroke="#C99E4E" strokeWidth="2" strokeLinecap="round" {...pop(0.45)} />
      </>
    ),

    /* Gentle waves with a small sail — generic */
    generic: (
      <>
        <motion.circle cx="80" cy="64" r="50" fill="rgba(251,243,226,0.9)" {...pop(0)} />
        <motion.path
          d="M30 84 Q45 72 60 84 Q75 96 90 84 Q105 72 120 84 Q128 90 134 86"
          stroke="#17BFBA" strokeWidth="2.5" strokeLinecap="round"
          {...path(0.1)}
        />
        <motion.path
          d="M36 96 Q51 84 66 96 Q81 108 96 96 Q111 84 126 96"
          stroke="#115A70" strokeWidth="2" strokeLinecap="round" opacity="0.5"
          {...path(0.3)}
        />
        {/* Sailboat */}
        <motion.g {...pop(0.25)}>
          <path d="M66 76 L94 76 L88 84 L72 84 Z" stroke="#115A70" strokeWidth="2" strokeLinejoin="round" fill="rgba(255,255,255,0.9)" />
          <path d="M79 76 V46 L96 72 Z" stroke="#C99E4E" strokeWidth="2" strokeLinejoin="round" fill="rgba(233,205,150,0.5)" />
        </motion.g>
        <motion.circle cx="116" cy="44" r="8" stroke="#C99E4E" strokeWidth="2" fill="rgba(233,205,150,0.4)" {...pop(0.4)} />
      </>
    ),
  };

  return (
    <motion.svg
      viewBox="0 0 160 128"
      fill="none"
      className={className}
      aria-hidden="true"
      animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
      transition={
        reduceMotion
          ? undefined
          : { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.6 }
      }
    >
      {scenes[variant]}
    </motion.svg>
  );
}

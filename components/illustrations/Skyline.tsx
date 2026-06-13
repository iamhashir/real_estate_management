"use client";

import { motion, useReducedMotion } from "framer-motion";

interface SkylineProps {
  className?: string;
}

/** Shared ease for the line-draw choreography. */
const DRAW = { duration: 1.6, ease: [0.45, 0, 0.2, 1] as const };

/**
 * Animated line-art city skyline — buildings draw themselves in, windows
 * blink on in a stagger, and a sun slowly rises behind the towers.
 * Designed for the dashboard hero band; inherit size via className.
 */
export function Skyline({ className }: SkylineProps) {
  const reduceMotion = useReducedMotion();

  const path = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { ...DRAW, delay },
        };

  const windowAppear = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, scale: 0 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.35, delay: 1.2 + delay },
        };

  return (
    <svg
      viewBox="0 0 560 240"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Sun — rises and glows behind the skyline */}
      <motion.circle
        cx="430"
        cy="80"
        r="34"
        stroke="var(--art-accent)"
        strokeWidth="2"
        fill="var(--art-honey-faint)"
        initial={reduceMotion ? undefined : { cy: 130, opacity: 0 }}
        animate={reduceMotion ? undefined : { cy: 80, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.4 }}
      />
      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <motion.line
          key={deg}
          x1={430 + Math.cos((deg * Math.PI) / 180) * 44}
          y1={80 + Math.sin((deg * Math.PI) / 180) * 44}
          x2={430 + Math.cos((deg * Math.PI) / 180) * 52}
          y2={80 + Math.sin((deg * Math.PI) / 180) * 52}
          stroke="var(--art-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          {...windowAppear(0.06 * i)}
        />
      ))}

      {/* Ground line */}
      <motion.line
        x1="10"
        y1="222"
        x2="550"
        y2="222"
        stroke="var(--art-line)"
        strokeWidth="2.5"
        strokeLinecap="round"
        {...path(0)}
      />

      {/* Tower 1 — tall, left */}
      <motion.path
        d="M60 222 V92 H128 V222"
        stroke="var(--art-line)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        {...path(0.15)}
      />
      <motion.path
        d="M78 92 V74 H110 V92"
        stroke="var(--art-line)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        {...path(0.35)}
      />
      {/* Antenna */}
      <motion.line
        x1="94" y1="74" x2="94" y2="54"
        stroke="var(--art-line)" strokeWidth="2" strokeLinecap="round"
        {...path(0.5)}
      />
      <motion.circle cx="94" cy="50" r="3" fill="var(--art-pop)" {...windowAppear(0.5)} />

      {/* Tower 1 windows */}
      {[112, 136, 160, 184].map((y, row) =>
        [74, 94, 114].map((x, col) => (
          <motion.rect
            key={`t1-${row}-${col}`}
            x={x}
            y={y}
            width="10"
            height="12"
            rx="1.5"
            fill="var(--art-aqua)"
            {...windowAppear(row * 0.1 + col * 0.05)}
          />
        ))
      )}

      {/* Tower 2 — mid, stepped */}
      <motion.path
        d="M152 222 V132 H190 V112 H226 V222"
        stroke="var(--art-line)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        {...path(0.3)}
      />
      {[148, 172, 196].map((y, row) => (
        <motion.rect
          key={`t2-${row}`}
          x={166}
          y={y}
          width="44"
          height="10"
          rx="1.5"
          fill="var(--art-brass)"
          {...windowAppear(0.3 + row * 0.1)}
        />
      ))}

      {/* Tower 3 — landmark, tallest */}
      <motion.path
        d="M252 222 V64 L290 40 L328 64 V222"
        stroke="var(--art-line-deep)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        {...path(0.45)}
      />
      <motion.line
        x1="290" y1="40" x2="290" y2="20"
        stroke="var(--art-line-deep)" strokeWidth="2" strokeLinecap="round"
        {...path(0.8)}
      />
      <motion.circle cx="290" cy="16" r="3" fill="var(--art-flag)" {...windowAppear(0.8)} />
      {[84, 110, 136, 162, 188].map((y, row) => (
        <motion.rect
          key={`t3-${row}`}
          x={268}
          y={y}
          width="44"
          height="12"
          rx="1.5"
          fill="var(--art-aqua-soft)"
          {...windowAppear(0.45 + row * 0.08)}
        />
      ))}

      {/* House — foreground, right of landmark */}
      <motion.path
        d="M352 222 V160 L394 128 L436 160 V222"
        stroke="var(--art-line)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        {...path(0.6)}
      />
      {/* Door */}
      <motion.path
        d="M382 222 V188 H406 V222"
        stroke="var(--art-accent)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        {...path(0.9)}
      />
      <motion.circle cx="401" cy="206" r="2" fill="var(--art-accent)" {...windowAppear(0.9)} />
      {/* Round attic window */}
      <motion.circle
        cx="394"
        cy="158"
        r="9"
        stroke="var(--art-line)"
        strokeWidth="2"
        fill="var(--art-honey)"
        {...windowAppear(0.7)}
      />

      {/* Tower 4 — right edge */}
      <motion.path
        d="M460 222 V108 H520 V222"
        stroke="var(--art-line)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        {...path(0.75)}
      />
      {[124, 150, 176].map((y, row) =>
        [472, 496].map((x, col) => (
          <motion.rect
            key={`t4-${row}-${col}`}
            x={x}
            y={y}
            width="12"
            height="14"
            rx="1.5"
            fill="var(--art-coral)"
            {...windowAppear(0.75 + row * 0.1 + col * 0.05)}
          />
        ))
      )}

      {/* Birds */}
      {[
        { x: 180, y: 60, d: 1.8 },
        { x: 210, y: 48, d: 2.0 },
        { x: 360, y: 76, d: 2.2 },
      ].map((b, i) => (
        <motion.path
          key={`bird-${i}`}
          d={`M${b.x} ${b.y} q5 -6 10 0 q5 -6 10 0`}
          stroke="var(--art-bird)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={reduceMotion ? undefined : { opacity: 0, x: -16 }}
          animate={reduceMotion ? undefined : { opacity: 0.7, x: 0 }}
          transition={{ duration: 0.8, delay: b.d }}
        />
      ))}
    </svg>
  );
}

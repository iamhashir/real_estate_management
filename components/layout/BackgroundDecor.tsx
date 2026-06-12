"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Porcelain atmosphere — a pure white canvas brought alive by large drifting
 * pastel orbs (honey cream, aqua mist, soft rose), a whisper-fine dot grid,
 * and two slow rotating rings. Everything stays below ~8% opacity so content
 * glass panes read crisply on top.
 */
export function BackgroundDecor() {
  const reduceMotion = useReducedMotion();

  const drift = (dx: number, dy: number, duration: number) =>
    reduceMotion
      ? {}
      : {
          animate: { x: [0, dx, 0], y: [0, dy, 0], scale: [1, 1.06, 1] },
          transition: { duration, repeat: Infinity, ease: "easeInOut" as const },
        };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-white">
      {/* ── Whisper-fine dot grid ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(120,105,80,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ── Drifting pastel orbs ──────────────────────────────────────────── */}
      {/* Honey cream — top right */}
      <motion.div
        className="absolute rounded-full"
        style={{
          top: "-22%",
          right: "-12%",
          width: "62vw",
          height: "62vw",
          maxWidth: 880,
          maxHeight: 880,
          background:
            "radial-gradient(circle, rgba(233,205,150,0.30) 0%, rgba(245,228,190,0.12) 45%, transparent 70%)",
          filter: "blur(70px)",
        }}
        {...drift(-30, 24, 26)}
      />

      {/* Aqua mist — left center */}
      <motion.div
        className="absolute rounded-full"
        style={{
          top: "28%",
          left: "-16%",
          width: "50vw",
          height: "50vw",
          maxWidth: 700,
          maxHeight: 700,
          background:
            "radial-gradient(circle, rgba(63,216,207,0.16) 0%, rgba(63,216,207,0.06) 45%, transparent 70%)",
          filter: "blur(60px)",
        }}
        {...drift(36, -20, 32)}
      />

      {/* Soft rose — bottom right */}
      <motion.div
        className="absolute rounded-full"
        style={{
          bottom: "-18%",
          right: "8%",
          width: "44vw",
          height: "44vw",
          maxWidth: 620,
          maxHeight: 620,
          background:
            "radial-gradient(circle, rgba(255,138,127,0.12) 0%, rgba(255,138,127,0.05) 45%, transparent 70%)",
          filter: "blur(60px)",
        }}
        {...drift(-24, -28, 38)}
      />

      {/* Cream wash — keeps the page center warm and bright */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 60% at 50% 35%, rgba(255,251,242,0.85) 0%, transparent 100%)",
        }}
      />

      {/* ── Slow rotating rings — delicate structure, top-right ─────────────── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 760,
          height: 760,
          top: "-24%",
          right: "-14%",
          border: "1px solid rgba(201,158,78,0.16)",
        }}
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 150, repeat: Infinity, ease: "linear" }
        }
      >
        {/* Orbiting bead gives the ring's rotation a visible anchor */}
        <span
          className="absolute w-2 h-2 rounded-full"
          style={{
            top: "50%",
            left: -4,
            background: "rgba(201,158,78,0.45)",
            boxShadow: "0 0 12px rgba(201,158,78,0.35)",
          }}
        />
      </motion.div>

      <motion.div
        className="absolute rounded-full"
        style={{
          width: 480,
          height: 480,
          top: "-10%",
          right: "-5%",
          border: "1px dashed rgba(23,191,186,0.20)",
        }}
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 110, repeat: Infinity, ease: "linear" }
        }
      />

      {/* Counterweight ring — bottom left */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 300,
          height: 300,
          bottom: "-8%",
          left: "-5%",
          border: "1px solid rgba(23,191,186,0.18)",
        }}
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 130, repeat: Infinity, ease: "linear" }
        }
      />

      {/* ── Fine grain so the white never feels sterile ──────────────────── */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.022, mixBlendMode: "multiply" }}
        aria-hidden="true"
      >
        <defs>
          <filter id="bg-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.7"
              numOctaves="3"
              seed="7"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#bg-grain)" />
      </svg>
    </div>
  );
}

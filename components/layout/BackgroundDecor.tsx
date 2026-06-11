"use client";

import { motion, useReducedMotion } from "framer-motion";

export function BackgroundDecor() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#F9F8F5]"
      style={{
        backgroundImage: [
          "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
        ].join(", "),
        backgroundSize: "32px 32px",
      }}
    >
      {/* ── LAYER 0: Stone grain texture — bedrock foundation ──────────────── */}
      {/*   feTurbulence fractalNoise renders architectural stone/linen grain.   */}
      {/*   mix-blend-mode:multiply multiplies into the warm bg without washing  */}
      {/*   out the color; opacity ~0.032 makes it tactile but subliminal.       */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.032, mixBlendMode: "multiply" }}
        aria-hidden="true"
      >
        <defs>
          <filter id="bg-grain" x="0%" y="0%" width="100%" height="100%"
            colorInterpolationFilters="linearRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.68 0.72"
              numOctaves="4"
              seed="12"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
            <feComponentTransfer in="gray">
              <feFuncA type="linear" slope="1" />
            </feComponentTransfer>
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#bg-grain)" />
      </svg>

      {/* ── LAYER 1: Atmosphere — large ambient corner glows ───────────────── */}
      {/* Brass warmth — top-right */}
      <div
        className="absolute"
        style={{
          top: "-20%",
          right: "-10%",
          width: "70vw",
          height: "70vw",
          maxWidth: 900,
          maxHeight: 900,
          background:
            "radial-gradient(circle, rgba(201,169,97,0.22) 0%, rgba(201,169,97,0.08) 40%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
        }}
      />

      {/* Emerald whisper — bottom-left */}
      <div
        className="absolute"
        style={{
          bottom: "-15%",
          left: "-10%",
          width: "55vw",
          height: "55vw",
          maxWidth: 700,
          maxHeight: 700,
          background:
            "radial-gradient(circle, rgba(42,107,84,0.14) 0%, rgba(42,107,84,0.05) 45%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(50px)",
        }}
      />

      {/* Cream center warmth — subtle mid-page brightening */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(245,241,232,0.60) 0%, transparent 100%)",
        }}
      />

      {/* ── LAYER 1b: CAD alignment marks — perimeter annotations ────────────
           Crosshairs and monospaced field labels at the canvas edges.
           Space Mono, rgba(0,0,0,0.10) — visible only on close inspection.   */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ color: "rgba(0,0,0,0.10)" }}
        aria-hidden="true"
      >
        {/* Shared style — Space Mono 7px, fill from currentColor */}
        <defs>
          <style>{`
            .cad-text {
              font-family: var(--font-space-mono, "Space Mono", monospace);
              font-size: 7px;
              fill: rgba(0,0,0,0.10);
              letter-spacing: 0.08em;
            }
          `}</style>
        </defs>

        {/* ── Top-left registration mark ─────────────────────────────────── */}
        {/* Crosshair */}
        <line x1="28" y1="20" x2="28" y2="36" stroke="rgba(0,0,0,0.10)" strokeWidth="0.75" />
        <line x1="20" y1="28" x2="36" y2="28" stroke="rgba(0,0,0,0.10)" strokeWidth="0.75" />
        {/* Corner bracket */}
        <path d="M20,38 L20,44 L26,44" fill="none" stroke="rgba(0,0,0,0.10)" strokeWidth="0.75" />
        <text x="40" y="24" className="cad-text">01·A</text>
        <text x="40" y="34" className="cad-text">CAD_REF</text>

        {/* ── Top edge — centre tick ─────────────────────────────────────── */}
        <line x1="50%" y1="12" x2="50%" y2="22" stroke="rgba(0,0,0,0.10)" strokeWidth="0.75" />
        <text x="50%" y="10" className="cad-text" textAnchor="middle">AXIS·N</text>

        {/* ── Top-right label (clear of the rings cluster) ──────────────── */}
        <text x="calc(100% - 90px)" y="24" className="cad-text">NE·03</text>
        <text x="calc(100% - 90px)" y="34" className="cad-text">BEARING 045°</text>

        {/* ── Mid-left tick ──────────────────────────────────────────────── */}
        <line x1="12" y1="50%" x2="22" y2="50%" stroke="rgba(0,0,0,0.10)" strokeWidth="0.75" />
        <text
          x="26"
          y="50%"
          className="cad-text"
          dominantBaseline="middle"
        >B·02</text>

        {/* ── Bottom-left registration + scale ──────────────────────────── */}
        <line x1="28" y1="calc(100% - 20px)" x2="28" y2="calc(100% - 36px)" stroke="rgba(0,0,0,0.10)" strokeWidth="0.75" />
        <line x1="20" y1="calc(100% - 28px)" x2="36" y2="calc(100% - 28px)" stroke="rgba(0,0,0,0.10)" strokeWidth="0.75" />
        <text x="40" y="calc(100% - 32px)" className="cad-text">SW·04</text>
        <text x="40" y="calc(100% - 22px)" className="cad-text">SCALE 1:25</text>

        {/* ── Bottom edge ruler ticks ────────────────────────────────────── */}
        <line x1="50%" y1="calc(100% - 12px)" x2="50%" y2="calc(100% - 22px)" stroke="rgba(0,0,0,0.10)" strokeWidth="0.75" />
        <line x1="calc(50% - 32px)" y1="calc(100% - 14px)" x2="calc(50% - 32px)" y2="calc(100% - 20px)" stroke="rgba(0,0,0,0.10)" strokeWidth="0.75" />
        <line x1="calc(50% + 32px)" y1="calc(100% - 14px)" x2="calc(50% + 32px)" y2="calc(100% - 20px)" stroke="rgba(0,0,0,0.10)" strokeWidth="0.75" />
        <text x="50%" y="calc(100% - 8px)" className="cad-text" textAnchor="middle">AXIS·S</text>

        {/* ── Bottom-right label ─────────────────────────────────────────── */}
        <text x="calc(100% - 90px)" y="calc(100% - 22px)" className="cad-text">PROJ·RES·MGMT</text>
        <text x="calc(100% - 90px)" y="calc(100% - 12px)" className="cad-text">REV·A1  2026</text>
      </svg>

      {/* ── LAYER 2: Concentric architectural rings — top-right corner ─────── */}

      {/* Outer ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 900,
          height: 900,
          top: "-28%",
          right: "-18%",
          border: "1px solid rgba(201,169,97,0.22)",
          boxShadow: "0 0 0 1px rgba(201,169,97,0.06)",
        }}
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 160, repeat: Infinity, ease: "linear" }
        }
      />

      {/* Middle ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 640,
          height: 640,
          top: "-16%",
          right: "-10%",
          border: "1.5px solid rgba(201,169,97,0.32)",
          boxShadow: "0 0 0 1px rgba(201,169,97,0.08)",
        }}
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 120, repeat: Infinity, ease: "linear" }
        }
      />

      {/* Inner ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          top: "-5%",
          right: "-4%",
          border: "2px solid rgba(201,169,97,0.45)",
          boxShadow:
            "0 0 24px rgba(201,169,97,0.12), inset 0 0 24px rgba(201,169,97,0.06)",
        }}
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 80, repeat: Infinity, ease: "linear" }
        }
      />

      {/* Innermost accent ring — tight, sharpest */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 220,
          height: 220,
          top: "4%",
          right: "1%",
          border: "1.5px solid rgba(201,169,97,0.55)",
          boxShadow: "0 0 16px rgba(201,169,97,0.18)",
        }}
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 50, repeat: Infinity, ease: "linear" }
        }
      />

      {/* Counterweight — emerald echo rings, bottom-left */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 320,
          height: 320,
          bottom: "-8%",
          left: "-6%",
          border: "1.5px solid rgba(42,107,84,0.28)",
          boxShadow: "0 0 20px rgba(42,107,84,0.10)",
        }}
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 140, repeat: Infinity, ease: "linear" }
        }
      />

      <motion.div
        className="absolute rounded-full"
        style={{
          width: 180,
          height: 180,
          bottom: "0%",
          left: "1%",
          border: "1px solid rgba(42,107,84,0.38)",
        }}
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 90, repeat: Infinity, ease: "linear" }
        }
      />
    </div>
  );
}

/**
 * Fixed atmospheric backdrop. Warm emerald + brass aurora pools layered over
 * the cream base, with a faint topographic ring and hairline dot grid.
 * Purely decorative — aria-hidden, pointer-events-none, kept low-contrast.
 */
export function BackgroundDecor() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-surface-base"
    >
      {/* Warm aurora pools — emerald + brass, matching art deco palette */}
      <div
        className="absolute -top-40 -left-32 h-[42rem] w-[42rem] rounded-full blur-3xl opacity-60 animate-[drift_22s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, rgba(42,107,84,0.12), transparent 68%)" }}
      />
      <div
        className="absolute top-1/4 -right-40 h-[46rem] w-[46rem] rounded-full blur-3xl opacity-50 animate-[drift_28s_ease-in-out_infinite_reverse]"
        style={{ background: "radial-gradient(circle, rgba(201,169,97,0.10), transparent 68%)" }}
      />
      <div
        className="absolute -bottom-48 left-1/3 h-[38rem] w-[38rem] rounded-full blur-3xl opacity-40 animate-[drift_26s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, rgba(61,139,106,0.08), transparent 68%)" }}
      />

      {/* Topographic contour rings — warm ink tones */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-radial-gradient(circle at 82% 12%, rgba(42,107,84,0.04) 0 1px, transparent 1px 64px), repeating-radial-gradient(circle at 8% 88%, rgba(201,169,97,0.04) 0 1px, transparent 1px 72px)",
        }}
      />

      {/* Hairline dot grid */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: "radial-gradient(rgba(26,24,20,0.05) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Soft top sheen */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/30 to-transparent" />
    </div>
  );
}

/**
 * Fixed, decorative canvas that sits behind all content so empty space reads as
 * intentional, atmospheric depth rather than a flat void. On-brand aqua/sea
 * aurora blobs + faint topographic contour rings + a hairline dot grid.
 * Purely decorative — aria-hidden, pointer-events-none, kept low-contrast so
 * foreground text stays readable.
 */
export function BackgroundDecor() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-surface-base"
    >
      {/* Aurora light pools */}
      <div
        className="absolute -top-40 -left-32 h-[42rem] w-[42rem] rounded-full blur-3xl opacity-70 animate-[drift_22s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, rgba(25,199,194,0.20), transparent 68%)" }}
      />
      <div
        className="absolute top-1/4 -right-40 h-[46rem] w-[46rem] rounded-full blur-3xl opacity-60 animate-[drift_28s_ease-in-out_infinite_reverse]"
        style={{ background: "radial-gradient(circle, rgba(14,107,134,0.18), transparent 68%)" }}
      />
      <div
        className="absolute -bottom-48 left-1/3 h-[38rem] w-[38rem] rounded-full blur-3xl opacity-50 animate-[drift_26s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, rgba(255,107,94,0.10), transparent 68%)" }}
      />

      {/* Topographic contour rings */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-radial-gradient(circle at 82% 12%, rgba(14,107,134,0.05) 0 1px, transparent 1px 64px), repeating-radial-gradient(circle at 8% 88%, rgba(14,107,134,0.04) 0 1px, transparent 1px 72px)",
        }}
      />

      {/* Hairline dot grid */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: "radial-gradient(rgba(14,107,134,0.06) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Soft top sheen so the top bar blends into the canvas */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/40 to-transparent" />
    </div>
  );
}

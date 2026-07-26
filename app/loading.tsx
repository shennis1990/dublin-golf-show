export default function Loading() {
  return (
    <div
      className="flex min-h-[100svh] items-center justify-center bg-background"
      role="status"
      aria-live="polite"
      aria-label="Loading Dublin Golf Show"
    >
      <div className="flex flex-col items-center gap-4">
        <span className="font-display text-sm font-semibold uppercase tracking-[0.28em] text-white/70">
          Dublin Golf Show <span className="text-accent">2027</span>
        </span>
        <span className="h-px w-24 origin-center animate-pulse bg-gradient-to-r from-transparent via-accent to-transparent" />
      </div>
    </div>
  );
}

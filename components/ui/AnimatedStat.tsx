"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedStatProps = {
  value: string;
  label: string;
  unit?: string;
  className?: string;
};

function parseTarget(value: string) {
  const match = value.match(/^([\d,.]+)(.*)$/);
  if (!match) return { target: 0, suffix: value, decimals: 0 };
  const numeric = match[1].replace(/,/g, "");
  const decimals = numeric.includes(".") ? numeric.split(".")[1].length : 0;
  return {
    target: Number(numeric),
    suffix: match[2] ?? "",
    decimals,
  };
}

export function AnimatedStat({
  value,
  label,
  unit,
  className = "",
}: AnimatedStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(value.startsWith("0") ? value : "0");
  const { target, suffix, decimals } = parseTarget(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    let started = false;

    const animate = () => {
      if (started) return;
      started = true;
      const duration = 1600;
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        const formatted =
          decimals > 0
            ? current.toFixed(decimals)
            : Math.round(current).toLocaleString("en-GB");
        setDisplay(`${formatted}${suffix}`);
        if (progress < 1) frame = requestAnimationFrame(tick);
        else setDisplay(value);
      };

      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
          observer.unobserve(node);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [decimals, suffix, target, value]);

  return (
    <div ref={ref} className={`min-w-0 text-left ${className}`}>
      <p className="font-display text-5xl font-bold leading-none tracking-tight text-white sm:text-6xl lg:text-7xl">
        <span className="tabular-nums">{display}</span>
        {unit ? (
          <span className="ml-2 align-baseline text-[0.32em] font-semibold uppercase tracking-[0.1em] text-white/55">
            {unit}
          </span>
        ) : null}
      </p>
      <p className="mt-4 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
        {label}
      </p>
    </div>
  );
}

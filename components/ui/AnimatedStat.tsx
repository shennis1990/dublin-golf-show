"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedStatProps = {
  value: string;
  label: string;
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

export function AnimatedStat({ value, label, className = "" }: AnimatedStatProps) {
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
    <div ref={ref} className={className}>
      <p className="font-display text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
        {display}
      </p>
      <p className="mt-2 text-xs font-medium uppercase tracking-[0.24em] text-muted">
        {label}
      </p>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SLIDE_MS = 4000;

const slides = [
  {
    src: "/images/hall-3.png",
    alt: "Visitors trying clubs and gear across the exhibition floor",
    caption: "Try the latest kit",
  },
  {
    src: "/images/hall-1.png",
    alt: "Crowd gathered for a main stage interview at Dublin Golf Show",
    caption: "Hear the voices of the game",
  },
  {
    src: "/images/hall-floor.png",
    alt: "Guests arriving into the branded Dublin Golf Show hall",
    caption: "Feel the atmosphere",
  },
] as const;

export function OverviewCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [index, paused, reducedMotion]);

  return (
    <div
      className="group relative aspect-[4/5] overflow-hidden rounded-[1.5rem] md:aspect-[5/4] lg:aspect-[4/5] xl:aspect-[5/6]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Dublin Golf Show highlights"
    >
      {/* Instagram-style progress */}
      <div className="absolute inset-x-0 top-0 z-20 flex gap-1.5 px-4 pt-4 md:px-5 md:pt-5">
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className="h-[2.5px] flex-1 overflow-hidden rounded-full bg-white/25"
            aria-hidden
          >
            <div
              key={`${index}-${i}`}
              className={`h-full rounded-full bg-white ${
                i < index
                  ? "w-full"
                  : i > index
                    ? "w-0"
                    : reducedMotion
                      ? "w-full"
                      : "story-progress"
              }`}
              style={
                i === index && !reducedMotion
                  ? {
                      animationDuration: `${SLIDE_MS}ms`,
                      animationPlayState: paused ? "paused" : "running",
                    }
                  : undefined
              }
            />
          </div>
        ))}
      </div>

      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            loading={i === 0 ? "eager" : "lazy"}
            sizes="(max-width: 1024px) 100vw, 55vw"
            className={`object-cover transition-transform duration-[1.6s] ease-out ${
              i === index ? "scale-100" : "scale-105"
            }`}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-[#0A111C]/80 via-[#0A111C]/15 to-[#0A111C]/25" />

      <div className="absolute bottom-0 left-0 right-0 z-10 p-8 md:p-10">
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
          19–20 June 2027
        </p>
        <p className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
          RDS Simmonscourt, Dublin
        </p>
        <p
          key={slides[index].caption}
          className="mt-3 font-display text-sm font-medium uppercase tracking-[0.12em] text-white/70 transition-opacity duration-500"
        >
          {slides[index].caption}
        </p>
      </div>

      {/* Accessible slide controls for keyboard / reduced motion */}
      <div className="sr-only">
        <button
          type="button"
          onClick={() => setIndex((current) => (current - 1 + slides.length) % slides.length)}
        >
          Previous highlight
        </button>
        <button
          type="button"
          onClick={() => setIndex((current) => (current + 1) % slides.length)}
        >
          Next highlight
        </button>
      </div>
    </div>
  );
}

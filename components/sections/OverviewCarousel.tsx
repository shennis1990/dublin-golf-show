"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SLIDE_MS = 4000;

const slides = [
  {
    src: "/images/stories/try.jpg",
    alt: "A visitor trying a golf club with an expert on the show floor",
    emotion: "Try",
    caption: "Hands on with the latest kit",
  },
  {
    src: "/images/stories/watch.jpg",
    alt: "A short-game masterclass with a professional demonstrating to an engaged crowd",
    emotion: "Watch",
    caption: "Learn from the voices of the game",
  },
  {
    src: "/images/stories/discover.jpg",
    alt: "Visitors exploring premium golf equipment and stands",
    emotion: "Discover",
    caption: "Explore brands, products and experiences",
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
      className="media-frame group relative aspect-[4/5] md:aspect-[5/4] lg:aspect-[4/5] xl:aspect-[5/6]"
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
            className={`object-cover object-center transition-transform duration-[1.6s] ease-out ${
              i === index ? "scale-100" : "scale-105"
            }`}
          />
        </div>
      ))}

      {/* Shared cinematic grade across all slides */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,17,28,0.28)_0%,transparent_28%,transparent_55%,rgba(10,17,28,0.82)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,17,28,0.22)_100%)]" />

      <div className="absolute bottom-0 left-0 right-0 z-10 p-8 md:p-12">
        <p
          key={slides[index].emotion}
          className="font-display text-[14px] font-semibold uppercase tracking-[0.16em] text-accent"
        >
          {slides[index].emotion}
        </p>
        <p className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
          RDS Simmonscourt, Dublin
        </p>
        <p
          key={slides[index].caption}
          className="mt-3 font-display text-[14px] font-medium uppercase tracking-[0.12em] text-white/70 transition-opacity duration-500"
        >
          {slides[index].caption}
        </p>
      </div>

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

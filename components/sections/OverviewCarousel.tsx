"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SLIDE_MS = 4000;

const slides = [
  {
    src: "/images/stories/try.jpg",
    alt: "A golfer in follow-through on a premium indoor simulator with launch monitor data at Dublin Golf Show",
    eyebrow: "19–20 June 2027",
    title: "Play the latest simulators",
    caption:
      "Compare the newest launch monitors, simulators and game-improvement technology.",
    // Keep golfer, simulator screen, ball flight and Track/Analyze kiosk in frame
    objectPosition: "50% 48%",
    quality: 95,
    priority: true,
  },
  {
    src: "/images/stories/watch.jpg",
    alt: "Two speakers in conversation on the Dublin Golf Show main stage before a seated audience",
    eyebrow: "19–20 June 2027",
    title: "Hear the biggest voices in golf",
    caption: "In conversation at RDS Simmonscourt",
    // Keep speakers + LED branding clear; audience fills the lower frame
    objectPosition: "50% 40%",
    quality: 95,
    priority: false,
  },
  {
    src: "/images/stories/discover.jpg",
    alt: "A couple exploring the Dublin Golf Show exhibition floor among equipment, apparel and experiences",
    eyebrow: "19–20 June 2027",
    title: "Discover the future of golf",
    caption: "Explore equipment, travel, coaching, technology and experiences.",
    // Keep the couple central while retaining aisle depth and surrounding stands
    objectPosition: "50% 42%",
    quality: 95,
    priority: false,
  },
  {
    src: "/images/stories/connect.jpg",
    alt: "Three guests sharing coffee and conversation at The Fairway Club lounge during Dublin Golf Show",
    eyebrow: "19–20 June 2027",
    title: "The Fairway Club",
    caption: "Coffee. Conversations. Connections.",
    // Keep the standing trio and Fairway Club signage in frame
    objectPosition: "50% 45%",
    quality: 95,
    priority: false,
  },
] as const;

export function OverviewCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const active = slides[index];

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
            priority={slide.priority}
            loading={slide.priority ? undefined : "lazy"}
            quality={slide.quality}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 55vw"
            className={`object-cover transition-transform duration-[1.6s] ease-out ${
              i === index ? "scale-100" : "scale-105"
            }`}
            style={{ objectPosition: slide.objectPosition }}
          />
        </div>
      ))}

      {/* Shared cinematic grade across all slides */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,17,28,0.28)_0%,transparent_28%,transparent_55%,rgba(10,17,28,0.82)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,17,28,0.22)_100%)]" />

      <div className="absolute bottom-0 left-0 right-0 z-10 p-8 md:p-12">
        <p
          key={`${active.src}-eyebrow`}
          className="font-display text-[14px] font-semibold uppercase tracking-[0.16em] text-accent"
        >
          {active.eyebrow}
        </p>
        <p
          key={`${active.src}-title`}
          className="mt-2 max-w-md font-display text-2xl font-bold uppercase leading-[0.95] tracking-tight text-white md:text-3xl"
        >
          {active.title}
        </p>
        <p
          key={`${active.src}-caption`}
          className="mt-3 font-display text-[14px] font-medium uppercase tracking-[0.12em] text-white/70 transition-opacity duration-500"
        >
          {active.caption}
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

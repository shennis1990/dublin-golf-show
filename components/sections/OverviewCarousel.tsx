"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SLIDE_MS = 4000;

/** Hero stories: range, pavilions, equipment, technology, main stage, discover, Fairway Club. */
const slides = [
  {
    src: "/images/stories/range.jpg",
    alt: "A short-game masterclass around a bunker with a crowd watching at the Dublin Golf Show",
    eyebrow: "19–20 June 2027",
    title: "Step onto the range.",
    caption: "Drive it. Chip it. Test it.",
    objectPosition: "50% 28%",
    quality: 95,
    priority: true,
  },
  {
    src: "/images/stories/pavilions.jpg",
    alt: "Visitors exploring the Irish Golf Pavilion and World of Golf Pavilion on the Dublin Golf Show floor",
    eyebrow: "19–20 June 2027",
    title: "Ireland & World Golf Pavilions",
    caption: "From Ireland to the world.",
    objectPosition: "50% 22%",
    quality: 95,
    priority: false,
  },
  {
    src: "/images/stories/try-v2.jpg",
    alt: "A visitor and expert inspecting a golf iron together beside a row of clubs on the show floor",
    eyebrow: "19–20 June 2027",
    title: "Get hands-on with new equipment",
    caption:
      "Try clubs, explore fittings and discover the latest equipment from leading golf brands.",
    objectPosition: "50% 28%",
    quality: 95,
    priority: false,
  },
  {
    src: "/images/stories/play.jpg",
    alt: "A golfer in follow-through on a premium indoor simulator with launch monitor data at Dublin Golf Show",
    eyebrow: "19–20 June 2027",
    title: "Try the latest technology",
    caption:
      "Compare launch monitors, simulators and the latest technology designed to help you play better.",
    objectPosition: "50% 48%",
    quality: 95,
    priority: false,
  },
  {
    src: "/images/stories/watch.jpg",
    alt: "Two speakers in conversation on the Dublin Golf Show main stage before a seated audience",
    eyebrow: "19–20 June 2027",
    title: "Live from the main stage",
    caption:
      "Conversations, demonstrations and insights from across the world of golf.",
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
    objectPosition: "50% 45%",
    quality: 95,
    priority: false,
  },
] as const;

type OverviewCarouselProps = {
  className?: string;
  sizes?: string;
};

export function OverviewCarousel({
  className = "aspect-[4/5]",
  sizes = "(max-width: 768px) 100vw, (max-width: 1024px) 55vw, 28vw",
}: OverviewCarouselProps) {
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
      className={`media-frame group relative w-full overflow-hidden ${className}`}
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
            sizes={sizes}
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

      <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-8 xl:p-10">
        <p
          key={`${active.src}-eyebrow`}
          className="font-display text-[14px] font-semibold uppercase tracking-[0.16em] text-accent"
        >
          {active.eyebrow}
        </p>
        <p
          key={`${active.src}-title`}
          className="mt-2 max-w-md font-display text-xl font-bold uppercase leading-[0.95] tracking-tight text-white md:text-2xl xl:text-[1.75rem]"
        >
          {active.title}
        </p>
        <p
          key={`${active.src}-caption`}
          className="mt-3 font-display text-[13px] font-medium uppercase tracking-[0.12em] text-white/70 transition-opacity duration-500 md:text-[14px]"
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

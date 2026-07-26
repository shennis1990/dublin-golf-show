"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Contour } from "@/components/ui/Contour";
import { Container } from "@/components/ui/Container";
import { RegisterInterestButton } from "@/components/interest/RegisterInterestButton";

export function Hero() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const onScroll = () => {
      const y = window.scrollY;
      if (y > window.innerHeight) return;
      layer.style.transform = `translate3d(0, ${y * 0.28}px, 0) scale(1.08)`;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="top" className="relative flex min-h-[100svh] items-end overflow-hidden pb-24 pt-32 md:items-center md:pb-0 md:pt-20">
      <div ref={layerRef} className="absolute inset-0 scale-105 will-change-transform">
        <Image
          src="/images/hero-hall.png"
          alt="Cinematic view of the Dublin Golf Show exhibition hall at RDS Simmonscourt"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,17,28,0.55)_0%,rgba(10,17,28,0.72)_45%,rgba(10,17,28,0.92)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,17,28,0.55)_100%)]" />
      <div className="contour-drift absolute inset-0" aria-hidden>
        <Contour opacity={0.22} />
      </div>

      <Container className="relative z-10 w-full">
        <div className="max-w-4xl">
          <p className="mb-5 font-display text-sm font-medium uppercase tracking-[0.42em] text-white/70 md:text-base">
            Dublin Golf Show <span className="text-accent">2027</span>
          </p>

          <h1 className="font-display text-5xl font-semibold uppercase leading-[0.9] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[5.75rem]">
            Ireland&apos;s Festival of Golf
          </h1>

          <div className="mt-6 h-px w-28 bg-gradient-to-r from-accent via-white/70 to-transparent" />

          <p className="mt-7 max-w-xl text-base font-light leading-relaxed text-white/70 md:text-lg">
            Ireland&apos;s biggest celebration of golf brings together players, brands,
            destinations and innovators for two unforgettable days at RDS Simmonscourt.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <RegisterInterestButton>Register Interest</RegisterInterestButton>
            <Button href="#partner" variant="ghost">
              Partner With Us
            </Button>
          </div>
        </div>
      </Container>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-white/50 transition-colors hover:text-white"
        aria-label="Scroll to about"
      >
        <span className="text-[10px] uppercase tracking-[0.32em]">Scroll</span>
        <span className="flex h-10 w-px items-start justify-center overflow-hidden bg-white/20">
          <span className="scroll-dot block h-2 w-px bg-white" />
        </span>
      </a>
    </section>
  );
}

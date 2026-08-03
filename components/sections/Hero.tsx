"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { RegisterInterestButton } from "@/components/interest/RegisterInterestButton";
import { PartnerWithUsButton } from "@/components/partner/PartnerWithUsButton";

export function Hero() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const onScroll = () => {
      const y = window.scrollY;
      if (y > window.innerHeight) return;
      // Light parallax — keep scale modest so the cube and portal stay in frame
      layer.style.transform = `translate3d(0, ${y * 0.22}px, 0) scale(1.03)`;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-[80svh] items-end overflow-hidden pb-14 pt-28 md:min-h-[80svh] md:items-center md:pb-16 md:pt-28"
    >
      <div ref={layerRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/hero-hall.jpg"
          alt="Visitors approaching the monumental Dublin Golf Show 2027 entrance into the exhibition"
          fill
          priority
          fetchPriority="high"
          quality={95}
          sizes="100vw"
          // Frame cube (top-right), portal and crowd without heavy lateral crop
          className="object-cover object-[58%_32%] md:object-[56%_30%] lg:object-[54%_28%]"
        />
      </div>

      {/* Rely on the image’s built-in left fade; only a light bottom ease into Event Overview */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_72%,rgba(10,17,28,0.45)_100%)]" />

      <Container className="relative z-10 w-full md:-translate-y-3 lg:-translate-y-4">
        <div className="flex max-w-xl flex-col items-start md:max-w-3xl lg:max-w-[52rem]">
          <h1 className="font-display text-[2.85rem] font-bold uppercase leading-[0.9] tracking-tight text-white sm:text-[3.5rem] md:whitespace-nowrap md:text-[4.4rem] lg:text-[5.35rem]">
            Dublin Golf Show{" "}
            <span className="text-accent">2027</span>
          </h1>

          <p className="mt-3 font-display text-[1.3rem] font-normal uppercase leading-[1.05] tracking-tight text-white/85 sm:mt-4 sm:text-[1.55rem] md:text-[1.85rem] lg:text-[2.25rem]">
            Ireland&apos;s Festival of Golf
          </p>

          <div className="mt-5 h-px w-28 bg-gradient-to-r from-accent via-accent/70 to-transparent md:mt-6" />

          <p className="body-copy prose-width mt-5 text-white/75 md:mt-6">
            Ireland&apos;s biggest celebration of golf brings together players, brands,
            destinations and innovators for two unforgettable days at RDS Simmonscourt.
          </p>

          <div className="cta-row mt-7 md:mt-8">
            <RegisterInterestButton>Get Ticket Updates</RegisterInterestButton>
            <PartnerWithUsButton>Exhibit at The Dublin Golf Show</PartnerWithUsButton>
          </div>
        </div>
      </Container>

      <a
        href="#about"
        className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-white/45 transition-colors hover:text-white md:bottom-6"
        aria-label="Scroll to about"
      >
        <span className="flex h-8 w-px items-start justify-center overflow-hidden bg-white/20">
          <span className="scroll-dot block h-2 w-px bg-accent" />
        </span>
      </a>
    </section>
  );
}

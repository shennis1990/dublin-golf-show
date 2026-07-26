import Image from "next/image";
import { AnimatedStat } from "@/components/ui/AnimatedStat";
import { Contour } from "@/components/ui/Contour";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const zones = [
  "Driving Range",
  "Main Stage",
  "Equipment",
  "Travel",
  "Fashion",
  "Short Game",
];

export function Overview() {
  return (
    <section id="about" className="relative overflow-hidden py-28 md:py-40">
      <div className="absolute inset-0" aria-hidden>
        <Contour className="contour-drift" opacity={0.14} />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-accent">
                Event Overview
              </p>
              <h2 className="mt-5 font-display text-4xl font-semibold uppercase leading-[0.95] tracking-tight text-white md:text-5xl lg:text-6xl">
                A two-day indoor golf experience, built for scale.
              </h2>
            </Reveal>

            <Reveal delay={1}>
              <p className="mt-8 text-base font-light leading-[1.85] text-muted md:text-lg">
                The Dublin Golf Show takes over RDS Simmonscourt for two days — a complete golf
                ecosystem designed for participation, not just browsing. For attendees, sponsors,
                exhibitors and media, it is Ireland&apos;s largest gathering around a shared passion
                for the game.
              </p>
              <p className="mt-5 text-base font-light leading-[1.85] text-muted md:text-lg">
                Discover new equipment. Book a golf holiday. Improve your game. Meet the
                personalities shaping the sport. Every visitor arrives ready to engage.
              </p>
            </Reveal>

            <Reveal delay={2} className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6">
              <AnimatedStat value="25,000+" label="Attendees" />
              <AnimatedStat value="100+" label="Exhibitors" />
              <AnimatedStat value="100,000" label="Sq Ft Arena" />
            </Reveal>

            <Reveal delay={3} className="mt-14">
              <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-8">
                {zones.map((zone) => (
                  <span
                    key={zone}
                    className="font-display text-sm font-medium uppercase tracking-[0.18em] text-white/55 transition-colors duration-300 hover:text-accent"
                  >
                    {zone}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={1} className="lg:col-span-7">
            <div className="group relative aspect-[4/5] overflow-hidden rounded-[1.5rem] md:aspect-[5/4] lg:aspect-[4/5] xl:aspect-[5/6]">
              <Image
                src="/images/hall-1.png"
                alt="Audience gathered for a main stage interview at Dublin Golf Show"
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A111C]/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-accent">
                  19–20 June 2027
                </p>
                <p className="mt-2 font-display text-2xl font-semibold uppercase tracking-wide text-white md:text-3xl">
                  RDS Simmonscourt, Dublin
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

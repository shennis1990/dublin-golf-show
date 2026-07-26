import { AnimatedStat } from "@/components/ui/AnimatedStat";
import { Contour } from "@/components/ui/Contour";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { OverviewCarousel } from "@/components/sections/OverviewCarousel";

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
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                Event Overview
              </p>
              <h2 className="mt-5 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white md:text-5xl lg:text-6xl">
                Two days closer to the game you love.
              </h2>
            </Reveal>

            <Reveal delay={1}>
              <p className="mt-8 text-base font-light leading-[1.85] text-muted md:text-lg">
                Walk into RDS Simmonscourt and you&apos;re in the middle of it — clubs to try,
                places to go, coaches to learn from, and a weekend crowd that feels like your
                favourite golfing friends, gathered in one place.
              </p>
              <p className="mt-5 text-base font-light leading-[1.85] text-muted md:text-lg">
                Come to hit balls. Come to discover something new. Come to hear the names you
                follow. Or simply come to spend two days immersed in Ireland&apos;s festival of
                golf.
              </p>
            </Reveal>

            <Reveal
              delay={2}
              className="mt-16 grid grid-cols-1 gap-10 border-y border-line py-10 sm:grid-cols-3 sm:gap-8 sm:py-12"
            >
              <AnimatedStat value="25,000+" label="Visitors" />
              <AnimatedStat value="100+" label="Brands" />
              <AnimatedStat value="100,000" unit="sq ft" label="Experience" />
            </Reveal>

            <Reveal delay={3} className="mt-12">
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {zones.map((zone) => (
                  <span
                    key={zone}
                    className="font-display text-sm font-semibold uppercase tracking-[0.1em] text-white/55 transition-colors duration-300 hover:text-accent"
                  >
                    {zone}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={1} className="lg:col-span-7">
            <OverviewCarousel />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

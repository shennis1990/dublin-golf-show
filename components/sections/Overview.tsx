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
    <section id="about" className="section-y relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        <Contour className="contour-drift" opacity={0.14} />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-20">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow">Event Overview</p>
              <h2 className="heading-section mt-4 md:mt-5">
                Two days closer to the game you love.
              </h2>
            </Reveal>

            <Reveal delay={1} className="mt-7 space-y-5 md:mt-8">
              <p className="body-copy prose-width">
                Walk into RDS Simmonscourt and you&apos;re in the middle of it — clubs to try,
                places to go, coaches to learn from, and a weekend crowd that feels like your
                favourite golfing friends, gathered in one place.
              </p>
              <p className="body-copy prose-width">
                Come to hit balls. Come to discover something new. Come to hear the names you
                follow. Or simply come to spend two days immersed in Ireland&apos;s festival of
                golf.
              </p>
            </Reveal>
          </div>

          <Reveal delay={1} className="lg:col-span-7">
            <OverviewCarousel />
          </Reveal>
        </div>

        <Reveal
          delay={2}
          className="mt-16 grid grid-cols-1 gap-10 border-y border-line py-12 sm:grid-cols-3 sm:gap-8 md:mt-20 md:gap-12 md:py-14"
        >
          <AnimatedStat value="25,000+" label="Visitors" />
          <AnimatedStat value="100+" label="Brands" />
          <AnimatedStat value="100,000" unit="sq ft" label="Experience" />
        </Reveal>

        <Reveal delay={3} className="mt-12 md:mt-14">
          <div className="flex flex-wrap gap-x-7 gap-y-3">
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
      </Container>
    </section>
  );
}

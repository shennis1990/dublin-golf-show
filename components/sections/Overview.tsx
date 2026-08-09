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
    <section
      id="about"
      className="relative overflow-hidden pb-16 pt-8 md:pb-20 md:pt-10 lg:pb-24 lg:pt-12"
    >
      <div className="absolute inset-0" aria-hidden>
        <Contour pattern="green" opacity={0.05} />
      </div>

      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-14 xl:gap-16">
          {/* Left — editorial copy */}
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">Event Overview</p>
              <h2 className="heading-section mt-3 max-w-2xl md:mt-4">
                Two days. Closer to the game you love.
              </h2>
            </Reveal>

            <Reveal delay={1} className="mt-6 max-w-2xl space-y-4 md:mt-7 md:space-y-5">
              <p className="body-copy">
                Walk into RDS Simmonscourt and you&apos;re in the middle of it — clubs to try,
                places to go, coaches to learn from, and a weekend crowd that feels like your
                favourite golfing friends, gathered in one place.
              </p>
              <p className="body-copy">
                Come to hit balls. Come to discover something new. Come to hear the names you
                follow. Or simply come to spend two days immersed in Ireland&apos;s festival of
                golf.
              </p>
            </Reveal>
          </div>

          {/* Right — premium stats + experience categories */}
          <Reveal
            delay={1}
            className="border-t border-line pt-8 lg:col-span-5 lg:border-l lg:border-t-0 lg:pt-1 lg:pl-10 xl:pl-12"
          >
            <div className="grid gap-8 sm:grid-cols-3 sm:gap-6 lg:grid-cols-1 lg:gap-8">
              <AnimatedStat value="25,000+" label="Visitors" />
              <AnimatedStat value="100+" label="Brands" />
              <AnimatedStat value="100,000" unit="sq ft" label="Experience" />
            </div>

            <div className="mt-10 border-t border-line pt-7 md:mt-12 md:pt-8">
              <div className="flex flex-wrap gap-x-6 gap-y-2.5 lg:flex-col lg:gap-y-3">
                {zones.map((zone) => (
                  <span
                    key={zone}
                    className="font-display text-[15px] font-semibold uppercase tracking-[0.1em] text-white/55 transition-colors duration-300 hover:text-accent"
                  >
                    {zone}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

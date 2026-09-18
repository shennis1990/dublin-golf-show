import type { Metadata } from "next";
import Link from "next/link";
import { Contour } from "@/components/ui/Contour";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About JKLM Media",
  description:
    "JKLM Media is the event organiser behind Dublin Golf Show, with decades of Irish publishing, media and live-event experience.",
  alternates: {
    canonical: siteConfig.organiser.path,
  },
};

const paragraphs = [
  "JKLM Media has been part of the Irish publishing, media and events landscape for many years, building a reputation for creating engaging content, developing strong commercial partnerships and delivering projects that connect brands with highly targeted audiences. Over the years, the company has been responsible for a diverse portfolio of Irish magazine titles, including Bike Buyers Guide, Farm & Plant, Modified Motors, Player Ireland and Grassmen Magazine. While the media landscape has evolved considerably, so too has JKLM Media. Today, much of our publishing activity is focused online, backed by the same industry relationships, commercial experience and understanding of audiences that have been built over decades.",
  "Events have always formed an important part of that story. JKLM Media and its team have worked alongside some of Ireland and the UK's leading event promoters and production companies on major consumer shows and live events. These have included the Nevo EV Show with Drive Inc, Top Gear Live with Brand Events, the Dublin Motorcycle & Scooter Show with SDL Exhibitions, the Irish Times Motorshow with EventPro, Masters of Dirt with Hotwire Media, Modified Motors with AJS Promotions and Toys 4 Big Boys with Mediateam.",
  "Our involvement has extended far beyond simply promoting these events. From sourcing vehicles and attractions to securing exhibitors and selling trade stands, developing floor plans, working with commercial partners and sponsors, creating content and marketing campaigns, and being on site throughout build up, show days and breakdown, the JKLM Media team understands what it takes to bring a large scale consumer event to life.",
  "That breadth of experience is now being brought together for the Dublin Golf Show. For exhibitors, sponsors and partners, it means working with a team that understands both sides of the equation. We know how to build an event that visitors genuinely want to attend, but equally importantly, we understand that brands need to see value from being there.",
  "Dublin Golf Show is a new event, but the experience behind it is anything but new.",
];

function BackButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-white/[0.03] px-6 py-2.5 font-display text-[14px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-all duration-500 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    >
      Back to Homepage
    </Link>
  );
}

export default function AboutTheEventOrganiserPage() {
  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Contour anchor="top-right" opacity={0.1} />
      </div>

      <header className="relative z-10 border-b border-white/10">
        <nav
          className="mx-auto flex h-20 max-w-7xl items-center px-6 md:h-[5.25rem] md:px-10 lg:px-14"
          aria-label="Organiser page"
        >
          <Link
            href="/"
            className="group relative rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            <span className="font-display text-xl font-bold uppercase leading-none tracking-[0.04em] text-white md:text-[1.35rem]">
              Dublin Golf Show <span className="text-accent">2027</span>
            </span>
            <span className="mt-1.5 block h-px w-full bg-gradient-to-r from-accent via-white/70 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
          </Link>
        </nav>
      </header>

      <main id="main-content" className="relative">
        <Container className="relative pt-16 pb-[var(--section-y)] md:py-[var(--section-y-md)] lg:py-[var(--section-y-lg)]">
          <BackButton className="mb-10 md:mb-12" />

          <p className="eyebrow">The Event Organiser</p>
          <h1 className="heading-section mt-4 max-w-3xl md:mt-5">About JKLM Media</h1>

          <div className="mt-8 max-w-3xl space-y-6 md:mt-10 md:space-y-7">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="body-copy">
                {paragraph}
              </p>
            ))}
          </div>

          <BackButton className="mt-12 md:mt-16" />
        </Container>
      </main>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { Footer } from "@/components/layout/Footer";
import { RegisterIrishOpenForm } from "@/components/interest/RegisterIrishOpenForm";
import { Contour } from "@/components/ui/Contour";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site";

const PAGE_TITLE = "Win two tickets to the 2027 Irish Open | Dublin Golf Show 2027";
const PAGE_DESCRIPTION =
  "Register for Dublin Golf Show 2027 and follow @dublingolfshow on Instagram to enter the competition to win two tickets to the 2027 Irish Open. Limited to the first 1,000 eligible registrations.";

export const metadata: Metadata = {
  title: {
    absolute: PAGE_TITLE,
  },
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: siteConfig.irishOpen.path,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: siteConfig.irishOpen.path,
  },
  twitter: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

const textLinkClass =
  "text-white underline decoration-accent/70 underline-offset-[5px] transition-colors hover:text-accent hover:decoration-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export default function RegisterIrishOpenPage() {
  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Contour anchor="top-right" opacity={0.1} />
      </div>

      <header className="relative z-10 border-b border-white/10">
        <nav
          className="mx-auto flex h-20 max-w-7xl items-center px-6 md:h-[5.25rem] md:px-10 lg:px-14"
          aria-label="Irish Open competition"
        >
          <Link
            href="/"
            aria-label="Dublin Golf Show 2027"
            className="relative rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            <BrandLogo />
          </Link>
        </nav>
      </header>

      <main id="main-content" className="relative">
        <Container className="relative flex flex-col items-center pt-8 pb-[var(--section-y)] md:pt-14 md:pb-[var(--section-y-md)] lg:pt-16 lg:pb-[var(--section-y-lg)]">
          <div className="w-full max-w-xl text-center">
            <p className="eyebrow">Dublin Golf Show 2027</p>
            <h1 className="heading-section mt-4 md:mt-5">
              Win two tickets
              <br />
              to the 2027 Irish Open
            </h1>
            <p className="mt-5 text-base font-light leading-[1.9] text-white/70 md:mt-6">
              Register for Dublin Golf Show 2027 and follow{" "}
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={textLinkClass}
              >
                @dublingolfshow
              </a>{" "}
              on Instagram to enter.
            </p>
            <p className="mt-5 font-display text-[13px] font-semibold uppercase leading-snug tracking-[0.08em] text-accent md:text-[14px] md:tracking-[0.12em]">
              Limited to the first 1,000 eligible registrations
            </p>
          </div>

          <div className="mt-8 w-full max-w-md md:mt-10">
            <RegisterIrishOpenForm />
          </div>

          <p className="mt-8 max-w-md text-center text-[14px] font-light leading-[1.75] text-white/55 md:mt-10">
            <Link href={siteConfig.terms.path} className={textLinkClass}>
              Competition Terms &amp; Conditions &amp; Privacy Notice
            </Link>
          </p>
        </Container>
      </main>

      <Footer />
    </div>
  );
}

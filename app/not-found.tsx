import type { Metadata } from "next";
import Link from "next/link";
import { Contour } from "@/components/ui/Contour";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "This fairway doesn't exist. Head back to the Dublin Golf Show homepage.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100svh] items-center overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Contour variant="corner" anchor="top-right" opacity={0.7} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 py-28 text-center md:px-10">
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
          Out of bounds
        </p>
        <h1 className="mt-5 font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight text-white md:text-7xl">
          This fairway doesn&apos;t exist
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-base font-light leading-relaxed text-muted md:text-lg">
          The page you&apos;re looking for has taken a wrong turn toward the rough.
          Let&apos;s get you back to {siteConfig.name}.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 font-display text-[13px] font-semibold uppercase tracking-[0.12em] text-white transition-all duration-500 hover:-translate-y-0.5 hover:bg-[#00b07c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Back to Homepage
        </Link>
      </div>
    </main>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Contour } from "@/components/ui/Contour";
import { Container } from "@/components/ui/Container";

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "X", href: "https://x.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setDone(true);
    setEmail("");
  }

  return (
    <footer id="contact" className="relative overflow-hidden border-t border-line bg-[#070d16] py-20 md:py-24">
      {/* One emerald topo cluster from a height field — lines never cross */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        <Contour variant="corner" anchor="bottom-right" opacity={0.95} />
      </div>

      <Container className="relative">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-24">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-accent">
              Stay Close
            </p>
            <h2 className="mt-4 max-w-md font-display text-3xl font-semibold uppercase leading-none tracking-tight text-white md:text-4xl">
              Be first to hear
            </h2>

            <form onSubmit={onSubmit} className="mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="h-12 flex-1 rounded-full border border-white/15 bg-white/[0.03] px-5 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              />
              <Button type="submit" className="h-12 shrink-0 !px-7">
                Subscribe
              </Button>
            </form>
            {done ? (
              <p className="mt-3 text-sm text-accent">You&apos;re on the list.</p>
            ) : null}
          </div>

          <div className="flex flex-col justify-between gap-10 sm:flex-row lg:flex-col lg:items-end lg:text-right">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/40">
                Contact
              </p>
              <a
                href="mailto:hello@dublingolfshow.ie"
                className="mt-3 block text-lg font-light text-white transition-colors hover:text-accent"
              >
                hello@dublingolfshow.ie
              </a>
            </div>

            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/40">
                Social
              </p>
              <ul className="mt-3 flex flex-wrap gap-5 sm:justify-end">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.label} (opens in a new tab)`}
                      className="rounded-sm text-sm font-light text-white/60 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-xs font-medium uppercase tracking-[0.22em] text-white/50">
            Dublin Golf Show 2027
          </p>
          <p className="text-xs font-light text-white/35">
            © {new Date().getFullYear()} Dublin Golf Show. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}

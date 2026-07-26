"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#partner", label: "Partner With Us" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
        scrolled || open
          ? "border-b border-white/10 bg-[rgba(10,17,28,0.72)] shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-6 md:h-20 md:px-10 lg:px-14">
        <a href="#top" className="relative z-10 group">
          <span className="font-display text-[15px] font-semibold uppercase leading-none tracking-[0.06em] text-white md:text-lg">
            Dublin Golf Show <span className="text-accent">2027</span>
          </span>
          <span className="mt-1.5 block h-px w-full bg-gradient-to-r from-accent via-white/70 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
          <span className="mt-1.5 block text-[9px] font-medium uppercase tracking-[0.28em] text-white/55 md:text-[10px]">
            Ireland&apos;s Festival of Golf
          </span>
        </a>

        <div className="hidden items-center gap-10 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[12px] font-medium uppercase tracking-[0.22em] text-white/70 transition-colors duration-300 hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <Button href="#register" className="!px-6 !py-2.5 !text-[11px]">
            Register Interest
          </Button>
        </div>

        <button
          type="button"
          className="relative z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white lg:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="flex flex-col gap-1.5">
            <span
              className={`block h-px w-4 bg-white transition-transform duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`block h-px w-4 bg-white transition-opacity duration-300 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-px w-4 bg-white transition-transform duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </nav>

      <div
        className={`border-t border-white/10 bg-[rgba(10,17,28,0.96)] backdrop-blur-2xl lg:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <div className="flex flex-col gap-1 px-6 py-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 font-display text-2xl uppercase tracking-[0.08em] text-white"
            >
              {link.label}
            </a>
          ))}
          <Button href="#register" className="mt-6" onClick={() => setOpen(false)}>
            Register Interest
          </Button>
        </div>
      </div>
    </header>
  );
}

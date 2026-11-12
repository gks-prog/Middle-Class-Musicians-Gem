"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

const SLIDE_DURATION = 8500;

const slides = [
  {
    id: "Lh67UKKh8FU",
    eyebrow: "The sound starts here",
    copy: "A focused room for vocal recording, clean takes, and performances that feel like you.",
    label: "Recording",
  },
  {
    id: "07D7VGtHLOc",
    eyebrow: "Make every detail count",
    copy: "Mixing and mastering shaped around the song—not another one-size-fits-all preset.",
    label: "Mixing & mastering",
  },
  {
    id: "FEgOKqd_7W8",
    eyebrow: "Find your own frequency",
    copy: "Original beats and production built around your voice, references, and point of view.",
    label: "Beat production",
  },
  {
    id: "3kgBkBZhZMQ",
    eyebrow: "From idea to identity",
    copy: "A creative space for independent artists to experiment, refine, and release with intent.",
    label: "Artist development",
  },
];

export default function HeroSlideshow() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => window.clearInterval(timer);
  }, [paused, active]);

  return (
    <section
      className="hero-showcase relative flex min-h-[92svh] flex-col items-center justify-center overflow-hidden pb-32 pt-28 text-center"
      style={{ "--hero-slide-duration": `${SLIDE_DURATION}ms` } as React.CSSProperties}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
      aria-label="Middle Class Musicians studio highlights"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,168,87,0.14),transparent_68%)]" />
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          aria-hidden="true"
          className={`hero-slide-image absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-out ${index === active ? "opacity-100" : "opacity-0"}`}
          style={{ backgroundImage: `linear-gradient(90deg,rgba(7,7,10,.96) 0%,rgba(7,7,10,.78) 48%,rgba(7,7,10,.62) 100%), linear-gradient(0deg,#07070a 0%,transparent 45%), url(https://img.youtube.com/vi/${slide.id}/hqdefault.jpg)` }}
        />
      ))}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(7,7,10,.45)_100%)]" />

      <div className="container relative z-10 px-6 perspective-1000">
        <div className="hero-fade mb-8 inline-flex items-center gap-2 rounded-full border border-[#d4a857]/25 bg-[#15151c]/55 px-5 py-2 text-xs font-head uppercase tracking-[0.2em] text-[#d4a857] shadow-[0_0_20px_rgba(212,168,87,0.1)] backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-[#d4a857] shadow-[0_0_10px_#d4a857]" />
          Uttam Nagar, New Delhi · Est. 2019
        </div>

        <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#d4a857] sm:text-sm" aria-live="polite">
          {slides[active].eyebrow}
        </p>
        <h1 className="mb-6 font-head text-[clamp(4rem,12vw,10rem)] leading-[0.85]">
          <span className="hero-text-line block text-white">RECORD.</span>
          <span className="hero-text-line block text-gray-300">CREATE.</span>
          <span className="hero-text-line text-glow block text-[#d4a857]">PERFORM.</span>
        </h1>

        <p className="hero-fade mx-auto mb-10 max-w-xl text-base font-medium leading-relaxed text-gray-300 sm:text-lg" aria-live="polite">
          {slides[active].copy}
        </p>

        <div className="hero-fade flex flex-col justify-center gap-5 sm:flex-row">
          <a href={`${siteConfig.whatsapp}?text=Hi%20MCM%2C%20I%20want%20to%20book%20a%20studio%20session.`} target="_blank" rel="noopener noreferrer" data-sound="click" className="button-primary shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(212,168,87,0.45)]">
            Book Session
          </a>
          <Link href="/studio" data-sound="hover" className="button-secondary">
            View Studio
          </Link>
        </div>

        <div className="hero-fade mx-auto mt-14 flex max-w-md items-center justify-center gap-3" role="group" aria-label="Choose hero slide">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Show slide ${index + 1}: ${slide.label}`}
              aria-pressed={active === index}
              onClick={() => setActive(index)}
              className={`hero-dot relative h-3 overflow-hidden rounded-full border border-white/25 transition-all duration-300 ${active === index ? "w-14 border-[#d4a857]/70 bg-white/10" : "w-3 bg-white/20 hover:bg-white/40"}`}
            >
              {active === index && !paused && (
                <span className="hero-dot-progress absolute inset-y-0 left-0 w-full origin-left rounded-full bg-[#d4a857]" />
              )}
              {active === index && paused && (
                <span className="absolute inset-0 rounded-full bg-[#d4a857]" />
              )}
            </button>
          ))}
        </div>
        <div className="hero-fade mt-3 text-[9px] font-bold uppercase tracking-[0.22em] text-gray-500">
          {slides[active].label} <span className="mx-2 text-[#d4a857]">/</span> {String(active + 1).padStart(2, "0")} — {String(slides.length).padStart(2, "0")}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 flex w-full overflow-hidden border-y border-[#d4a857]/10 bg-[#0c0c10]/90 py-4 backdrop-blur">
        <div className="flex w-max gap-8 whitespace-nowrap font-head text-2xl uppercase tracking-widest text-[#d4a857]/80">
          <span>Recording ✦ Mixing ✦ Mastering ✦ Beat Production ✦ Video Production ✦ Artist Management ✦</span>
          <span>Recording ✦ Mixing ✦ Mastering ✦ Beat Production ✦ Video Production ✦ Artist Management ✦</span>
        </div>
      </div>
    </section>
  );
}

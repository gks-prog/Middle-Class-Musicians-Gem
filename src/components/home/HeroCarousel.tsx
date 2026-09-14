"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { PLAYBACK_DELAY, useInteractionPlayback } from "./useInteractionPlayback";

const slides = [
  { image: "studio-overview", alt: "Middle Class Musicians control room with keyboards, microphone and studio monitors", position: "center", portrait: false, label: "Everything for your next release", title: "One-stop solution", accent: "for artists.", copy: "Recording, music production, mixing & mastering, courses, artist management, and video production. Your vision, supported from the first idea to the final release." },
  { image: "mic-closeup", alt: "The studio’s RØDE microphone and pop filter", position: "55% center", portrait: false, label: "Space to find your sound", title: "An atmosphere where", accent: "creativity breathes.", copy: "Bring your ideas. Find your flow. Create music in an atmosphere that lets your own sound take centre stage." },
  { image: "recording-session", alt: "A recording session inside Middle Class Musicians", position: "50% 58%", portrait: true, label: "Growing with independent artists", title: "500+ happy clients.", accent: "7+ years of music.", copy: "From first-time recording artists to the next release, Middle Class Musicians is part of the journey. Based in Uttam Nagar, New Delhi." },
  { image: "keys-closeup", alt: "Keyboards and music production workstation inside the studio", position: "center", portrait: false, label: "Made around your identity", title: "Your sound.", accent: "Your type beats.", copy: "Tell us your genre, mood, and reference artists. Let’s shape custom beat production around the music you want to make." },
  { image: "production-corner", alt: "The studio production desk under blue lighting", position: "50% 60%", portrait: true, label: "Inside Middle Class Musicians", title: "Your next idea.", accent: "Starts here.", copy: "Take a look inside our Uttam Nagar studio, then tell us what you want to record, produce, or learn." },
];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const playback = useInteractionPlayback();
  const touchStart = useRef<number | null>(null);
  const stopped = playback.paused;
  useEffect(() => {
    if (playback.blocked) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % slides.length), PLAYBACK_DELAY);
    return () => window.clearInterval(timer);
  }, [playback.blocked, playback.activity]);

  const goTo = (index: number) => {
    setActive((index + slides.length) % slides.length);
    playback.interact();
  };

  return <section aria-label="Meet Middle Class Musicians" aria-roledescription="carousel" className="hero-carousel relative overflow-hidden bg-[#07070a]"
    {...playback.interactionProps}>
    <h1 className="sr-only">Middle Class Musicians — recording and music production studio in Uttam Nagar, New Delhi</h1>
    <div className="hero-slides flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${active * 100}%)`, touchAction: "pan-y" }}
      onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }}
      onTouchEnd={(event) => {
        if (touchStart.current !== null) {
          const distance = touchStart.current - event.changedTouches[0].clientX;
          if (Math.abs(distance) > 50) goTo(active + (distance > 0 ? 1 : -1));
        }
        touchStart.current = null;
      }} onTouchCancel={() => { touchStart.current = null; }}>
      {slides.map((slide, index) => <div key={slide.image} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}`} aria-hidden={active !== index} inert={active !== index} className="hero-panel relative flex w-full shrink-0 flex-col items-center pt-20 lg:flex-row lg:pt-0">
        <div className="hero-photo relative h-64 w-[calc(100%_-_2rem)] shrink-0 overflow-hidden sm:h-80 lg:absolute lg:inset-y-8 lg:right-6 lg:h-auto lg:w-[53%]">
          <Image src={`/images/studio/${slide.image}.webp`} alt={slide.alt} fill preload={index === 0} sizes="(min-width: 1024px) 55vw, 100vw" className={slide.portrait ? "object-cover lg:object-contain" : "object-cover"} style={{ objectPosition: slide.position }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070a] via-transparent to-transparent lg:hidden" />
        </div>
        <div className="hero-shade pointer-events-none absolute inset-0 hidden lg:block" />
        <div className="container relative mx-auto px-6 pb-36 pt-6 sm:px-10 lg:px-20 lg:pb-32 lg:pt-36">
          <p className="mb-7 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e4bd79] sm:text-xs">Uttam Nagar, New Delhi <span aria-hidden="true">/</span> Est. 2019</p>
          <p className="mb-4 font-head text-lg tracking-widest text-white/75">{slide.label}</p>
          <h2 className="max-w-3xl lg:max-w-[55%] font-head text-[clamp(3rem,5.5vw,5.5rem)] leading-[0.98] tracking-tight"><span className="block">{slide.title}</span><span className="block text-[#e4bd79]">{slide.accent}</span></h2>
          <p className="mb-8 mt-6 max-w-lg lg:max-w-[44%] text-sm leading-7 text-gray-200 sm:text-base">{slide.copy}</p>
          <div className="flex flex-wrap gap-3">
            <a href={`${siteConfig.whatsapp}?text=${encodeURIComponent("Hi MCM, I’d like to discuss a studio session.")}`} target="_blank" rel="noopener noreferrer" className="button-primary">Book a session ↗</a>
            <Link href="/services" className="button-secondary">Explore services</Link>
          </div>
        </div>
      </div>)}
    </div>
    <button type="button" className="carousel-control side-arrow hero-side-arrow left-2 sm:left-4" aria-label="Previous hero slide" onClick={() => goTo(active - 1)}>←</button>
    <button type="button" className="carousel-control side-arrow hero-side-arrow right-2 sm:right-4" aria-label="Next hero slide" onClick={() => goTo(active + 1)}>→</button>
    <div className="absolute inset-x-0 bottom-[4.5rem] z-10">
      <div className="container mx-auto flex flex-wrap items-center gap-2 px-6 sm:px-10">
        <div className="mx-2 flex gap-1" aria-label="Choose hero slide">{slides.map((slide, index) => <button key={slide.image} onClick={() => goTo(index)} aria-label={`Show slide ${index + 1}: ${slide.label}`} aria-pressed={active === index} className="flex h-11 w-7 items-center justify-center"><span className={`h-1 rounded-full transition-all ${active === index ? "w-7 bg-[#e4bd79]" : "w-3 bg-white/40"}`} /></button>)}</div>
        <span className="sr-only" aria-live={stopped ? "polite" : "off"}>Slide {active + 1} of {slides.length}: {slides[active].label}</span>
      </div>
    </div>
    <div className="overflow-hidden border-y border-[#d4a857]/20 bg-[#0c0c10] py-4" aria-label="Recording, mixing, mastering, beat production, video production, artist management and courses">
      <div className="service-strip flex w-max font-head text-xl tracking-widest text-[#d4a857] sm:text-2xl" style={{ animationPlayState: stopped ? "paused" : "running" }} aria-hidden="true">
        {[0, 1].map((copy) => <span key={copy} className="shrink-0 whitespace-nowrap pr-8">Recording ✦ Mixing ✦ Mastering ✦ Beat Production ✦ Video Production ✦ Artist Management ✦ Courses ✦ </span>)}
      </div>
    </div>
  </section>;
}

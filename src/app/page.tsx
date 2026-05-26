"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const portfolioVideos = [
  { id: "Lh67UKKh8FU", title: "4AM", artist: "DBRAVE" },
  { id: "07D7VGtHLOc", title: "Controversy", artist: "Vakta" },
  { id: "FEgOKqd_7W8", title: "MATTHA KHARAB", artist: "MC DAITYA" },
  { id: "3kgBkBZhZMQ", title: "PYAASI KALAM", artist: "MC DAITYA" },
  { id: "7NwQMtNU37c", title: "O Piya", artist: "Masky Feat. Wenon" },
  { id: "6dia6UNFkXU", title: "SADA", artist: "DEEP" },
];

export default function Home() {
  const container = useRef<HTMLElement>(null);
  const textMarqueeRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Hero Entrance
    gsap.from(".hero-text-line", {
      y: 100, opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
      duration: 1.2, stagger: 0.15, ease: "power4.out", delay: 0.1,
    });
    gsap.from(".hero-fade", { opacity: 0, y: 20, duration: 1, stagger: 0.1, ease: "power2.out", delay: 0.8 });

    // Infinite Text Marquee (Only text, portfolio is manual now)
    if (textMarqueeRef.current) {
      gsap.to(textMarqueeRef.current, {
        xPercent: -50, ease: "none", duration: 30, repeat: -1,
      });
    }

    // Standard scroll reveals
    gsap.utils.toArray(".section-reveal").forEach((elem: any) => {
      gsap.from(elem, {
        scrollTrigger: { trigger: elem, start: "top 85%" },
        opacity: 0, y: 50, duration: 1, ease: "power3.out",
      });
    });
  }, { scope: container });

  // Native Slider Controls for Portfolio
  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 424 : 304; // Card width + gap
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <main ref={container} className="w-full overflow-hidden">
      
      {/* 1. HERO SECTION (Padding fixed for Marquee Overlap) */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center text-center pt-20 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,168,87,0.08),transparent_60%)] pointer-events-none" />
        
        <div className="container relative z-10 px-6">
          <div className="hero-fade inline-block px-5 py-1.5 border border-white/10 rounded-full text-xs tracking-[0.2em] text-gray-400 mb-8 font-head uppercase bg-[#15151c]/50 backdrop-blur-md">
            Delhi · Est. 2019
          </div>
          
          <h1 className="text-[clamp(4rem,12vw,10rem)] font-head leading-[0.85] mb-6">
            <span className="block text-white hero-text-line" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }}>RECORD.</span>
            <span className="block text-gray-300 hero-text-line" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }}>CREATE.</span>
            <span className="block text-[#d4a857] hero-text-line" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }}>PERFORM.</span>
          </h1>
          
          <p className="hero-fade text-gray-400 max-w-lg mx-auto text-lg mb-12">
            Professional recording, mixing, and beat production environment. Built for sound. Designed for vision.
          </p>

          <div className="hero-fade flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/919315778147" className="px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-wider hover:bg-[#d4a857] transition-all">
              Book Session
            </a>
            <Link href="/studio" className="px-8 py-4 border border-white/20 text-white rounded-full font-bold uppercase tracking-wider hover:bg-white/5 transition-all">
              View Studio
            </Link>
          </div>
        </div>

        {/* Text Marquee Tape (w-max and whitespace-nowrap prevents overlap bug) */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden border-y border-white/10 bg-[#0c0c10]/80 backdrop-blur py-4 flex">
          <div ref={textMarqueeRef} className="flex w-max gap-8 font-head text-2xl tracking-widest text-[#d4a857]/80 uppercase whitespace-nowrap">
            <span>Recording ✦ Mixing ✦ Mastering ✦ Beat Production ✦ Video Production ✦ Artist Management ✦</span>
            <span>Recording ✦ Mixing ✦ Mastering ✦ Beat Production ✦ Video Production ✦ Artist Management ✦</span>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION (Static to avoid counter hydrate errors) */}
      <section className="py-24 bg-[#0c0c10] border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="section-reveal">
              <h2 className="text-6xl md:text-8xl font-head text-[#d4a857] mb-2 flex justify-center items-baseline">
                <span>450</span><span className="text-4xl">+</span>
              </h2>
              <p className="text-gray-400 uppercase tracking-widest text-sm font-semibold">Happy Clients</p>
            </div>
            <div className="section-reveal">
              <h2 className="text-6xl md:text-8xl font-head text-[#d4a857] mb-2 flex justify-center items-baseline">
                <span>7</span><span className="text-4xl">+</span>
              </h2>
              <p className="text-gray-400 uppercase tracking-widest text-sm font-semibold">Years in Market</p>
            </div>
            <div className="section-reveal">
              <h2 className="text-6xl md:text-8xl font-head text-[#d4a857] mb-2 flex justify-center items-baseline">
                <span>24</span><span className="text-4xl">/7</span>
              </h2>
              <p className="text-gray-400 uppercase tracking-widest text-sm font-semibold">Helping Artists</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE PORTFOLIO SLIDER */}
      <section className="py-32 bg-[#07070a] border-b border-white/5">
        <div className="container mx-auto px-6 mb-12">
          <div className="section-reveal flex justify-between items-end">
            <div>
              <span className="text-[#d4a857] font-head tracking-[0.2em] uppercase text-sm block mb-4">03 / Portfolio</span>
              <h2 className="text-4xl md:text-6xl font-head leading-none">Latest <em className="text-[#d4a857] not-italic">Visuals.</em></h2>
            </div>
            
            {/* Slider Controls */}
            <div className="flex gap-4">
              <button onClick={() => scrollSlider("left")} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#d4a857] hover:text-black transition-colors" aria-label="Previous">
                ←
              </button>
              <button onClick={() => scrollSlider("right")} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#d4a857] hover:text-black transition-colors" aria-label="Next">
                →
              </button>
            </div>
          </div>
        </div>

        {/* Native CSS Scroll Container (Hides Scrollbars) */}
        <div className="relative w-full">
          <div className="absolute top-0 left-0 w-8 md:w-16 h-full bg-gradient-to-r from-[#07070a] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-8 md:w-16 h-full bg-gradient-to-l from-[#07070a] to-transparent z-10 pointer-events-none" />

          <div 
            ref={sliderRef} 
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 md:px-16 pb-8 pt-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {portfolioVideos.map((video, idx) => (
              <a
                key={idx}
                href={`https://youtu.be/${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="snap-center group block relative w-[280px] md:w-[400px] shrink-0 rounded-2xl overflow-hidden border border-white/10 bg-[#15151c]"
              >
                <div className="relative w-full aspect-video overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                    onError={(e) => { e.currentTarget.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`; }}
                    alt={video.title}
                    className="w-full h-full object-cover filter brightness-[0.8] saturate-[0.8] group-hover:brightness-100 group-hover:saturate-100 transition-all duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 bg-[#d4a857] rounded-full flex items-center justify-center text-black scale-75 group-hover:scale-100 transition-transform duration-300">
                      ▶
                    </div>
                  </div>
                </div>
                <div className="p-5 border-t border-white/10">
                  <h4 className="font-head text-2xl text-white truncate">{video.title}</h4>
                  <p className="font-body text-xs text-gray-400 font-semibold uppercase tracking-widest mt-1">{video.artist}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ECOSYSTEM FUNNEL */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="section-reveal mb-16">
            <span className="text-[#d4a857] font-head tracking-[0.2em] uppercase text-sm block mb-4">04 / The Ecosystem</span>
            <h2 className="text-5xl md:text-7xl font-head leading-none">Everything you <em className="text-[#d4a857] not-italic">need.</em></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/services" className="section-reveal group p-8 rounded-2xl bg-[#15151c] border border-white/5 hover:border-[#d4a857]/50 transition-all block">
              <h3 className="text-3xl font-head mb-4 group-hover:text-[#d4a857] transition-colors">Services</h3>
              <p className="text-gray-400 mb-8 text-sm">Recording, Mixing, Mastering, and Custom Beat Production.</p>
              <span className="text-white text-sm font-semibold uppercase tracking-widest">Explore →</span>
            </Link>
            <Link href="/portfolio" className="section-reveal group p-8 rounded-2xl bg-[#15151c] border border-white/5 hover:border-[#d4a857]/50 transition-all block">
              <h3 className="text-3xl font-head mb-4 group-hover:text-[#d4a857] transition-colors">Portfolio</h3>
              <p className="text-gray-400 mb-8 text-sm">Visuals, full tracks, and before/after mix comparisons.</p>
              <span className="text-white text-sm font-semibold uppercase tracking-widest">Listen →</span>
            </Link>
            <Link href="/courses" className="section-reveal group p-8 rounded-2xl bg-[#15151c] border border-white/5 hover:border-[#d4a857]/50 transition-all block">
              <h3 className="text-3xl font-head mb-4 group-hover:text-[#d4a857] transition-colors">Academy</h3>
              <p className="text-gray-400 mb-8 text-sm">Integrated Music Production & AI generation courses.</p>
              <span className="text-white text-sm font-semibold uppercase tracking-widest">Learn →</span>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

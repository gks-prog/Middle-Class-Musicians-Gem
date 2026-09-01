"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const portfolioVideos = [
  { id: "Lh67UKKh8FU", title: "4AM", artist: "DBRAVE" },
  { id: "07D7VGtHLOc", title: "Controversy", artist: "Vakta" },
  { id: "FEgOKqd_7W8", title: "MATTHA KHARAB", artist: "MC DAITYA" },
  { id: "3kgBkBZhZMQ", title: "PYAASI KALAM", artist: "MC DAITYA" },
];

export default function Home() {
  const container = useRef<HTMLElement>(null);
  const textMarqueeRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Cinematic 3D Hero Reveal
    gsap.from(".hero-text-line", {
      y: 120, opacity: 0, rotationX: -30, filter: "blur(12px)",
      duration: 1.5, stagger: 0.15, ease: "power4.out", delay: 0.2,
    });
    
    gsap.from(".hero-fade", { 
      opacity: 0, y: 30, filter: "blur(5px)", duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 1 
    });

    if (textMarqueeRef.current) {
      gsap.to(textMarqueeRef.current, { xPercent: -50, ease: "none", duration: 25, repeat: -1 });
    }

    gsap.utils.toArray(".section-reveal").forEach((elem: any) => {
      gsap.from(elem, {
        scrollTrigger: { trigger: elem, start: "top 85%" },
        opacity: 0, y: 60, scale: 0.98, duration: 1.2, ease: "power3.out",
      });
    });
  }, { scope: container });

  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 424 : 304;
      sliderRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <main ref={container} className="w-full overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center text-center pt-20 pb-32">
        {/* Animated Glow Core */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,168,87,0.12),transparent_70%)] pointer-events-none animate-pulse duration-[4000ms]" />
        
        <div className="container relative z-10 px-6 perspective-1000">
          <div className="hero-fade inline-block px-5 py-1.5 border border-[#d4a857]/20 rounded-full text-xs tracking-[0.2em] text-[#d4a857] mb-8 font-head uppercase bg-[#15151c]/50 backdrop-blur-md shadow-[0_0_20px_rgba(212,168,87,0.1)]">
            Delhi · Est. 2019
          </div>
          
          <h1 className="text-[clamp(4rem,12vw,10rem)] font-head leading-[0.85] mb-6">
            <span className="block text-white hero-text-line">RECORD.</span>
            <span className="block text-gray-300 hero-text-line">CREATE.</span>
            <span className="block text-[#d4a857] hero-text-line text-glow">PERFORM.</span>
          </h1>
          
          <p className="hero-fade text-gray-400 max-w-lg mx-auto text-lg mb-12 font-medium">
            Professional recording, mixing, and beat production environment. Built for sound. Designed for vision.
          </p>

          <div className="hero-fade flex flex-col sm:flex-row gap-5 justify-center">
            <a href="https://wa.me/919315778147" data-sound="click" className="px-9 py-4 bg-white text-black rounded-full font-bold uppercase tracking-wider hover:bg-[#d4a857] hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(212,168,87,0.6)]">
              Book Session
            </a>
            <Link href="/studio" data-sound="hover" className="px-9 py-4 border border-white/20 text-white rounded-full font-bold uppercase tracking-wider hover:bg-white/10 hover:border-white/50 transition-all duration-300">
              View Studio
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden border-y border-[#d4a857]/10 bg-[#0c0c10]/90 backdrop-blur py-4 flex box-glow">
          <div ref={textMarqueeRef} className="flex w-max gap-8 font-head text-2xl tracking-widest text-[#d4a857]/80 uppercase whitespace-nowrap">
            <span>Recording ✦ Mixing ✦ Mastering ✦ Beat Production ✦ Video Production ✦ Artist Management ✦</span>
            <span>Recording ✦ Mixing ✦ Mastering ✦ Beat Production ✦ Video Production ✦ Artist Management ✦</span>
          </div>
        </div>
      </section>

      {/* ECOSYSTEM FUNNEL */}
      <section className="py-32 relative bg-[#07070a]">
        <div className="container mx-auto px-6">
          <div className="section-reveal mb-20 text-center md:text-left">
            <span className="text-[#d4a857] font-head tracking-[0.2em] uppercase text-sm block mb-4">01 / The Ecosystem</span>
            <h2 className="text-5xl md:text-7xl font-head leading-none">Everything you <em className="text-[#d4a857] not-italic text-glow">need.</em></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Services", desc: "Recording, Mixing, Mastering, and Custom Beat Production.", path: "/services" },
              { title: "Portfolio", desc: "Visuals, full tracks, and before/after mix comparisons.", path: "/portfolio" },
              { title: "Academy", desc: "Integrated Music Production & AI generation courses.", path: "/courses" }
            ].map((card, i) => (
              <Link href={card.path} key={i} data-sound="hover" className="section-reveal group p-10 rounded-3xl bg-[#15151c] border border-white/5 hover:border-[#d4a857]/50 box-glow-hover transition-all duration-500 ease-out hover:-translate-y-2 block relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4a857]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h3 className="text-4xl font-head mb-4 text-white group-hover:text-[#d4a857] transition-colors relative z-10">{card.title}</h3>
                <p className="text-gray-400 mb-10 text-sm leading-relaxed relative z-10">{card.desc}</p>
                <span className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:text-[#d4a857] transition-colors relative z-10">
                  Explore <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE PORTFOLIO SLIDER */}
      <section className="py-32 bg-[#0c0c10] border-y border-white/5">
        <div className="container mx-auto px-6 mb-12">
          <div className="section-reveal flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
            <div className="text-center md:text-left">
              <span className="text-[#d4a857] font-head tracking-[0.2em] uppercase text-sm block mb-4">02 / Portfolio</span>
              <h2 className="text-5xl md:text-7xl font-head leading-none">Latest <em className="text-[#d4a857] not-italic text-glow">Visuals.</em></h2>
            </div>
            
            <div className="flex gap-4">
              <button data-sound="hover" onClick={() => scrollSlider("left")} className="w-14 h-14 rounded-full border border-white/10 bg-[#15151c] flex items-center justify-center hover:bg-[#d4a857] hover:text-black hover:scale-110 box-glow-hover transition-all duration-300">←</button>
              <button data-sound="hover" onClick={() => scrollSlider("right")} className="w-14 h-14 rounded-full border border-white/10 bg-[#15151c] flex items-center justify-center hover:bg-[#d4a857] hover:text-black hover:scale-110 box-glow-hover transition-all duration-300">→</button>
            </div>
          </div>
        </div>

        <div className="relative w-full">
          <div className="absolute top-0 left-0 w-8 md:w-24 h-full bg-gradient-to-r from-[#0c0c10] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-8 md:w-24 h-full bg-gradient-to-l from-[#0c0c10] to-transparent z-10 pointer-events-none" />

          <div ref={sliderRef} className="flex gap-8 overflow-x-auto snap-x snap-mandatory px-6 md:px-24 pb-12 pt-4 scrollbar-hide">
            {portfolioVideos.map((video, idx) => (
              <a key={idx} href={`https://youtu.be/${video.id}`} target="_blank" rel="noopener noreferrer" data-sound="click" className="snap-center group block relative w-[300px] md:w-[450px] shrink-0 rounded-3xl overflow-hidden border border-white/5 bg-[#15151c] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-500 ease-out">
                <div className="relative w-full aspect-video overflow-hidden">
                  <Image unoptimized width={1280} height={720} src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`} onError={(e) => { e.currentTarget.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`; }} alt={`${video.title} by ${video.artist}`} className="w-full h-full object-cover filter brightness-[0.7] saturate-50 group-hover:brightness-100 group-hover:saturate-100 transition-all duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-20 h-20 bg-[#d4a857] rounded-full flex items-center justify-center text-black scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 ease-out box-glow">▶</div>
                  </div>
                </div>
                <div className="p-6 border-t border-white/5">
                  <h4 className="font-head text-3xl text-white truncate group-hover:text-[#d4a857] transition-colors">{video.title}</h4>
                  <p className="font-body text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">{video.artist}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

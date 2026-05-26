"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Portfolio Data extracted from your original HTML
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
  const portfolioMarqueeRef = useRef<HTMLDivElement>(null);
  const textMarqueeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Bulletproof Hero Entrance (Fixes the missing text bug)
    gsap.from(".hero-text-line", {
      y: 100,
      opacity: 0,
      clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
      duration: 1.2,
      stagger: 0.15,
      ease: "power4.out",
      delay: 0.1,
    });

    gsap.from(".hero-fade", {
      opacity: 0,
      y: 20,
      duration: 1,
      stagger: 0.1,
      ease: "power2.out",
      delay: 0.8,
    });

    // 2. Stats Counter
    gsap.utils.toArray(".stat-number").forEach((stat: any) => {
      const target = parseFloat(stat.getAttribute("data-target"));
      gsap.to(stat, {
        scrollTrigger: {
          trigger: stat,
          start: "top 85%",
          once: true,
        },
        innerHTML: target,
        duration: 2,
        ease: "power2.out",
        snap: { innerHTML: 1 },
        onUpdate: function () {
          stat.innerHTML = Math.ceil(Number(this.targets()[0].innerHTML));
        },
      });
    });

    // 3. Section Scroll Reveals
    gsap.utils.toArray(".section-reveal").forEach((elem: any) => {
      gsap.from(elem, {
        scrollTrigger: { trigger: elem, start: "top 85%" },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
      });
    });

    // 4. Infinite Marquees
    if (textMarqueeRef.current) {
      gsap.to(textMarqueeRef.current, {
        xPercent: -50,
        ease: "none",
        duration: 20,
        repeat: -1,
      });
    }

    if (portfolioMarqueeRef.current) {
      gsap.to(portfolioMarqueeRef.current, {
        xPercent: -50, // Moves exactly half the width (one full set of videos)
        ease: "none",
        duration: 40, // Slow, cinematic pan
        repeat: -1,
      });
    }
  }, { scope: container });

  return (
    <main ref={container} className="w-full overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center text-center pt-20">
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
            <a href="https://wa.me/919315778147" className="px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-wider hover:bg-[#d4a857] transition-all" data-sound="click">
              Book Session
            </a>
            <Link href="/studio" className="px-8 py-4 border border-white/20 text-white rounded-full font-bold uppercase tracking-wider hover:bg-white/5 transition-all" data-sound="hover">
              View Studio
            </Link>
          </div>
        </div>

        {/* Text Marquee Tape */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden border-y border-white/10 bg-[#0c0c10]/80 backdrop-blur py-4 flex whitespace-nowrap">
          <div ref={textMarqueeRef} className="flex gap-8 font-head text-2xl tracking-widest text-[#d4a857]/80 uppercase">
            <span>Recording ✦ Mixing ✦ Mastering ✦ Beat Production ✦ Video Production ✦ Artist Management ✦</span>
            <span>Recording ✦ Mixing ✦ Mastering ✦ Beat Production ✦ Video Production ✦ Artist Management ✦</span>
            <span>Recording ✦ Mixing ✦ Mastering ✦ Beat Production ✦ Video Production ✦ Artist Management ✦</span>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="py-24 bg-[#0c0c10] border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="section-reveal">
              <h2 className="text-6xl md:text-8xl font-head text-[#d4a857] mb-2 flex justify-center items-baseline">
                <span className="stat-number" data-target="450">0</span>
                <span className="text-4xl">+</span>
              </h2>
              <p className="text-gray-400 uppercase tracking-widest text-sm font-semibold">Happy Clients</p>
            </div>
            <div className="section-reveal">
              <h2 className="text-6xl md:text-8xl font-head text-[#d4a857] mb-2 flex justify-center items-baseline">
                <span className="stat-number" data-target="7">0</span>
                <span className="text-4xl">+</span>
              </h2>
              <p className="text-gray-400 uppercase tracking-widest text-sm font-semibold">Years in Market</p>
            </div>
            <div className="section-reveal">
              <h2 className="text-6xl md:text-8xl font-head text-[#d4a857] mb-2 flex justify-center items-baseline">
                <span className="stat-number" data-target="24">0</span>
                <span className="text-4xl">/7</span>
              </h2>
              <p className="text-gray-400 uppercase tracking-widest text-sm font-semibold">Helping Artists</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PORTFOLIO MARQUEE SECTION */}
      <section className="py-32 bg-[#07070a] overflow-hidden border-b border-white/5">
        <div className="container mx-auto px-6 mb-16">
          <div className="section-reveal flex justify-between items-end">
            <div>
              <span className="text-[#d4a857] font-head tracking-[0.2em] uppercase text-sm block mb-4">03 / Portfolio</span>
              <h2 className="text-4xl md:text-6xl font-head leading-none">Latest <em className="text-[#d4a857] not-italic">Visuals.</em></h2>
            </div>
            <Link href="/portfolio" className="hidden md:block text-sm uppercase tracking-widest text-gray-400 hover:text-white transition-colors border-b border-white/20 pb-1">
              View All Works
            </Link>
          </div>
        </div>

        {/* Video Track */}
        <div className="relative w-full flex">
          {/* Gradient Masks for smooth fade on edges */}
          <div className="absolute top-0 left-0 w-[10vw] h-full bg-gradient-to-r from-[#07070a] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-[10vw] h-full bg-gradient-to-l from-[#07070a] to-transparent z-10 pointer-events-none" />

          <div ref={portfolioMarqueeRef} className="flex gap-6 w-max px-6">
            {/* Array is mapped twice to create a seamless infinite loop */}
            {[...portfolioVideos, ...portfolioVideos].map((video, idx) => (
              <a
                key={idx}
                href={`https://youtu.be/${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group block relative w-[280px] md:w-[400px] shrink-0 rounded-2xl overflow-hidden border border-white/10 bg-[#15151c]"
                data-sound="hover"
              >
                <div className="relative w-full aspect-video overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                    onError={(e) => { e.currentTarget.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`; }}
                    alt={video.title}
                    className="w-full h-full object-cover filter brightness-[0.8] saturate-[0.8] group-hover:brightness-100 group-hover:saturate-100 transition-all duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 bg-[#d4a857] rounded-full flex items-center justify-center text-black scale-75 group-hover:scale-100 transition-transform duration-300">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1">
                        <path d="M8 5v14l11-7z" />
                      </svg>
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
            <p className="text-gray-400 mt-6 max-w-xl">An entire industry under one roof. Select a division to explore our capabilities.</p>
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

      {/* 5. CONTACT SECTION */}
      <section className="py-32 bg-[#0c0c10] border-t border-white/5" id="contact">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 p-8 md:p-16 rounded-[2rem] bg-[#15151c] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4a857]/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
            
            <div className="relative z-10 section-reveal">
              <span className="text-[#d4a857] font-head tracking-[0.2em] uppercase text-sm block mb-4">05 / Connect</span>
              <h2 className="text-5xl md:text-7xl font-head leading-none mb-6">Let's make something <em className="text-[#d4a857] not-italic">iconic.</em></h2>
              <p className="text-gray-400 mb-12">Reach out on WhatsApp for the fastest reply — or send us a formal inquiry.</p>
              
              <div className="space-y-4">
                <a href="https://wa.me/919315778147" className="flex items-center gap-6 p-4 rounded-full border border-white/10 hover:border-[#d4a857] transition-colors bg-[#07070a]">
                  <div className="w-12 h-12 rounded-full bg-[#15151c] flex items-center justify-center text-[#d4a857]">WA</div>
                  <div>
                    <strong className="block text-sm">WhatsApp</strong>
                    <span className="text-xs text-gray-400">+91 93157 78147</span>
                  </div>
                </a>
                <a href="https://instagram.com/middleclassmusicians" className="flex items-center gap-6 p-4 rounded-full border border-white/10 hover:border-[#d4a857] transition-colors bg-[#07070a]">
                  <div className="w-12 h-12 rounded-full bg-[#15151c] flex items-center justify-center text-[#d4a857]">IG</div>
                  <div>
                    <strong className="block text-sm">Instagram</strong>
                    <span className="text-xs text-gray-400">@middleclassmusicians</span>
                  </div>
                </a>
              </div>
            </div>

            <form className="relative z-10 flex flex-col gap-6 section-reveal">
              <div>
                <label className="block font-head text-sm tracking-widest text-gray-400 mb-2">Name</label>
                <input type="text" placeholder="Your name" className="w-full bg-[#07070a] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#d4a857] transition-colors" />
              </div>
              <div>
                <label className="block font-head text-sm tracking-widest text-gray-400 mb-2">Service</label>
                <select className="w-full bg-[#07070a] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#d4a857] transition-colors appearance-none cursor-pointer">
                  <option value="">Select a service</option>
                  <option>Recording & Mixing</option>
                  <option>Beat Production</option>
                  <option>Video Production</option>
                  <option>Music Courses</option>
                </select>
              </div>
              <div>
                <label className="block font-head text-sm tracking-widest text-gray-400 mb-2">Message</label>
                <textarea rows={4} placeholder="Tell us about your project" className="w-full bg-[#07070a] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#d4a857] transition-colors resize-none" />
              </div>
              <button type="button" className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-[#d4a857] transition-colors">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>

    </main>
  );
}

"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const container = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Hero Entrance
    const tl = gsap.timeline();
    tl.fromTo(".gsap-reveal", 
      { y: 60, opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
      { y: 0, opacity: 1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)", duration: 1.2, stagger: 0.15, ease: "power4.out", delay: 0.2 }
    )
    .fromTo(".gsap-fade",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power2.out" },
      "-=0.8"
    );

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
        onUpdate: function() {
          stat.innerHTML = Math.ceil(this.targets()[0].innerHTML);
        }
      });
    });

    // 3. Section Scroll Reveal
    gsap.utils.toArray(".section-reveal").forEach((elem: any) => {
      gsap.fromTo(elem,
        { opacity: 0, y: 50 },
        {
          scrollTrigger: { trigger: elem, start: "top 80%" },
          opacity: 1, y: 0, duration: 1, ease: "power3.out"
        }
      );
    });

    // 4. Infinite Marquee
    if (marqueeRef.current) {
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        ease: "none",
        duration: 20,
        repeat: -1,
      });
    }
  }, { scope: container });

  return (
    <main ref={container} className="w-full overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center text-center pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,168,87,0.08),transparent_60%)] pointer-events-none" />
        
        <div className="container relative z-10 px-6">
          <div className="gsap-fade inline-block px-5 py-1.5 border border-white/10 rounded-full text-xs tracking-[0.2em] text-gray-400 mb-8 font-head uppercase bg-[#15151c]/50 backdrop-blur-md">
            Delhi · Est. 2019
          </div>
          
          <h1 className="text-[clamp(4rem,12vw,10rem)] font-head leading-[0.85] mb-6">
            <span className="block text-white gsap-reveal">RECORD.</span>
            <span className="block text-gray-300 gsap-reveal">CREATE.</span>
            <span className="block text-[#d4a857] gsap-reveal">PERFORM.</span>
          </h1>
          
          <p className="gsap-fade text-gray-400 max-w-lg mx-auto text-lg mb-12">
            Professional recording, mixing, and beat production environment. Built for sound. Designed for vision.
          </p>

          <div className="gsap-fade flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/919315778147" className="px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-wider hover:bg-[#d4a857] transition-all" data-sound="click">
              Book Session
            </a>
            <Link href="/studio" className="px-8 py-4 border border-white/20 text-white rounded-full font-bold uppercase tracking-wider hover:bg-white/5 transition-all" data-sound="hover">
              View Studio
            </Link>
          </div>
        </div>

        {/* Curved text replacement -> Sleek Infinite Tape */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden border-y border-white/10 bg-[#0c0c10]/80 backdrop-blur py-4 flex whitespace-nowrap">
          <div ref={marqueeRef} className="flex gap-8 font-head text-2xl tracking-widest text-[#d4a857]/80 uppercase">
            <span>Recording ✦ Mixing ✦ Mastering ✦ Beat Production ✦ Video Production ✦ Artist Management ✦</span>
            <span>Recording ✦ Mixing ✦ Mastering ✦ Beat Production ✦ Video Production ✦ Artist Management ✦</span>
            <span>Recording ✦ Mixing ✦ Mastering ✦ Beat Production ✦ Video Production ✦ Artist Management ✦</span>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
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

      {/* ECOSYSTEM FUNNEL (Routing users to sub-pages) */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="section-reveal mb-16">
            <span className="text-[#d4a857] font-head tracking-[0.2em] uppercase text-sm block mb-4">01 / The Ecosystem</span>
            <h2 className="text-5xl md:text-7xl font-head leading-none">Everything you <em className="text-[#d4a857] not-italic">need.</em></h2>
            <p className="text-gray-400 mt-6 max-w-xl">An entire industry under one roof. Select a division to explore our capabilities.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/services" className="section-reveal group p-8 rounded-2xl bg-[#15151c] border border-white/5 hover:border-[#d4a857]/50 transition-all block">
              <h3 className="text-3xl font-head mb-4 group-hover:text-[#d4a857] transition-colors">Services</h3>
              <p className="text-gray-400 mb-8 text-sm">Recording, Mixing, Mastering, and Custom Beat Production.</p>
              <span className="text-white text-sm font-semibold uppercase tracking-widest">Explore →</span>
            </Link>
            
            <Link href="/portfolio" className="section-reveal group p-8 rounded-2xl bg-[#15151c] border border-white/5 hover:border-[#d4a857]/50 transition-all block" style={{transitionDelay: "100ms"}}>
              <h3 className="text-3xl font-head mb-4 group-hover:text-[#d4a857] transition-colors">Portfolio</h3>
              <p className="text-gray-400 mb-8 text-sm">Visuals, full tracks, and before/after mix comparisons.</p>
              <span className="text-white text-sm font-semibold uppercase tracking-widest">Listen →</span>
            </Link>

            <Link href="/courses" className="section-reveal group p-8 rounded-2xl bg-[#15151c] border border-white/5 hover:border-[#d4a857]/50 transition-all block" style={{transitionDelay: "200ms"}}>
              <h3 className="text-3xl font-head mb-4 group-hover:text-[#d4a857] transition-colors">Academy</h3>
              <p className="text-gray-400 mb-8 text-sm">Integrated Music Production & AI generation courses.</p>
              <span className="text-white text-sm font-semibold uppercase tracking-widest">Learn →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-32 bg-[#0c0c10] border-t border-white/5" id="contact">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 p-8 md:p-16 rounded-[2rem] bg-[#15151c] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4a857]/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
            
            <div className="relative z-10 section-reveal">
              <span className="text-[#d4a857] font-head tracking-[0.2em] uppercase text-sm block mb-4">02 / Connect</span>
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
                <select className="w-full bg-[#07070a] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#d4a857] transition-colors appearance-none">
                  <option value="">Select a service</option>
                  <option>Recording & Mixing</option>
                  <option>Beat Production</option>
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

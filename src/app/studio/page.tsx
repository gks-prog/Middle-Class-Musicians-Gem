"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StudioPage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo(".gsap-reveal", 
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" }
    );

    gsap.utils.toArray('.gsap-card').forEach((card: any) => {
      gsap.fromTo(card,
        { y: 50, opacity: 0 },
        {
          scrollTrigger: { trigger: card, start: "top 85%" },
          y: 0, opacity: 1, duration: 0.8, ease: "power2.out"
        }
      );
    });
  }, { scope: container });

  return (
    <div ref={container} className="pt-24 pb-20">
      {/* Hero */}
      <section className="container mx-auto px-6 mb-24 text-center">
        <h1 className="text-5xl md:text-8xl font-head uppercase mb-4 gsap-reveal">
          Where Creativity Meets<br/><span className="text-gold">Industry Sound</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto gsap-reveal">
          A professional recording, production, and mixing environment engineered for acoustic precision.
        </p>
      </section>

      {/* Gallery Collage */}
      <section className="container mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="gsap-card group relative h-[400px] overflow-hidden rounded-2xl bg-surface border border-white/10">
            {/* Replace with actual image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
            <div className="absolute bottom-6 left-6 z-20">
              <span className="text-gold text-xs font-head tracking-widest mb-1 block">Live Room</span>
              <h3 className="text-2xl font-head">The Control Hub</h3>
            </div>
          </div>
          <div className="gsap-card group relative h-[400px] overflow-hidden rounded-2xl bg-surface border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
            <div className="absolute bottom-6 left-6 z-20">
              <span className="text-gold text-xs font-head tracking-widest mb-1 block">Hardware</span>
              <h3 className="text-2xl font-head">Premium Signal Chain</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container mx-auto px-6 mb-24 text-center">
        <h2 className="text-4xl font-head mb-12 gsap-card">The Architects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="gsap-card p-8 rounded-2xl bg-surface border border-white/5">
            <div className="w-24 h-24 mx-auto rounded-full bg-black border border-gold mb-6" />
            <h3 className="text-2xl font-head">Wenon Bont</h3>
            <p className="text-gold text-sm uppercase tracking-widest mb-4">Lead Producer / Composer</p>
            <p className="text-gray-400 text-sm">Specializing in heavy, industry-standard Hip Hop, Phonk, and Drill production. Crafting the sonic identity of the next generation.</p>
          </div>
          <div className="gsap-card p-8 rounded-2xl bg-surface border border-white/5">
            <div className="w-24 h-24 mx-auto rounded-full bg-black border border-gold mb-6" />
            <h3 className="text-2xl font-head">Bunny</h3>
            <p className="text-gold text-sm uppercase tracking-widest mb-4">Founder / Brand Strategist</p>
            <p className="text-gray-400 text-sm">Driving the vision behind Middle Class Musicians and shaping the overarching visual and commercial aesthetic.</p>
          </div>
        </div>
      </section>

      <div className="text-center gsap-card">
        <a href="https://wa.me/919315778147" className="inline-flex px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-wider hover:bg-gold transition-colors">
          Book Your Session
        </a>
      </div>
    </div>
  );
}

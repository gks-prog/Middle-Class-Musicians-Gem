"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Home() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(".gsap-reveal", 
      { y: 50, opacity: 0, visibility: "hidden" },
      { y: 0, opacity: 1, visibility: "visible", duration: 1, stagger: 0.15, ease: "power4.out", delay: 0.2 }
    )
    .fromTo(".gsap-fade",
      { opacity: 0 },
      { opacity: 1, duration: 1, stagger: 0.1, ease: "power2.out" },
      "-=0.5"
    );
  }, { scope: container });

  return (
    <section ref={container} className="relative min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />
      
      <div className="container relative z-10 px-6">
        <div className="gsap-fade inline-block px-4 py-1 border border-white/20 rounded-full text-xs tracking-widest text-gray-400 mb-8 font-head uppercase bg-black/50 backdrop-blur-md">
          Delhi · Est. 2019
        </div>
        
        <h1 className="text-6xl md:text-9xl font-head leading-none mb-6">
          <span className="block text-white/90 gsap-reveal">RECORD.</span>
          <span className="block text-white/90 gsap-reveal">CREATE.</span>
          <span className="block text-gold gsap-reveal">PERFORM.</span>
        </h1>
        
        <p className="gsap-fade text-gray-400 max-w-lg mx-auto text-lg mb-10">
          Professional recording, mixing, and beat production environment. Built for sound. Designed for vision.
        </p>

        <div className="gsap-fade flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://wa.me/919315778147" className="px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-wider hover:bg-gold hover:scale-105 transition-all" data-sound="hover">
            Book Session
          </a>
          <a href="/studio" className="px-8 py-4 border border-white/20 text-white rounded-full font-bold uppercase tracking-wider hover:border-white transition-all" data-sound="click">
            View Studio
          </a>
        </div>
      </div>
    </section>
  );
}

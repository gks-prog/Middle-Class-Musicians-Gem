"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function PortfolioPage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(".anim-text", 
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power4.out" }
    );
  }, { scope: container });

  return (
    <div ref={container} className="pt-32 pb-20 container mx-auto px-6">
      <div className="mb-20 border-l-4 border-gold pl-6">
        <h1 className="text-5xl md:text-7xl font-head leading-none text-gray-500">
          <span className="anim-text block text-white">Expressing.</span>
          <span className="anim-text block text-gray-300">Experimenting.</span>
          <span className="anim-text block text-gold">Executing.</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-2xl bg-surface border border-white/10 h-[500px] flex items-center justify-center">
          <p className="text-gray-500 font-head tracking-widest">Video Player Integration Placeholder</p>
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-surface border border-white/10 h-full flex flex-col justify-center">
            <h3 className="text-xl font-head mb-4">Raw vs Final</h3>
            {/* UI Shell for future Wavesurfer implementation */}
            <div className="w-full h-16 bg-black rounded border border-white/5 mb-4 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-gold/20 w-1/2 border-r border-gold" />
            </div>
            <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded text-sm uppercase tracking-widest transition-colors">
              Toggle Mix
            </button>
          </div>
          
          <div className="p-6 rounded-2xl bg-surface border border-white/10 flex-grow">
            <h3 className="text-xl font-head mb-4">Categories</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="hover:text-gold cursor-pointer transition-colors">→ Full Songs</li>
              <li className="hover:text-gold cursor-pointer transition-colors">→ Beat Production</li>
              <li className="hover:text-gold cursor-pointer transition-colors">→ Mix & Master</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { initAudio, playSFX } from "@/lib/audio";

export default function Preloader() {
  const [isEntering, setIsEntering] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  // Automated Exit Trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEntering(true);
    }, 2500); // 2.5 seconds showcase
    return () => clearTimeout(timer);
  }, []);

  useGSAP(() => {
    if (isEntering) {
      const tl = gsap.timeline({
        onComplete: () => setIsUnmounted(true)
      });
      
      tl.to(".preloader-content", { y: -50, opacity: 0, duration: 0.6, ease: "power3.in" })
        .to(container.current, { yPercent: -100, duration: 1.2, ease: "power4.inOut" });
    }
  }, { scope: container, dependencies: [isEntering] });

  // Optional manual interaction to trigger audio if user clicks before auto-exit
  const handleManualUnlock = () => {
    if (!isEntering) {
      initAudio();
      playSFX("riser");
      setIsEntering(true);
    }
  };

  if (isUnmounted) return null;

  return (
    <div 
      ref={container} 
      onClick={handleManualUnlock}
      className="fixed inset-0 z-[9999] bg-[#07070a] flex flex-col items-center justify-center cursor-pointer"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,168,87,0.08),transparent_50%)] animate-pulse duration-[3000ms]" />
      
      <div className="preloader-content text-center relative z-10 flex flex-col items-center gap-8">
        <h1 className="text-4xl md:text-6xl font-head tracking-[0.3em] text-white text-glow">
          <span className="text-[#d4a857]">MCM</span> STUDIO
        </h1>
        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#d4a857] to-transparent animate-pulse" />
      </div>
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { initAudio, playSFX } from "@/lib/audio";

export default function Preloader() {
  const [isEntered, setIsEntered] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isEntered) {
      const tl = gsap.timeline({
        onComplete: () => setIsUnmounted(true)
      });
      tl.to(".preloader-text", { y: -50, opacity: 0, duration: 0.5, ease: "power2.in" })
        .to(container.current, { yPercent: -100, duration: 1.2, ease: "power4.inOut" });
    }
  }, { scope: container, dependencies: [isEntered] });

  const handleEnter = () => {
    if (isEntered) return;
    initAudio();
    playSFX("riser");
    setIsEntered(true);
  };

  if (isUnmounted) return null;

  return (
    <div 
      ref={container} 
      onClick={handleEnter}
      className="fixed inset-0 z-[9999] bg-[#07070a] flex flex-col items-center justify-center cursor-pointer"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,168,87,0.05),transparent_50%)] animate-pulse duration-[3000ms]" />
      
      <div className="preloader-text text-center relative z-10 flex flex-col items-center gap-8">
        <h1 className="text-4xl md:text-6xl font-head tracking-[0.3em] text-white text-glow">
          <span className="text-[#d4a857]">MCM</span> STUDIO
        </h1>
        <p className="text-xs uppercase tracking-[0.4em] text-gray-500 animate-pulse">
          Tap anywhere to enter
        </p>
      </div>
    </div>
  );
}

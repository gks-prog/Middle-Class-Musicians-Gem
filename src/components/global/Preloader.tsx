"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { initAudio, playSFX } from "@/lib/audio";

export default function Preloader() {
  const [isEntering, setIsEntering] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (sessionStorage.getItem("mcm-intro-seen") || reduceMotion) {
      setIsUnmounted(true);
      return;
    }
    const timer = setTimeout(() => {
      setIsEntering(true);
    }, 1100);
    return () => clearTimeout(timer);
  }, []);

  useGSAP(() => {
    // 1. Organic, Recursive Equalizer Animation
    gsap.utils.toArray(".eq-bar").forEach((bar: any) => {
      const animateBar = () => {
        if (!container.current) return; // Prevent memory leaks if unmounted
        gsap.to(bar, {
          scaleY: Math.random() * 0.8 + 0.2, // Random height between 20% and 100%
          duration: Math.random() * 0.15 + 0.15, // Fast, snappy audio-like reaction time
          ease: "sine.inOut",
          onComplete: animateBar, // Recursive loop for continuous organic randomness
        });
      };
      animateBar();
    });

    // 2. Cinematic Exit Transition
    if (isEntering) {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("mcm-intro-seen", "true");
          setIsUnmounted(true);
        }
      });
      
      tl.to(".preloader-content", { y: -50, opacity: 0, duration: 0.6, ease: "power3.in" })
        .to(container.current, { yPercent: -100, duration: 1.2, ease: "power4.inOut" });
    }
  }, { scope: container, dependencies: [isEntering] });

  // Manual interaction to legally unlock browser AudioContext if tapped early
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
      role="button"
      tabIndex={0}
      aria-label="Enter Middle Class Musicians website"
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") handleManualUnlock();
      }}
      className="fixed inset-0 z-[9999] bg-[#07070a] flex flex-col items-center justify-center cursor-pointer overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,168,87,0.08),transparent_50%)] animate-pulse duration-[3000ms]" />
      
      <div className="preloader-content text-center relative z-10 flex flex-col items-center gap-6 w-full px-6">
        
        {/* Dynamic Simulated Equalizer */}
        <div className="flex items-end justify-center gap-[4px] md:gap-1.5 h-12 md:h-16 w-full mb-2">
          {[...Array(9)].map((_, i) => (
            <div 
              key={i} 
              className="eq-bar w-1.5 md:w-2 bg-[#d4a857] rounded-t-sm origin-bottom" 
              style={{ 
                transform: "scaleY(0.2)", 
                filter: "drop-shadow(0 0 10px rgba(212,168,87,0.6))" 
              }}
            />
          ))}
        </div>

        {/* Scaled Typography */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-head tracking-[0.15em] md:tracking-[0.25em] text-white text-glow uppercase leading-tight">
          MIDDLE CLASS <span className="text-[#d4a857]">MUSICIANS</span>
        </h1>
        
        <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-gray-500 animate-pulse mt-4">
          Tap to enter · intro plays once
        </p>
      </div>
    </div>
  );
}

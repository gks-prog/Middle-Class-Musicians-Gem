"use client";

import { useEffect, useRef } from "react";

export default function AudioEngine() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize strictly on the client
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const initAudio = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
    };

    const playSFX = (type: string) => {
      const ctx = audioCtxRef.current;
      if (!ctx || ctx.state === "suspended") return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === "hover") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      } else if (type === "click") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        if (navigator.vibrate) navigator.vibrate(15);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    };

    // Unlock audio context on first interaction
    const unlockEvents = ["pointerdown", "keydown"];
    unlockEvents.forEach((evt) => document.addEventListener(evt, initAudio, { once: true }));

    // Global event delegates for sound triggers
    const handlePointerOver = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('[data-sound="hover"]')) playSFX("hover");
    };
    
    const handlePointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('[data-sound="click"]')) playSFX("click");
    };

    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return null; // Invisible logical component
}

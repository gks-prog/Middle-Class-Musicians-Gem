"use client";

import { useEffect } from "react";
import { initAudio, playSFX } from "@/lib/audio";

export default function AudioEngine() {
  useEffect(() => {
    // Unlock audio context on first interaction
    const unlockEvents = ["pointerdown", "keydown"];
    unlockEvents.forEach((evt) => document.addEventListener(evt, initAudio, { once: true }));

    // Global event delegates for UI sound triggers
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

"use client";

import { useEffect } from "react";
import { initAudio, playSFX } from "@/lib/audio";

export default function AudioEngine() {
  useEffect(() => {
    let lastHoverTarget: Element | null = null;
    // Unlock audio context on first interaction
    const unlockEvents = ["pointerdown", "keydown"];
    unlockEvents.forEach((evt) => document.addEventListener(evt, initAudio, { once: true }));

    // Global event delegates for UI sound triggers
    const handlePointerOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest('[data-sound="hover"]');
      if (target && target !== lastHoverTarget) {
        lastHoverTarget = target;
        playSFX("hover");
      }
    };
    const handlePointerOut = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest('[data-sound="hover"]');
      if (target && !(e.relatedTarget as HTMLElement | null)?.closest?.('[data-sound="hover"]')) lastHoverTarget = null;
    };
    const handlePointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('[data-sound="click"]')) playSFX("click");
    };

    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointerout", handlePointerOut);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return null; // Invisible logical component
}

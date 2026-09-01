"use client";

import { useEffect } from "react";
import { initAudio, playSFX } from "@/lib/audio";

const SOUND_KEY = "mcm-sound-enabled";

export default function AudioEngine() {
  useEffect(() => {
    let enabled = window.localStorage.getItem(SOUND_KEY) === "true";
    let lastTarget: Element | null = null;
    let lastPlayedAt = 0;

    const handleSoundChange = (event: Event) => {
      enabled = Boolean((event as CustomEvent<boolean>).detail);
      if (enabled) initAudio();
    };

    const handlePointerOver = (event: PointerEvent) => {
      if (!enabled || event.pointerType === "touch") return;
      const target = (event.target as HTMLElement).closest('[data-sound="hover"]');
      const now = performance.now();
      if (!target || target === lastTarget || now - lastPlayedAt < 90) return;
      lastTarget = target;
      lastPlayedAt = now;
      playSFX("hover");
    };

    const handlePointerOut = (event: PointerEvent) => {
      const target = (event.target as HTMLElement).closest('[data-sound="hover"]');
      if (target === lastTarget && !target?.contains(event.relatedTarget as Node)) lastTarget = null;
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (enabled && (event.target as HTMLElement).closest('[data-sound="click"]')) playSFX("click");
    };

    window.addEventListener("mcm:sound-change", handleSoundChange);
    document.addEventListener("pointerover", handlePointerOver, { passive: true });
    document.addEventListener("pointerout", handlePointerOut, { passive: true });
    document.addEventListener("pointerdown", handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener("mcm:sound-change", handleSoundChange);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return null;
}

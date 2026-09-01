"use client";

import { useEffect, useState } from "react";
import { initAudio, playSFX } from "@/lib/audio";

const SOUND_KEY = "mcm-sound-enabled";

export default function SoundToggle({ compact = false }: { compact?: boolean }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const syncTimer = window.setTimeout(() => setEnabled(window.localStorage.getItem(SOUND_KEY) === "true"), 0);
    return () => window.clearTimeout(syncTimer);
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    window.localStorage.setItem(SOUND_KEY, String(next));
    window.dispatchEvent(new CustomEvent("mcm:sound-change", { detail: next }));
    if (next) {
      initAudio();
      playSFX("click");
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={`Turn interface sound ${enabled ? "off" : "on"}`}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400 transition hover:border-[#d4a857]/50 hover:text-white ${
        compact ? "w-11 px-0" : "px-4"
      }`}
    >
      <span aria-hidden="true">{enabled ? "◖))" : "◖×"}</span>
      {!compact && <span>Sound {enabled ? "on" : "off"}</span>}
    </button>
  );
}

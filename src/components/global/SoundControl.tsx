"use client";

import { useEffect, useState } from "react";
import { initAudio, setSoundEnabled } from "@/lib/audio";

export default function SoundControl() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("mcm-sound");
    const defaultEnabled = saved === "on" ? true : saved === "off" ? false : !window.matchMedia("(max-width: 767px)").matches;
    setEnabled(defaultEnabled);
    setSoundEnabled(defaultEnabled);
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    setSoundEnabled(next);
    localStorage.setItem("mcm-sound", next ? "on" : "off");
    if (next) initAudio();
  };

  return <button onClick={toggle} aria-pressed={enabled} aria-label={enabled ? "Mute interface sounds" : "Enable interface sounds"} title={enabled ? "Mute sounds" : "Enable sounds"} className="fixed bottom-24 right-7 z-40 w-11 h-11 rounded-full border border-white/10 bg-[#0c0c10]/90 backdrop-blur text-xs text-gray-400 hover:text-[#d4a857] hover:border-[#d4a857]/40 transition-colors">{enabled ? "SFX" : "MUTE"}</button>;
}

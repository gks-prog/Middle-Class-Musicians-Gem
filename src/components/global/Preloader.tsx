"use client";

import { useEffect, useState } from "react";

const SEEN_KEY = "mcm-intro-seen";

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem(SEEN_KEY)) {
      const skipTimer = window.setTimeout(() => setIsVisible(false), 0);
      return () => window.clearTimeout(skipTimer);
    }

    window.sessionStorage.setItem(SEEN_KEY, "true");
    const leaveTimer = window.setTimeout(() => setIsLeaving(true), 850);
    const removeTimer = window.setTimeout(() => setIsVisible(false), 1250);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  const dismiss = () => {
    setIsLeaving(true);
    window.setTimeout(() => setIsVisible(false), 350);
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={dismiss}
      aria-label="Enter Middle Class Musicians website"
      className={`fixed inset-0 z-[9999] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-[#07070a] px-6 transition duration-500 ${
        isLeaving ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,168,87,0.1),transparent_52%)]" />
      <span className="relative z-10 flex w-full flex-col items-center gap-6 text-center">
        <span className="flex h-12 items-end justify-center gap-1.5 md:h-14" aria-hidden="true">
          {[0.72, 0.9, 0.62, 1.1, 0.78, 1, 0.66, 0.86, 0.74].map((duration, index) => (
            <span
              key={index}
              className="eq-bar block h-full w-1.5 origin-bottom rounded-t-sm bg-[#d4a857] shadow-[0_0_12px_rgba(212,168,87,0.55)] md:w-2"
              style={{ animationDuration: `${duration}s`, animationDelay: `${index * -0.07}s` }}
            />
          ))}
        </span>
        <span className="font-head text-3xl uppercase leading-tight tracking-[0.14em] text-white text-glow md:text-5xl md:tracking-[0.22em] lg:text-6xl">
          Middle Class <span className="text-[#d4a857]">Musicians</span>
        </span>
        <span className="text-[9px] uppercase tracking-[0.35em] text-gray-500 md:text-[10px]">
          Tap to enter
        </span>
      </span>
    </button>
  );
}

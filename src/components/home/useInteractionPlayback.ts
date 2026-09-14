"use client";

import { useEffect, useRef, useState } from "react";

export const PLAYBACK_DELAY = 3000;

/** Motion resumes after three quiet seconds; held touch and keyboard focus keep it paused. */
export function useInteractionPlayback() {
  const [activity, setActivity] = useState(0);
  const [idle, setIdle] = useState(true);
  const [held, setHeld] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [hidden, setHidden] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interact = () => {
    setIdle(false);
    setActivity((count) => count + 1);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setIdle(true), PLAYBACK_DELAY);
  };
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motion = () => setReduced(media.matches);
    const visibility = () => { setHidden(document.hidden); setHeld(false); };
    const release = () => setHeld(false);
    motion(); visibility();
    media.addEventListener("change", motion);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      media.removeEventListener("change", motion);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
  }, []);
  const blocked = held || focused || reduced || hidden;
  return {
    activity, blocked, paused: blocked || !idle, interact,
    interactionProps: {
      onPointerEnter: interact,
      onPointerMove: interact,
      onPointerLeave: interact,
      onPointerDown: () => { setHeld(true); interact(); },
      onPointerUp: () => { setHeld(false); interact(); },
      onPointerCancel: () => { setHeld(false); interact(); },
      onWheel: interact,
      onKeyDown: interact,
      onFocusCapture: (event: React.FocusEvent<HTMLElement>) => {
        // A mouse click must not latch the slideshow off until a later blur.
        setFocused(event.target.matches(":focus-visible"));
        interact();
      },
      onBlurCapture: (event: React.FocusEvent<HTMLElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) { setFocused(false); interact(); }
      },
    },
  };
}

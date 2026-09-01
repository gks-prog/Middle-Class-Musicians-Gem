"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

type Song = { title: string; raw: string; final: string };

const songs: Song[] = [
  { title: "Song 01", raw: "/audio/song-01-raw.mp3", final: "/audio/song-01-final.mp3" },
  { title: "Song 02", raw: "/audio/song-02-raw.mp3", final: "/audio/song-02-final.mp3" },
  { title: "Song 03", raw: "/audio/song-03-raw.mp3", final: "/audio/song-03-final.mp3" },
];

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;
};

export default function PortfolioPage() {
  const container = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const resumeAtRef = useRef(0);
  const resumePlaybackRef = useRef(false);
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const [mix, setMix] = useState<"raw" | "final">("final");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(".anim-text", { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power4.out" });
      gsap.fromTo(".song-card", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: "power3.out" });
    });
    return () => media.revert();
  }, { scope: container });

  const currentAudio = activeSong ? (mix === "raw" ? activeSong.raw : activeSong.final) : "";

  const closePlayer = useCallback(() => {
    audioRef.current?.pause();
    resumeAtRef.current = 0;
    resumePlaybackRef.current = false;
    setIsPlaying(false);
    setActiveSong(null);
    setCurrentTime(0);
    setDuration(0);
    setAudioError(false);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeSong) return;

    const update = () => {
      setCurrentTime(audio.currentTime || 0);
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };
    const loaded = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      if (resumeAtRef.current > 0) audio.currentTime = Math.min(resumeAtRef.current, Math.max(0, audio.duration - 0.1));
      if (resumePlaybackRef.current) void audio.play().catch(() => setIsPlaying(false));
    };
    const ended = () => setIsPlaying(false);
    const failed = () => {
      setAudioError(true);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("durationchange", update);
    audio.addEventListener("loadedmetadata", loaded);
    audio.addEventListener("ended", ended);
    audio.addEventListener("error", failed);
    audio.load();

    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("durationchange", update);
      audio.removeEventListener("loadedmetadata", loaded);
      audio.removeEventListener("ended", ended);
      audio.removeEventListener("error", failed);
    };
  }, [activeSong, currentAudio]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && activeSong) closePlayer();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [activeSong, closePlayer]);

  const openPlayer = (song: Song) => {
    const sameSong = activeSong?.title === song.title;
    if (sameSong) {
      togglePlay();
      return;
    }
    resumeAtRef.current = 0;
    resumePlaybackRef.current = true;
    setAudioError(false);
    setCurrentTime(0);
    setDuration(0);
    setMix("final");
    setActiveSong(song);
  };

  const switchMix = (nextMix: "raw" | "final") => {
    const audio = audioRef.current;
    if (!activeSong || nextMix === mix) return;
    resumeAtRef.current = audio?.currentTime || 0;
    resumePlaybackRef.current = Boolean(audio && !audio.paused);
    setAudioError(false);
    setMix(nextMix);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || audioError) return;
    if (audio.paused) {
      void audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  };

  const seek = (nextTime: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  return (
    <div ref={container} className={`container mx-auto min-h-screen px-5 pb-32 pt-32 sm:px-6 sm:pt-40 ${activeSong ? "pb-64 md:pb-52" : ""}`}>
      <header className="mb-16 border-l-4 border-gold pl-5 sm:mb-20 sm:pl-6">
        <h1 className="font-head text-5xl leading-none text-gray-500 sm:text-7xl lg:text-8xl">
          <span className="anim-text block text-white">Expressing.</span>
          <span className="anim-text block text-gray-300">Experimenting.</span>
          <span className="anim-text block text-gold text-glow">Executing.</span>
        </h1>
        <p className="anim-text mt-6 max-w-xl text-sm leading-7 text-gray-400">
          Select a song, then switch between Raw and Final without losing your position. Raw is the untreated recording; Final is the mixed and mastered result.
        </p>
      </header>

      <section className="mx-auto max-w-5xl" aria-labelledby="selected-work-title">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gray-500">Audio Portfolio</p>
            <h2 id="selected-work-title" className="font-head text-3xl text-white sm:text-4xl">Selected Work</h2>
          </div>
          <span className="hidden rounded-full border border-white/10 px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-gray-500 sm:block">Matched A/B playback</span>
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {songs.map((song, index) => {
            const isActive = activeSong?.title === song.title;
            return (
              <button
                type="button"
                key={song.title}
                onClick={() => openPlayer(song)}
                aria-pressed={isActive}
                className={`song-card group flex min-h-24 w-full items-center gap-4 py-5 text-left transition-all duration-300 sm:gap-5 sm:py-6 sm:hover:px-4 ${isActive ? "px-3 bg-white/[0.025]" : ""}`}
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs transition-colors ${isActive ? "border-gold bg-gold text-black" : "border-white/10 text-gray-500 group-hover:border-gold group-hover:text-gold"}`}>
                  {isActive && isPlaying ? "Ⅱ" : String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-head text-xl text-white transition-colors group-hover:text-gold sm:text-2xl">{song.title}</span>
                  <span className="mt-1 block text-[9px] uppercase tracking-[0.18em] text-gray-600 sm:text-[10px]">Full Song · Raw + Final</span>
                </span>
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-gray-600 transition-colors group-hover:text-white sm:text-xs">{isActive ? (isPlaying ? "Pause" : "Resume") : "Listen →"}</span>
              </button>
            );
          })}
        </div>
      </section>

      {activeSong && (
        <aside className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5 md:px-8" aria-label="Global audio player">
          <div className="pointer-events-auto mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0e]/95 shadow-2xl shadow-black/60 backdrop-blur-xl">
            <div className="relative h-2 bg-white/5">
              <div className="h-full bg-gold transition-[width] duration-150" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={Math.min(currentTime, duration || 0)}
                onChange={(event) => seek(Number(event.target.value))}
                aria-label="Seek through song"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </div>

            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 pb-3 pt-4 sm:gap-4 md:grid-cols-[auto_minmax(0,1fr)_auto_auto_auto] md:px-6 md:py-4">
              <button type="button" onClick={togglePlay} disabled={audioError} aria-label={isPlaying ? "Pause" : "Play"} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-40">
                {isPlaying ? "Ⅱ" : "▶"}
              </button>

              <div className="min-w-0">
                <p className="mb-1 text-[8px] uppercase tracking-[0.24em] text-gray-600 sm:text-[9px]">Now Playing</p>
                <h3 className="truncate text-sm font-bold text-white md:text-base">{activeSong.title}</h3>
                <p className={`mt-1 text-[9px] uppercase tracking-widest ${audioError ? "text-red-400" : "text-gray-500"}`} aria-live="polite">
                  {audioError ? "This preview is not available yet" : mix === "raw" ? "Raw · No FX" : "Final · Mixed + Mastered"}
                </p>
              </div>

              <div className="hidden text-[10px] font-mono text-gray-600 md:block">{formatTime(currentTime)} / {formatTime(duration)}</div>

              <button type="button" onClick={closePlayer} aria-label="Close player" className="col-start-3 row-start-1 flex h-9 w-9 shrink-0 items-center justify-center text-xl text-gray-600 transition-colors hover:text-white md:col-start-5">×</button>

              <div className="col-span-3 row-start-2 flex rounded-xl border border-white/10 bg-black/50 p-1 md:col-span-1 md:col-start-4 md:row-start-1 md:mx-1">
                <button type="button" onClick={() => switchMix("raw")} aria-pressed={mix === "raw"} className={`min-h-10 flex-1 rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all md:flex-none ${mix === "raw" ? "bg-gold text-black" : "text-gray-500 hover:text-white"}`}>
                  Raw
                </button>
                <button type="button" onClick={() => switchMix("final")} aria-pressed={mix === "final"} className={`min-h-10 flex-1 rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all md:flex-none ${mix === "final" ? "bg-gold text-black" : "text-gray-500 hover:text-white"}`}>
                  Final
                </button>
              </div>
            </div>
            <audio ref={audioRef} src={currentAudio} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} preload="metadata" />
          </div>
        </aside>
      )}
    </div>
  );
}

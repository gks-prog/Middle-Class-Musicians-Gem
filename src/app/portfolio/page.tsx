"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

type Song = { title: string; raw: string; final: string };

const songs: Song[] = [
  { title: "Song 01", raw: "/audio/song-01-raw.mp3", final: "/audio/song-01-final.mp3" },
  { title: "Song 02", raw: "/audio/song-02-raw.mp3", final: "/audio/song-02-final.mp3" },
  { title: "Song 03", raw: "/audio/song-03-raw.mp3", final: "/audio/song-03-final.mp3" },
];

export default function PortfolioPage() {
  const container = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const [mix, setMix] = useState<"raw" | "final">("final");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useGSAP(() => {
    gsap.fromTo(".anim-text", { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power4.out" });
    gsap.fromTo(".song-card", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out" });
  }, { scope: container });

  const currentAudio = activeSong ? (mix === "raw" ? activeSong.raw : activeSong.final) : "";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    const ended = () => setIsPlaying(false);
    audio.addEventListener("timeupdate", update);
    audio.addEventListener("ended", ended);
    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("ended", ended);
    };
  }, [activeSong, mix]);

  const openPlayer = (song: Song) => {
    setActiveSong(song);
    setMix("final");
    setIsPlaying(true);
    requestAnimationFrame(() => requestAnimationFrame(() => void audioRef.current?.play().catch(() => setIsPlaying(false))));
  };

  const switchMix = (nextMix: "raw" | "final") => {
    if (!activeSong) return;
    const wasPlaying = !audioRef.current?.paused;
    setMix(nextMix);
    requestAnimationFrame(() => {
      if (wasPlaying) void audioRef.current?.play().catch(() => undefined);
    });
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const closePlayer = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
    setActiveSong(null);
    setProgress(0);
  };

  return (
    <div ref={container} className="pt-32 pb-32 container mx-auto px-6 min-h-screen">
      <div className="mb-20 border-l-4 border-gold pl-6">
        <h1 className="text-5xl md:text-7xl font-head leading-none text-gray-500">
          <span className="anim-text block text-white">Expressing.</span>
          <span className="anim-text block text-gray-300">Experimenting.</span>
          <span className="anim-text block text-gold">Executing.</span>
        </h1>
      </div>

      {/* Songs only — player opens after a song is selected */}
      <section className="max-w-5xl mx-auto">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">Audio Portfolio</p>
          <h2 className="text-3xl md:text-4xl font-head text-white">Selected Work</h2>
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {songs.map((song, index) => (
            <button
              key={song.title}
              onClick={() => openPlayer(song)}
              className="song-card w-full group flex items-center gap-5 py-6 text-left hover:px-4 transition-all duration-300"
            >
              <span className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-xs text-gray-500 group-hover:border-gold group-hover:text-gold transition-colors">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-head text-white group-hover:text-gold transition-colors">{song.title}</h3>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 mt-1">Full Song • Raw + Final</p>
              </div>
              <span className="text-xs uppercase tracking-widest text-gray-600 group-hover:text-white transition-colors">Listen →</span>
            </button>
          ))}
        </div>
      </section>

      {/* Global floating player */}
      {activeSong && (
        <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 md:px-8 pointer-events-none">
          <div className="pointer-events-auto max-w-5xl mx-auto rounded-2xl bg-[#0b0b0e]/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
            <div className="h-1 bg-white/5">
              <div className="h-full bg-gold transition-[width] duration-200" style={{ width: `${progress}%` }} />
            </div>
            <div className="px-4 py-4 md:px-6 flex items-center gap-4">
              <button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"} className="w-11 h-11 shrink-0 rounded-full bg-white text-black flex items-center justify-center hover:bg-gold transition-colors">
                {isPlaying ? "Ⅱ" : "▶"}
              </button>

              <div className="min-w-0 flex-1">
                <p className="text-[9px] uppercase tracking-[0.25em] text-gray-600 mb-1">Now Playing</p>
                <h3 className="text-sm md:text-base font-bold text-white truncate">{activeSong.title}</h3>
                <p className="text-[9px] uppercase tracking-widest text-gray-500 mt-1">{mix === "raw" ? "Raw • No FX" : "Final • Mixed + Mastered"}</p>
              </div>

              {/* Floating Raw / Final controls */}
              <div className="flex rounded-xl border border-white/10 bg-black/50 p-1 shrink-0">
                <button onClick={() => switchMix("raw")} aria-pressed={mix === "raw"} className={`px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all ${mix === "raw" ? "bg-gold text-black" : "text-gray-500 hover:text-white"}`}>
                  Raw
                </button>
                <button onClick={() => switchMix("final")} aria-pressed={mix === "final"} className={`px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all ${mix === "final" ? "bg-gold text-black" : "text-gray-500 hover:text-white"}`}>
                  Final
                </button>
              </div>

              <button onClick={closePlayer} aria-label="Close player" className="w-8 h-8 shrink-0 text-gray-600 hover:text-white text-xl transition-colors">×</button>
            </div>
            <audio ref={audioRef} key={`${activeSong.title}-${mix}`} src={currentAudio} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} preload="metadata" />
          </div>
        </div>
      )}
    </div>
  );
}

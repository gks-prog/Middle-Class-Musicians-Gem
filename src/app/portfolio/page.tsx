"use client";

import { useRef, useState } from "react";
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
  const [activeSong, setActiveSong] = useState(0);
  const [mix, setMix] = useState<"raw" | "final">("final");

  useGSAP(() => {
    gsap.fromTo(".anim-text", { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power4.out" });
  }, { scope: container });

  const currentSong = songs[activeSong];
  const currentAudio = mix === "raw" ? currentSong.raw : currentSong.final;

  const selectMix = (nextMix: "raw" | "final") => {
    setMix(nextMix);
    requestAnimationFrame(() => {
      if (audioRef.current) {
        audioRef.current.load();
        void audioRef.current.play().catch(() => undefined);
      }
    });
  };

  return (
    <div ref={container} className="pt-32 pb-20 container mx-auto px-6">
      <div className="mb-20 border-l-4 border-gold pl-6">
        <h1 className="text-5xl md:text-7xl font-head leading-none text-gray-500">
          <span className="anim-text block text-white">Expressing.</span>
          <span className="anim-text block text-gray-300">Experimenting.</span>
          <span className="anim-text block text-gold">Executing.</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-2xl bg-surface border border-white/10 min-h-[500px] p-8 flex flex-col justify-center">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">Audio Portfolio</p>
            <h2 className="text-3xl md:text-4xl font-head text-white">{currentSong.title}</h2>
            <p className="text-sm text-gray-500 mt-2">{mix === "raw" ? "Raw recording — no FX" : "Final mix — fully mixed & mastered"}</p>
          </div>
          <audio ref={audioRef} key={`${activeSong}-${mix}`} className="w-full" controls preload="metadata">
            <source src={currentAudio} type="audio/mpeg" />
            Your browser does not support the audio player.
          </audio>
          <div className="mt-8 flex flex-wrap gap-3">
            {songs.map((song, index) => (
              <button key={song.title} onClick={() => setActiveSong(index)} className={`px-4 py-2 rounded border text-xs uppercase tracking-widest transition-colors ${activeSong === index ? "border-gold text-gold bg-gold/10" : "border-white/10 text-gray-500 hover:text-white hover:border-white/20"}`}>
                {song.title}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-surface border border-white/10 h-full flex flex-col justify-center">
            <h3 className="text-xl font-head mb-2">Raw vs Final</h3>
            <p className="text-xs text-gray-500 mb-5">Compare the untouched recording with the finished master.</p>
            <div className="w-full h-16 bg-black rounded border border-white/5 mb-5 relative overflow-hidden">
              <div className={`absolute inset-y-0 left-0 bg-gold/20 transition-all duration-300 ${mix === "raw" ? "w-1/3" : "w-full"}`} />
              <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.25em] text-gray-500">
                {mix === "raw" ? "RAW / NO FX" : "FINAL / MIX + MASTER"}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => selectMix("raw")} aria-pressed={mix === "raw"} className={`py-3 rounded text-sm uppercase tracking-widest border transition-colors ${mix === "raw" ? "bg-gold text-black border-gold" : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"}`}>Raw</button>
              <button onClick={() => selectMix("final")} aria-pressed={mix === "final"} className={`py-3 rounded text-sm uppercase tracking-widest border transition-colors ${mix === "final" ? "bg-gold text-black border-gold" : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"}`}>Final</button>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-surface border border-white/10 flex-grow">
            <h3 className="text-xl font-head mb-4">Categories</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="hover:text-gold cursor-pointer transition-colors">→ Full Songs</li>
              <li className="hover:text-gold cursor-pointer transition-colors">→ Beat Production</li>
              <li className="hover:text-gold cursor-pointer transition-colors">→ Mix & Master</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

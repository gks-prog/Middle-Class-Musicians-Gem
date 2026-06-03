"use client";

import { useEffect, useState } from "react";
import { playSFX } from "@/lib/audio";

const SYMBOLS = ["♪", "♫", "♩", "♬"];
const FREQUENCIES = [329.63, 392.00, 440.00, 523.25, 659.25]; // E4, G4, A4, C5, E5 (Pentatonic Scale)

export default function FloatingNotes() {
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    // Generate notes only on the client to prevent hydration mismatch
    const generatedNotes = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      left: `${Math.random() * 100}vw`,
      duration: `${Math.random() * 15 + 15}s`, // 15s to 30s float time
      delay: `${Math.random() * 20}s`,
      size: `${Math.random() * 1.5 + 0.8}rem`,
      freq: FREQUENCIES[Math.floor(Math.random() * FREQUENCIES.length)]
    }));
    setNotes(generatedNotes);
  }, []);

  if (notes.length === 0) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden mix-blend-screen opacity-40">
      {notes.map((note) => (
        <div
          key={note.id}
          className="absolute bottom-[-50px] floating-note pointer-events-auto cursor-crosshair text-glow"
          style={{
            left: note.left,
            fontSize: note.size,
            animationDuration: note.duration,
            animationDelay: note.delay,
            color: "rgba(212, 168, 87, 0.4)",
          }}
          onMouseEnter={() => playSFX("note", note.freq)}
        >
          {note.symbol}
        </div>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { playSFX } from "@/lib/audio";

const SYMBOLS = ["♪", "♫", "♩", "♬"];
const FREQUENCIES = [329.63, 392.00, 440.00, 523.25, 659.25]; // Pentatonic Scale

export default function FloatingNotes() {
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    const generatedNotes = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      left: `${Math.random() * 95}vw`, // Keep within screen bounds
      duration: `${Math.random() * 20 + 15}s`, // Slower, more elegant 15-35s duration
      delay: `${Math.random() * 10}s`, // Staggered entrances
      size: `${Math.random() * 1.5 + 1}rem`,
      freq: FREQUENCIES[Math.floor(Math.random() * FREQUENCIES.length)]
    }));
    setNotes(generatedNotes);
  }, []);

  if (notes.length === 0) return null;

  return (
    <div className="fixed inset-0 z-30 pointer-events-none overflow-hidden mix-blend-screen">
      {notes.map((note) => (
        <div
          key={note.id}
          className="absolute bottom-[-100px] floating-note pointer-events-auto cursor-crosshair text-glow"
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

const notes = [
  { symbol: "♪", left: "7%", duration: "24s", delay: "-8s", size: "1.1rem" },
  { symbol: "♫", left: "18%", duration: "31s", delay: "-17s", size: "1.4rem" },
  { symbol: "♩", left: "31%", duration: "28s", delay: "-4s", size: "1rem" },
  { symbol: "♬", left: "44%", duration: "35s", delay: "-22s", size: "1.3rem" },
  { symbol: "♪", left: "58%", duration: "26s", delay: "-12s", size: "1.05rem" },
  { symbol: "♫", left: "70%", duration: "33s", delay: "-20s", size: "1.5rem" },
  { symbol: "♩", left: "81%", duration: "29s", delay: "-6s", size: "1.2rem" },
  { symbol: "♬", left: "91%", duration: "37s", delay: "-25s", size: "1rem" },
];

export default function FloatingNotes() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden mix-blend-screen" aria-hidden="true">
      {notes.map((note, index) => (
        <span
          key={`${note.symbol}-${index}`}
          className="floating-note absolute bottom-[-100px] text-glow"
          style={{
            left: note.left,
            fontSize: note.size,
            animationDuration: note.duration,
            animationDelay: note.delay,
            color: "rgba(212, 168, 87, 0.26)",
          }}
        >
          {note.symbol}
        </span>
      ))}
    </div>
  );
}

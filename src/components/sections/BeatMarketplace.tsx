'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const BEATS = [
  { id: '01', title: 'NOCTURNE', bpm: 124, genre: 'Dark Trap', price: '$49' },
  { id: '02', title: 'ELEVATE', bpm: 140, genre: 'Cinematic Drill', price: '$49' },
  { id: '03', title: 'SILK', bpm: 95, genre: 'Alternative R&B', price: '$35' },
]

export default function BeatMarketplace() {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.beat-row',
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          stagger: 0.1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: listRef.current,
            start: 'top 80%',
          }
        }
      )
    }, listRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="py-32 px-[5vw] bg-background text-foreground">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-sm tracking-[0.2em] uppercase text-gray-500 mb-16">Audio Architecture</h2>
        
        <ul ref={listRef} className="flex flex-col border-t border-accent">
          {BEATS.map((beat) => (
            <li 
              key={beat.id} 
              className="beat-row group flex items-center justify-between py-6 border-b border-accent hover:bg-accent/10 transition-colors duration-500 cursor-pointer"
            >
              <div className="flex items-center gap-8 w-1/3">
                <span className="text-xs text-gray-600 font-mono">{beat.id}</span>
                <button className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center group-hover:border-foreground group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                  ▶
                </button>
                <h3 className="text-xl font-medium tracking-tight">{beat.title}</h3>
              </div>

              <div className="hidden md:flex flex-1 justify-center opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                {/* Simulated CSS Waveform for performance */}
                <div className="flex items-end gap-[2px] h-8">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="w-[2px] bg-foreground" style={{ height: `${Math.random() * 100}%` }} />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-12 w-1/3 text-sm text-gray-400">
                <span className="hidden lg:block">{beat.bpm} BPM</span>
                <span className="hidden md:block">{beat.genre}</span>
                <span className="text-foreground font-medium">{beat.price}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

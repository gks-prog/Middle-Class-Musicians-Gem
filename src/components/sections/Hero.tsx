'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cinematic Intro Sequence
      gsap.fromTo('.reveal-text', 
        { y: 100, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.8, stagger: 0.15, ease: 'power4.out', delay: 0.2 }
      )

      // Parallax Background
      gsap.to(bgRef.current, {
        y: '25%',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden flex items-end pb-[10vh] px-[5vw]">
      {/* Background Layer */}
      <div 
        ref={bgRef} 
        className="absolute inset-0 z-0 bg-[url('/cinematic-studio.jpg')] bg-cover bg-center opacity-30 scale-105"
      />
      
      {/* Gradient Mask */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/60 to-transparent" />

      {/* Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col gap-6">
        <p className="reveal-text text-xs md:text-sm tracking-[0.3em] uppercase text-muted">
          Creative Director & Producer
        </p>
        <h1 className="font-editorial text-[clamp(4rem,10vw,12rem)] leading-[0.8] tracking-tighter uppercase">
          <span className="block overflow-hidden"><span className="block reveal-text">Wenon</span></span>
          <span className="block overflow-hidden"><span className="block reveal-text">Bont.</span></span>
        </h1>
        <div className="reveal-text flex gap-4 mt-8">
          <button className="px-8 py-4 bg-foreground text-background rounded-full hover:scale-105 transition-transform duration-500 ease-cinematic text-sm font-medium tracking-wide uppercase">
            Enter the Studio
          </button>
        </div>
      </div>
    </section>
  )
}

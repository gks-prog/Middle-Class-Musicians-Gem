'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Load animation
      gsap.fromTo('.reveal-text', 
        { y: 100, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.5, stagger: 0.1, ease: 'power4.out', delay: 0.2 }
      )

      // Parallax scroll
      gsap.to(bgRef.current, {
        y: '30%',
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
      {/* Background Media */}
      <div 
        ref={bgRef} 
        className="absolute inset-0 z-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-40 scale-105"
      />
      
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/50 to-transparent" />

      {/* Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col gap-6">
        <p className="reveal-text text-sm md:text-base tracking-[0.2em] uppercase text-gray-400">
          Sound Architect & Visionary
        </p>
        <h1 ref={titleRef} className="font-editorial text-[clamp(3rem,8vw,10rem)] leading-[0.85] tracking-tighter">
          <span className="block overflow-hidden"><span className="block reveal-text">WENON</span></span>
          <span className="block overflow-hidden"><span className="block reveal-text">BONT.</span></span>
        </h1>
        <div className="reveal-text flex gap-4 mt-8">
          <button className="px-8 py-4 bg-foreground text-background rounded-full hover:scale-105 transition-transform duration-500 ease-cinematic text-sm font-medium tracking-wide">
            Explore Sounds
          </button>
        </div>
      </div>
    </section>
  )
}

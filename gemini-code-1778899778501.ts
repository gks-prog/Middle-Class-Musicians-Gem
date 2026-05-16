// src/components/layout/SmoothScroll.tsx
'use client'

import { ReactLenis } from '@studio-freight/react-lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    function update(time: number) {
      gsap.ticker.tick(time * 1000)
    }
    gsap.ticker.add(update)
    return () => gsap.ticker.remove(update)
  }, [])

  return (
    <ReactLenis root options={{ lerp: 0.05, smoothWheel: true }}>
      {children}
    </ReactLenis>
  )
}
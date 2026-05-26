"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";

export default function LoginPage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(".gsap-reveal", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" }
    );
  }, { scope: container });

  return (
    <div ref={container} className="min-h-screen flex items-center justify-center pt-20 px-6">
      <div className="w-full max-w-md p-10 rounded-3xl bg-[#15151c] border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#d4a857]/10 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
        
        <div className="relative z-10 text-center mb-10 gsap-reveal">
          <Link href="/" className="inline-block font-head text-3xl tracking-widest mb-2">
            <span className="text-[#d4a857]">MCM</span> PORTAL
          </Link>
          <p className="text-gray-400 text-sm">Sign in to access courses, track projects, and join the community discussion.</p>
        </div>

        <form className="relative z-10 flex flex-col gap-5 gsap-reveal">
          <div>
            <label className="block font-head text-xs tracking-widest text-gray-400 mb-2 uppercase">Email</label>
            <input type="email" placeholder="artist@domain.com" className="w-full bg-[#07070a] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#d4a857] transition-colors" />
          </div>
          <div>
            <label className="block font-head text-xs tracking-widest text-gray-400 mb-2 uppercase">Password</label>
            <input type="password" placeholder="••••••••" className="w-full bg-[#07070a] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#d4a857] transition-colors" />
          </div>
          
          <button type="button" className="w-full py-4 mt-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-[#d4a857] transition-colors">
            Enter Portal
          </button>
        </form>

        <div className="mt-8 text-center gsap-reveal">
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            Don't have an account? <span className="text-[#d4a857] cursor-pointer hover:text-white">Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import StudioTalk from "@/components/community/StudioTalk";

export default function BlogsPage() {
  const container = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.from(".blog-anim", { y: 36, opacity: 0, duration: 0.85, stagger: 0.09, ease: "power3.out", clearProps: "all" });
  }, { scope: container });

  return <div ref={container} className="min-h-screen pb-32 pt-32">
    <section className="container mx-auto mb-24 max-w-3xl px-6 text-center"><span className="blog-anim mb-4 block font-head text-sm uppercase tracking-[0.2em] text-[#d4a857]">Insights & Knowledge</span><h1 className="blog-anim mb-6 font-head text-5xl leading-none md:text-7xl">The MCM <span className="text-[#d4a857]">Journal.</span></h1><p className="blog-anim text-lg text-gray-400">Select a discipline for specialized insights, or join the live studio discussion below.</p></section>
    <section className="container mx-auto mb-32 max-w-5xl px-6"><div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <JournalCard href="/blogs/rappers" title="For Rappers">Vocal pacing, recording confidence, cohesive mixes and studio etiquette.</JournalCard>
      <JournalCard href="/blogs/producers" title="For Producers">Low-end theory, acoustic treatment, plugin myths and beat arrangements.</JournalCard>
    </div></section>
    <StudioTalk />
  </div>;
}

function JournalCard({ href, title, children }: { href: string; title: string; children: React.ReactNode }) {
  return <Link href={href} className="blog-anim group block rounded-3xl border border-white/5 bg-[#15151c] p-8 transition-all hover:border-[#d4a857]/50 sm:p-10"><span className="mb-6 inline-block rounded border border-white/10 bg-black px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#d4a857] transition-colors group-hover:bg-[#d4a857] group-hover:text-black">Discipline</span><h2 className="mb-4 font-head text-4xl text-white transition-colors group-hover:text-[#d4a857]">{title}</h2><p className="mb-8 text-sm leading-relaxed text-gray-400">{children}</p><span className="text-xs font-bold uppercase tracking-widest text-white/50 transition-colors group-hover:text-white">Read articles →</span></Link>;
}

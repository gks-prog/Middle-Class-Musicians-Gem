"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function ProducersBlog() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".anim-item", {
      y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out", clearProps: "all"
    });
  }, { scope: container });

  const articles = [
    {
      title: "Are expensive plugins necessary for industry-standard beats?",
      content: "No. Stock plugins can get you 90% there if your sound selection is elite. However, what separates bedroom beats from billboard records is acoustic treatment. You can't mix what you can't hear. Our MCM control room is acoustically calibrated so you hear the absolute truth of your low-end—meaning your 808s will knock exactly the same in a car or on AirPods."
    },
    {
      title: "Should beginners learn music theory?",
      content: "You don't need to read sheet music, but understanding scales and chord progressions separates beatmakers from producers. Knowing theory cuts your workflow time in half and prevents the dreaded 'beat block' when you are searching for the next melodic layer."
    },
    {
      title: "How to make 808s punch without clipping the master",
      content: "Stop turning the fader up. The secret to massive 808s is saturation, distortion, and subtractive EQ on the kick drum to prevent phase cancellation. Give the 808 space in the mix, don't force it."
    }
  ];

  return (
    <div ref={container} className="pt-32 pb-32 min-h-screen container mx-auto px-6 max-w-4xl">
      <Link href="/blogs" className="anim-item text-[#d4a857] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors mb-12 inline-block">
        ← Back to Directory
      </Link>

      <h1 className="anim-item text-5xl md:text-7xl font-head leading-none mb-4">The <span className="text-[#d4a857]">Producer's</span> Guide.</h1>
      <p className="anim-item text-gray-400 text-lg mb-16">Low-end theory, beat structuring, and sonic clarity.</p>

      <div className="space-y-12">
        {articles.map((article, idx) => (
          <article key={idx} className="anim-item border-l-2 border-[#d4a857]/30 pl-6 md:pl-10 py-2">
            <h2 className="text-3xl font-head mb-4 text-white">{article.title}</h2>
            <p className="text-gray-400 leading-relaxed">{article.content}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import StructuredData from "@/components/global/StructuredData";

export default function RappersBlog() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".anim-item", {
      y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out", clearProps: "all"
    });
  }, { scope: container });

  const articles = [
    {
      title: "Why do my vocals sound 'pasted' on top of the beat?",
      content: "This is the #1 mistake we hear. It happens when you use generic YouTube beats that lack headroom, combined with poor vocal compression. At MCM, we use dynamic EQ carving to create a 'pocket' in the beat's frequency spectrum specifically for your vocal tone, then glue them together with analog bus compression. The result is a track that sounds like a cohesive record, not karaoke."
    },
    {
      title: "How long does a professional recording session actually take?",
      content: "If you know your lyrics and flow, tracking lead vocals takes 1-2 hours. But a premium record requires ad-libs, harmonies, and dubs. We block our MCM sessions to ensure artists never feel rushed. We handle the technical setup flawlessly so you can focus entirely on your performance and delivery."
    },
    {
      title: "How to overcome 'Red Light Syndrome'",
      content: "Many rappers kill it in the car but freeze in the booth. The fix is preparation and environment. Memorize your lyrics to the point of muscle memory. At MCM, we manipulate the booth lighting and monitor mixes to make you feel like you are on stage, not taking a test."
    }
  ];

  return (
    <div ref={container} className="pt-32 pb-32 min-h-screen container mx-auto px-6 max-w-4xl">
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: articles.map((article) => ({
          "@type": "Question",
          name: article.title,
          acceptedAnswer: { "@type": "Answer", text: article.content },
        })),
      }} />
      <Link href="/blogs" className="anim-item text-[#d4a857] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors mb-12 inline-block">
        ← Back to Directory
      </Link>

      <h1 className="anim-item text-5xl md:text-7xl font-head leading-none mb-4">The <span className="text-[#d4a857]">Rapper’s</span> Guide.</h1>
      <p className="anim-item text-gray-400 text-lg mb-16">Vocal execution, session efficiency, and industry standards.</p>

      <div className="space-y-12">
        {articles.map((article, idx) => (
          <article key={idx} className="anim-item border-l-2 border-[#d4a857]/30 pl-6 md:pl-10 py-2" id={`answer-${idx + 1}`}>
            <h2 className="text-3xl font-head mb-4 text-white">{article.title}</h2>
            <p className="text-gray-400 leading-relaxed">{article.content}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

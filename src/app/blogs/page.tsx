"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function BlogsPage() {
  const container = useRef<HTMLDivElement>(null);
  const [comment, setComment] = useState("");
  const [commentsList, setCommentsList] = useState([
    { name: "DelhiDrillz", text: "That vocal mixing chain tip saved my latest track. Do you guys use analog gear for the final master?", time: "2 hours ago" },
    { name: "Vakta", text: "Beginners definitely need to learn basic theory. It cuts workflow time in half.", time: "5 hours ago" },
  ]);

  useGSAP(() => {
    gsap.fromTo(".gsap-reveal", 
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" }
    );
  }, { scope: container });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setCommentsList([{ name: "Guest User", text: comment, time: "Just now" }, ...commentsList]);
    setComment("");
    // TODO: Wire up Supabase insertion here
  };

  const articles = [
    { cat: "Production", title: "How to make beats sound professional?", excerpt: "Stop muddying your low-end. The secret to industry-standard 808s lies in sidechaining and proper EQ carving." },
    { cat: "Engineering", title: "How to mix rap vocals?", excerpt: "The 5-step vocal chain every modern rapper needs: Subtractive EQ, dual-compression, de-essing, additive EQ, and spatial effects." },
    { cat: "Songwriting", title: "How to write better lyrics?", excerpt: "Flow dictates the pocket. We break down how multi-syllabic rhyming and cadence switching keeps listeners engaged." },
    { cat: "Music Theory", title: "Should beginners learn music theory?", excerpt: "You don't need to read sheet music, but understanding scales and chord progressions separates beatmakers from producers." },
  ];

  return (
    <div ref={container} className="pt-32 pb-20">
      
      {/* Header & Filters */}
      <section className="container mx-auto px-6 mb-20 text-center">
        <span className="text-[#d4a857] font-head tracking-[0.2em] uppercase text-sm block mb-4 gsap-reveal">Editorial & Insights</span>
        <h1 className="text-5xl md:text-7xl font-head leading-none mb-10 gsap-reveal">The MCM <span className="text-[#d4a857]">Journal.</span></h1>
        
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 gsap-reveal">
          <input type="text" placeholder="Search articles..." className="flex-grow bg-[#15151c] border border-white/10 rounded-full px-6 py-3 text-white focus:outline-none focus:border-[#d4a857] transition-colors" />
          <div className="flex gap-2 justify-center">
            <button className="px-6 py-3 rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest">All</button>
            <button className="px-6 py-3 rounded-full bg-[#15151c] border border-white/10 text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">Producers</button>
            <button className="px-6 py-3 rounded-full bg-[#15151c] border border-white/10 text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">Rappers</button>
          </div>
        </div>
      </section>

      {/* Article Grid */}
      <section className="container mx-auto px-6 mb-32 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article, i) => (
            <div key={i} className="gsap-reveal group p-8 rounded-3xl bg-[#15151c] border border-white/5 hover:border-[#d4a857]/50 transition-colors cursor-pointer flex flex-col justify-between min-h-[300px]">
              <div>
                <span className="text-[#d4a857] text-xs font-bold uppercase tracking-widest mb-4 block">{article.cat}</span>
                <h3 className="text-3xl font-head mb-4 group-hover:text-white text-gray-200 transition-colors">{article.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{article.excerpt}</p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-xs font-semibold uppercase tracking-widest text-gray-500">
                <span>Read Article</span>
                <span className="group-hover:translate-x-2 transition-transform text-[#d4a857]">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community / Comment Section */}
      <section className="container mx-auto px-6 max-w-4xl">
        <div className="gsap-reveal bg-[#0c0c10] border border-white/10 rounded-3xl p-8 md:p-12">
          <h3 className="text-3xl font-head mb-2 text-[#d4a857]">Studio Talk</h3>
          <p className="text-gray-400 text-sm mb-10">Ask a production question, debate a mix, or drop feedback. The MCM community and our engineers are active here.</p>
          
          {/* Post Comment */}
          <form onSubmit={handleCommentSubmit} className="mb-12 flex flex-col gap-4">
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Join the discussion..." 
              rows={3}
              className="w-full bg-[#15151c] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#d4a857] transition-colors resize-none"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Supabase Ready</span>
              <button type="submit" className="px-8 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[#d4a857] transition-colors">
                Post Message
              </button>
            </div>
          </form>

          {/* Comment Feed */}
          <div className="space-y-6">
            {commentsList.map((c, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#15151c] border border-white/5">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#d4a857] text-black font-head flex items-center justify-center text-xl">{c.name.charAt(0)}</div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-200">{c.name}</h4>
                    <span className="text-xs text-gray-500">{c.time}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

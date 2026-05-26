"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { createClient } from "@/lib/supabase";

export default function BlogsPage() {
  const container = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const [user, setUser] = useState<any>(null);
  const [commentText, setCommentText] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  const [comments, setComments] = useState<any[]>([
    { id: 1, user_name: "DelhiDrillz", content: "That vocal mixing chain tip saved my latest track. Do you guys use analog gear for the final master?", created_at: new Date().toISOString() },
    { id: 2, user_name: "Vakta", content: "Beginners definitely need to learn basic theory. It cuts workflow time in half.", created_at: new Date().toISOString() }
  ]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.warn("Supabase auth check skipped.");
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkUser();
  }, []);

  useGSAP(() => {
    gsap.from(".blog-anim", {
      y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out", clearProps: "all"
    });
  }, { scope: container });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return router.push('/auth/login');
    if (!commentText.trim()) return;

    const newComment = { 
      id: Date.now(), 
      user_name: user.email?.split('@')[0] || "Artist", 
      content: commentText, 
      created_at: new Date().toISOString() 
    };
    
    setComments([newComment, ...comments]);
    setCommentText("");
  };

  return (
    <div ref={container} className="pt-32 pb-32 min-h-screen">
      
      {/* Header */}
      <section className="container mx-auto px-6 mb-24 text-center max-w-3xl">
        <span className="text-[#d4a857] font-head tracking-[0.2em] uppercase text-sm block mb-4 blog-anim">Insights & Knowledge</span>
        <h1 className="text-5xl md:text-7xl font-head leading-none mb-6 blog-anim">The MCM <span className="text-[#d4a857]">Journal.</span></h1>
        <p className="text-gray-400 text-lg blog-anim">Select a discipline to access specialized industry insights, or drop into the studio discussion below.</p>
      </section>

      {/* Directory Routing */}
      <section className="container mx-auto px-6 mb-32 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/blogs/rappers" className="blog-anim group block p-10 rounded-3xl bg-[#15151c] border border-white/5 hover:border-[#d4a857]/50 transition-all">
            <span className="inline-block px-3 py-1 bg-black border border-white/10 rounded text-[10px] font-bold uppercase tracking-widest text-[#d4a857] mb-6 group-hover:bg-[#d4a857] group-hover:text-black transition-colors">
              Discipline
            </span>
            <h3 className="text-4xl font-head mb-4 text-white group-hover:text-[#d4a857] transition-colors">For Rappers</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">Vocal pacing, overcoming recording anxiety, achieving the 'glued' mix sound, and studio etiquette.</p>
            <span className="text-xs uppercase tracking-widest font-bold text-white/50 group-hover:text-white transition-colors">Read Articles →</span>
          </Link>

          <Link href="/blogs/producers" className="blog-anim group block p-10 rounded-3xl bg-[#15151c] border border-white/5 hover:border-[#d4a857]/50 transition-all">
            <span className="inline-block px-3 py-1 bg-black border border-white/10 rounded text-[10px] font-bold uppercase tracking-widest text-[#d4a857] mb-6 group-hover:bg-[#d4a857] group-hover:text-black transition-colors">
              Discipline
            </span>
            <h3 className="text-4xl font-head mb-4 text-white group-hover:text-[#d4a857] transition-colors">For Producers</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">Low-end theory, acoustic treatment truths, plugin myths, and structuring beats for placements.</p>
            <span className="text-xs uppercase tracking-widest font-bold text-white/50 group-hover:text-white transition-colors">Read Articles →</span>
          </Link>
        </div>
      </section>

      {/* Community Section */}
      <section className="container mx-auto px-6 max-w-4xl">
        <div className="blog-anim bg-[#0c0c10] border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-xl">
          <h3 className="text-3xl font-head mb-2 text-[#d4a857]">Studio Talk</h3>
          <p className="text-gray-400 text-sm mb-10">Ask a production question, debate a mix, or drop feedback.</p>
          
          <form onSubmit={handleCommentSubmit} className="mb-12 flex flex-col gap-4 relative">
            <textarea 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={user ? "Join the discussion..." : "Log in to post a message..."}
              rows={4}
              disabled={!user && !isAuthLoading}
              className="w-full bg-[#15151c] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#d4a857] transition-colors resize-none disabled:opacity-50"
            />
            
            {!isAuthLoading && !user && (
              <div className="absolute inset-0 bg-[#0c0c10]/40 backdrop-blur-[2px] rounded-xl flex items-center justify-center border border-white/5">
                <button type="button" onClick={() => router.push('/auth/login')} className="px-8 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[#d4a857] transition-colors shadow-2xl">
                  Log In To Comment
                </button>
              </div>
            )}

            {user && (
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-[#d4a857] uppercase tracking-widest font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#25d366] animate-pulse"></span> Authenticated as {user.email?.split('@')[0]}
                </span>
                <button type="submit" className="px-8 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[#d4a857] transition-colors">
                  Post Message
                </button>
              </div>
            )}
          </form>

          {/* Comment Feed */}
          <div className="space-y-6 border-t border-white/5 pt-8">
            {comments.map((c) => (
              <div key={c.id} className="p-6 rounded-2xl bg-[#15151c] border border-white/5">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#07070a] border border-[#d4a857]/50 text-[#d4a857] font-head flex items-center justify-center text-xl uppercase">
                    {c.user_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-200">{c.user_name}</h4>
                    <span className="text-xs text-gray-500">
                      {new Date(c.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{c.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

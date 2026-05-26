"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { createClient } from "@/lib/supabase";

// High-converting Q&A Editorial Content
const editorialContent = [
  {
    category: "For Rappers",
    question: "Why do my vocals sound 'pasted' on top of the beat instead of inside it?",
    answer: "This is the #1 mistake we hear. It happens when you use generic YouTube beats that lack headroom, combined with poor vocal compression. At MCM, we use dynamic EQ carving to create a 'pocket' in the beat's frequency spectrum specifically for your vocal tone, then glue them together with analog-style bus compression. The result is a track that sounds like a single cohesive record, not karaoke."
  },
  {
    category: "For Producers",
    question: "Are expensive plugins actually necessary to make industry-standard beats?",
    answer: "No. Stock plugins can get you 90% there if your sound selection is elite. However, what separates bedroom beats from billboard records is acoustic treatment and monitoring. You can't mix what you can't hear. Our MCM control room is acoustically calibrated so you hear the absolute truth of your low-end—meaning your 808s will knock exactly the same in a car, a club, or on AirPods."
  },
  {
    category: "For Rappers",
    question: "How long does a professional recording session actually take?",
    answer: "If you know your lyrics and flow, tracking lead vocals takes 1-2 hours. But a premium record requires ad-libs, harmonies, and dubs. We block our MCM sessions to ensure artists never feel rushed. We handle the technical setup flawlessly so you can focus entirely on your performance and delivery."
  },
  {
    category: "For Producers",
    question: "Is AI going to replace beatmakers?",
    answer: "AI will replace beatmakers who only drag-and-drop loops. It will NOT replace producers who understand arrangement, emotion, and vocal production. In the MCM Academy, we teach you how to use AI as an assistant—generating unique samples and manipulating vocals—so you stay ahead of the curve instead of getting replaced by it."
  }
];

export default function BlogsPage() {
  const container = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();
  
  const [user, setUser] = useState<any>(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([
    // Dummy comments to populate UI until DB is connected
    { id: 1, user_name: "DelhiDrillz", content: "That vocal mixing chain tip saved my latest track. Do you guys use analog gear for the final master?", created_at: new Date().toISOString() },
    { id: 2, user_name: "Vakta", content: "Beginners definitely need to learn basic theory. It cuts workflow time in half.", created_at: new Date().toISOString() }
  ]);

  // Auth Check on Mount
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();
    
    // In a production environment, you would fetch real comments here:
    // const fetchComments = async () => { const { data } = await supabase.from('comments').select('*').order('created_at', { ascending: false }); setComments(data || []); }
  }, []);

  useGSAP(() => {
    gsap.fromTo(".gsap-reveal", 
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" }
    );
  }, { scope: container });

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Redirect unauthenticated users
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (!commentText.trim()) return;

    // Optimistic UI update (shows comment immediately)
    const newComment = { id: Date.now(), user_name: user.email?.split('@')[0] || "Artist", content: commentText, created_at: new Date().toISOString() };
    setComments([newComment, ...comments]);
    setCommentText("");

    // Send to Supabase (Uncomment when ready)
    /*
    await supabase.from('comments').insert([{ 
      user_id: user.id, 
      user_name: user.email?.split('@')[0] || "Artist", 
      content: commentText 
    }]);
    */
  };

  return (
    <div ref={container} className="pt-32 pb-20">
      
      {/* Header */}
      <section className="container mx-auto px-6 mb-24 text-center max-w-3xl">
        <span className="text-[#d4a857] font-head tracking-[0.2em] uppercase text-sm block mb-4 gsap-reveal">Insights & Knowledge</span>
        <h1 className="text-5xl md:text-7xl font-head leading-none mb-6 gsap-reveal">The MCM <span className="text-[#d4a857]">Journal.</span></h1>
        <p className="text-gray-400 text-lg gsap-reveal">Direct answers to the most common questions we hear in the studio. Learn the industry standards.</p>
      </section>

      {/* Q&A Cards (Indirect Promotion) */}
      <section className="container mx-auto px-6 mb-32 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {editorialContent.map((item, i) => (
            <div key={i} className="gsap-reveal group p-8 md:p-10 rounded-3xl bg-[#15151c] border border-white/5 hover:border-[#d4a857]/30 transition-colors">
              <span className="inline-block px-3 py-1 bg-[#07070a] border border-white/10 rounded text-[10px] font-bold uppercase tracking-widest text-[#d4a857] mb-6">
                {item.category}
              </span>
              <h3 className="text-2xl font-head mb-4 text-white leading-tight">{item.question}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Secure Community Discussion Section */}
      <section className="container mx-auto px-6 max-w-4xl">
        <div className="gsap-reveal bg-[#0c0c10] border border-white/10 rounded-[2rem] p-8 md:p-12">
          <h3 className="text-3xl font-head mb-2 text-[#d4a857]">Studio Talk</h3>
          <p className="text-gray-400 text-sm mb-10">Ask a production question, debate a mix, or drop feedback. The MCM community is active here.</p>
          
          <form onSubmit={handleCommentSubmit} className="mb-12 flex flex-col gap-4 relative">
            <textarea 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Join the discussion..." 
              rows={4}
              className="w-full bg-[#15151c] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#d4a857] transition-colors resize-none"
            />
            
            {/* Auth Gate Overlay - Blurs textarea if not logged in */}
            {!user && (
              <div className="absolute inset-0 bg-[#0c0c10]/60 backdrop-blur-[2px] rounded-xl flex items-center justify-center border border-white/5">
                <button type="button" onClick={() => router.push('/auth/login')} className="px-8 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[#d4a857] transition-colors shadow-2xl">
                  Log In To Comment
                </button>
              </div>
            )}

            {user && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#d4a857] uppercase tracking-widest font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#25d366] animate-pulse"></span> Authenticated
                </span>
                <button type="submit" className="px-8 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[#d4a857] transition-colors">
                  Post Message
                </button>
              </div>
            )}
          </form>

          {/* Render Comments */}
          <div className="space-y-6">
            {comments.map((c) => (
              <div key={c.id} className="p-6 rounded-2xl bg-[#15151c] border border-white/5">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#07070a] border border-[#d4a857]/50 text-[#d4a857] font-head flex items-center justify-center text-xl">
                    {c.user_name.charAt(0).toUpperCase()}
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

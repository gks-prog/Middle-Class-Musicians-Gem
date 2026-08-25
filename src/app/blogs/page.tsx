"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { createClient } from "@/lib/supabase";

type Comment = {
  id: string;
  user_id: string;
  user_name: string;
  content: string;
  parent_id: string | null;
  created_at: string;
  score: number;
  userVote: number;
};

export default function BlogsPage() {
  const container = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const loadDiscussion = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);

    const { data: rows } = await supabase
      .from("blog_comments")
      .select("id,user_id,user_name,content,parent_id,created_at,blog_comment_votes(vote,user_id)")
      .eq("post_slug", "community")
      .order("created_at", { ascending: false });

    const mapped = (rows || []).map((row: any) => ({
      id: row.id,
      user_id: row.user_id,
      user_name: row.user_name,
      content: row.content,
      parent_id: row.parent_id,
      created_at: row.created_at,
      score: (row.blog_comment_votes || []).reduce((sum: number, v: any) => sum + v.vote, 0),
      userVote: session ? ((row.blog_comment_votes || []).find((v: any) => v.user_id === session.user.id)?.vote || 0) : 0,
    }));
    setComments(mapped);
    setLoading(false);
  };

  useEffect(() => {
    loadDiscussion();
  }, []);

  useGSAP(() => {
    gsap.from(".blog-anim", { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out", clearProps: "all" });
  }, { scope: container });

  const requireLogin = () => router.push("/auth/login");

  const addComment = async (content: string, parentId: string | null = null) => {
    if (!user) return requireLogin();
    if (!content.trim()) return;
    setPosting(true);
    const supabase = createClient();
    const { error } = await supabase.from("blog_comments").insert({
      post_slug: "community",
      user_id: user.id,
      user_name: user.user_metadata?.user_name || user.user_metadata?.name || user.email?.split("@")[0] || "Artist",
      content: content.trim(),
      parent_id: parentId,
    });
    if (!error) {
      if (parentId) setReplyText(""); else setCommentText("");
      setReplyTo(null);
      await loadDiscussion();
    }
    setPosting(false);
  };

  const vote = async (commentId: string, currentVote: number, nextVote: 1 | -1) => {
    if (!user) return requireLogin();
    const supabase = createClient();
    if (currentVote === nextVote) {
      await supabase.from("blog_comment_votes").delete().eq("comment_id", commentId).eq("user_id", user.id);
    } else {
      await supabase.from("blog_comment_votes").upsert({ comment_id: commentId, user_id: user.id, vote: nextVote });
    }
    await loadDiscussion();
  };

  const renderComment = (comment: Comment, depth = 0) => {
    const replies = comments.filter((c) => c.parent_id === comment.id);
    return (
      <div key={comment.id} className={depth ? "ml-6 md:ml-12 border-l border-white/10 pl-4 md:pl-6" : ""}>
        <div className="group rounded-2xl bg-[#15151c] border border-white/5 p-5 hover:border-white/10 transition-colors">
          <div className="flex gap-4">
            <div className="flex flex-col items-center min-w-10">
              <button onClick={() => vote(comment.id, comment.userVote, 1)} aria-label="Upvote" className={`text-lg leading-none ${comment.userVote === 1 ? "text-[#d4a857]" : "text-gray-600 hover:text-[#d4a857]"}`}>▲</button>
              <span className={`text-xs font-bold my-1 ${comment.score > 0 ? "text-white" : "text-gray-500"}`}>{comment.score}</span>
              <button onClick={() => vote(comment.id, comment.userVote, -1)} aria-label="Downvote" className={`text-lg leading-none ${comment.userVote === -1 ? "text-[#d4a857]" : "text-gray-600 hover:text-[#d4a857]"}`}>▼</button>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-sm font-bold text-white">u/{comment.user_name}</span>
                <span className="text-xs text-gray-600">•</span>
                <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleString()}</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
              <button onClick={() => user ? setReplyTo(replyTo === comment.id ? null : comment.id) : requireLogin()} className="mt-4 text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-[#d4a857] transition-colors">Reply</button>
              {replyTo === comment.id && (
                <form onSubmit={(e) => { e.preventDefault(); addComment(replyText, comment.id); }} className="mt-4 flex gap-2">
                  <input value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply..." maxLength={5000} className="flex-1 bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#d4a857]" autoFocus />
                  <button disabled={posting} className="px-4 py-2 bg-white text-black rounded-lg text-[10px] font-bold uppercase tracking-widest">Reply</button>
                </form>
              )}
            </div>
          </div>
        </div>
        {replies.length > 0 && <div className="mt-3 space-y-3">{replies.map((reply) => renderComment(reply, depth + 1))}</div>}
      </div>
    );
  };

  return (
    <div ref={container} className="pt-32 pb-32 min-h-screen">
      <section className="container mx-auto px-6 mb-24 text-center max-w-3xl">
        <span className="text-[#d4a857] font-head tracking-[0.2em] uppercase text-sm block mb-4 blog-anim">Insights & Knowledge</span>
        <h1 className="text-5xl md:text-7xl font-head leading-none mb-6 blog-anim">The MCM <span className="text-[#d4a857]">Journal.</span></h1>
        <p className="text-gray-400 text-lg blog-anim">Select a discipline to access specialized industry insights, or join the studio discussion below.</p>
      </section>

      <section className="container mx-auto px-6 mb-32 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/blogs/rappers" className="blog-anim group block p-10 rounded-3xl bg-[#15151c] border border-white/5 hover:border-[#d4a857]/50 transition-all">
            <span className="inline-block px-3 py-1 bg-black border border-white/10 rounded text-[10px] font-bold uppercase tracking-widest text-[#d4a857] mb-6 group-hover:bg-[#d4a857] group-hover:text-black transition-colors">Discipline</span>
            <h3 className="text-4xl font-head mb-4 text-white group-hover:text-[#d4a857] transition-colors">For Rappers</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">Vocal pacing, overcoming recording anxiety, achieving the 'glued' mix sound, and studio etiquette.</p>
            <span className="text-xs uppercase tracking-widest font-bold text-white/50 group-hover:text-white transition-colors">Read Articles →</span>
          </Link>
          <Link href="/blogs/producers" className="blog-anim group block p-10 rounded-3xl bg-[#15151c] border border-white/5 hover:border-[#d4a857]/50 transition-all">
            <span className="inline-block px-3 py-1 bg-black border border-white/10 rounded text-[10px] font-bold uppercase tracking-widest text-[#d4a857] mb-6 group-hover:bg-[#d4a857] group-hover:text-black transition-colors">Discipline</span>
            <h3 className="text-4xl font-head mb-4 text-white group-hover:text-[#d4a857] transition-colors">For Producers</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">Low-end theory, acoustic treatment truths, plugin myths, and structuring beats for placements.</p>
            <span className="text-xs uppercase tracking-widest font-bold text-white/50 group-hover:text-white transition-colors">Read Articles →</span>
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-6 max-w-4xl">
        <div className="blog-anim bg-[#0c0c10] border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h3 className="text-3xl font-head mb-2 text-[#d4a857]">Studio Talk</h3>
              <p className="text-gray-400 text-sm">Reddit-style discussion for the MCM community.</p>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-gray-600">{comments.length} comments</span>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); addComment(commentText); }} className="mb-10">
            <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder={user ? "What are you working on? Start a discussion..." : "Log in to join the discussion..."} onClick={() => !user && requireLogin()} rows={4} maxLength={5000} className="w-full bg-[#15151c] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#d4a857] transition-colors resize-none" />
            <div className="flex justify-between items-center mt-3">
              <span className="text-[10px] text-gray-600">{user ? `Posting as u/${user.user_metadata?.user_name || user.user_metadata?.name || user.email?.split("@")[0]}` : "Authentication required"}</span>
              <button type="submit" disabled={posting} className="px-7 py-3 bg-white text-black font-bold text-[10px] uppercase tracking-widest rounded-lg hover:bg-[#d4a857] transition-colors disabled:opacity-50">{posting ? "Posting..." : "Post"}</button>
            </div>
          </form>

          <div className="border-t border-white/5 pt-8">
            {loading ? <p className="text-center text-xs uppercase tracking-widest text-gray-600 py-10">Loading discussion...</p> : comments.filter((c) => !c.parent_id).length === 0 ? <p className="text-center text-gray-600 py-10">No discussions yet. Start the first one.</p> : <div className="space-y-4">{comments.filter((c) => !c.parent_id).map((comment) => renderComment(comment))}</div>}
          </div>
        </div>
      </section>
    </div>
  );
}

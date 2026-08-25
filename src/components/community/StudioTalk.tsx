"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

type Vote = { vote: number; user_id: string };
type Row = { id: string; user_id: string; user_name: string; content: string; parent_id: string | null; created_at: string; blog_comment_votes: Vote[] | null };
type Comment = Omit<Row, "blog_comment_votes"> & { score: number; userVote: number };

export default function StudioTalk() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [sortBy, setSortBy] = useState<"new" | "top">("new");
  const [error, setError] = useState("");

  const loadDiscussion = useCallback(async () => {
    setError("");
    try {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getSession();
      const activeUser = auth.session?.user || null;
      setUser(activeUser);
      const { data, error: queryError } = await supabase.from("blog_comments").select("id,user_id,user_name,content,parent_id,created_at,blog_comment_votes(vote,user_id)").eq("post_slug", "community").order("created_at", { ascending: true });
      if (queryError) throw queryError;
      setComments(((data || []) as Row[]).map((row) => ({ id: row.id, user_id: row.user_id, user_name: row.user_name, content: row.content, parent_id: row.parent_id, created_at: row.created_at, score: (row.blog_comment_votes || []).reduce((sum, vote) => sum + vote.vote, 0), userVote: activeUser ? (row.blog_comment_votes || []).find((vote) => vote.user_id === activeUser.id)?.vote || 0 : 0 })));
    } catch (loadError) {
      console.error("Unable to load Studio Talk", loadError);
      setError("Studio Talk could not load. Check your connection and retry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Discussion state is restored after the browser auth session is available.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDiscussion();
    const supabase = createClient();
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      window.setTimeout(loadDiscussion, 0);
    });
    let refreshTimer: number | undefined;
    const scheduleRefresh = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(loadDiscussion, 200);
    };
    const channel = supabase.channel("studio-talk-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "blog_comments", filter: "post_slug=eq.community" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "blog_comment_votes" }, scheduleRefresh)
      .subscribe();
    return () => {
      authListener.subscription.unsubscribe();
      window.clearTimeout(refreshTimer);
      supabase.removeChannel(channel);
    };
  }, [loadDiscussion]);

  const requireLogin = () => router.push(`/auth/login?next=${encodeURIComponent("/blogs#studio-talk")}`);
  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Artist";

  const addComment = async (content: string, parentId: string | null = null) => {
    if (!user) return requireLogin();
    if (!content.trim()) return;
    setPosting(true);
    setError("");
    try {
      const { error: insertError } = await createClient().from("blog_comments").insert({ post_slug: "community", user_id: user.id, user_name: displayName, content: content.trim(), parent_id: parentId });
      if (insertError) throw insertError;
      if (parentId) setReplyText("");
      else setCommentText("");
      setReplyTo(null);
      await loadDiscussion();
    } catch (postError) {
      console.error("Unable to post comment", postError);
      setError("Your message was not posted. Please retry.");
    } finally {
      setPosting(false);
    }
  };

  const vote = async (comment: Comment, nextVote: 1 | -1) => {
    if (!user) return requireLogin();
    setError("");
    const supabase = createClient();
    const result = comment.userVote === nextVote
      ? await supabase.from("blog_comment_votes").delete().eq("comment_id", comment.id).eq("user_id", user.id)
      : await supabase.from("blog_comment_votes").upsert({ comment_id: comment.id, user_id: user.id, vote: nextVote }, { onConflict: "comment_id,user_id" });
    if (result.error) return setError("Your vote could not be saved. Please retry.");
    await loadDiscussion();
  };

  const remove = async (comment: Comment) => {
    if (!user || !window.confirm("Delete this comment and its replies?")) return;
    const { error: deleteError } = await createClient().from("blog_comments").delete().eq("id", comment.id).eq("user_id", user.id);
    if (deleteError) return setError("This comment could not be deleted.");
    await loadDiscussion();
  };

  const childrenByParent = useMemo(() => {
    const map = new Map<string, Comment[]>();
    comments.forEach((comment) => {
      if (!comment.parent_id) return;
      map.set(comment.parent_id, [...(map.get(comment.parent_id) || []), comment]);
    });
    return map;
  }, [comments]);
  const roots = useMemo(() => comments.filter((comment) => !comment.parent_id).sort((a, b) => sortBy === "top" ? b.score - a.score || Date.parse(b.created_at) - Date.parse(a.created_at) : Date.parse(b.created_at) - Date.parse(a.created_at)), [comments, sortBy]);

  const renderComment = (comment: Comment, depth = 0): React.ReactNode => {
    const replies = childrenByParent.get(comment.id) || [];
    return <div key={comment.id} className={depth ? `border-l border-white/10 pl-3 sm:pl-5 ${depth < 4 ? "ml-3 sm:ml-6" : ""}` : ""}>
      <article className="rounded-2xl border border-white/5 bg-[#15151c] p-4 transition hover:border-white/10 sm:p-5"><div className="flex gap-3 sm:gap-4">
        <div className="flex min-w-8 flex-col items-center"><button type="button" onClick={() => vote(comment, 1)} aria-label={`Upvote ${comment.user_name}'s comment`} className={comment.userVote === 1 ? "text-[#d4a857]" : "text-gray-600 hover:text-[#d4a857]"}>▲</button><span className="my-1 text-xs font-bold text-gray-300">{comment.score}</span><button type="button" onClick={() => vote(comment, -1)} aria-label={`Downvote ${comment.user_name}'s comment`} className={comment.userVote === -1 ? "text-[#d4a857]" : "text-gray-600 hover:text-[#d4a857]"}>▼</button></div>
        <div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap items-center gap-2"><strong className="text-sm text-white">u/{comment.user_name}</strong><time dateTime={comment.created_at} className="text-[10px] text-gray-500">{new Date(comment.created_at).toLocaleString()}</time></div><p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-300">{comment.content}</p><div className="mt-4 flex gap-5"><button type="button" onClick={() => user ? setReplyTo(replyTo === comment.id ? null : comment.id) : requireLogin()} className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#d4a857]">Reply</button>{user?.id === comment.user_id && <button type="button" onClick={() => remove(comment)} className="text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:text-red-400">Delete</button>}</div>
          {replyTo === comment.id && <form onSubmit={(event) => { event.preventDefault(); addComment(replyText, comment.id); }} className="mt-4 flex flex-col gap-2 sm:flex-row"><label htmlFor={`reply-${comment.id}`} className="sr-only">Reply to {comment.user_name}</label><input id={`reply-${comment.id}`} value={replyText} onChange={(event) => setReplyText(event.target.value)} maxLength={5000} required autoFocus placeholder="Write a reply…" className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black px-3 py-2 text-sm outline-none focus:border-[#d4a857]" /><button disabled={posting} className="rounded-lg bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-black disabled:opacity-40">Reply</button></form>}
        </div>
      </div></article>
      {replies.length > 0 && <div className="mt-3 space-y-3">{replies.map((reply) => renderComment(reply, depth + 1))}</div>}
    </div>;
  };

  return <section id="studio-talk" className="container mx-auto max-w-4xl scroll-mt-28 px-5 sm:px-6"><div className="rounded-[2rem] border border-white/10 bg-[#0c0c10] p-6 shadow-xl sm:p-8 md:p-12">
    <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4a857]">Live community</p><h2 className="font-head text-4xl">Studio Talk</h2><p className="mt-2 text-sm text-gray-400">Ask, reply and vote with the MCM community.</p></div><span className="text-[10px] uppercase tracking-widest text-gray-500">{comments.length} comments</span></div>
    {user ? <form onSubmit={(event) => { event.preventDefault(); addComment(commentText); }} className="mb-10"><label htmlFor="new-comment" className="sr-only">Start a discussion</label><textarea id="new-comment" value={commentText} onChange={(event) => setCommentText(event.target.value)} rows={4} maxLength={5000} required placeholder="What are you working on?" className="w-full resize-none rounded-xl border border-white/10 bg-[#15151c] p-4 outline-none focus:border-[#d4a857]" /><div className="mt-3 flex items-center justify-between gap-4"><span className="truncate text-[10px] text-gray-500">Posting as u/{displayName} · {commentText.length}/5000</span><button disabled={posting || !commentText.trim()} className="rounded-lg bg-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-black transition hover:bg-[#d4a857] disabled:opacity-40">{posting ? "Posting…" : "Post"}</button></div></form> : <div className="mb-10 rounded-2xl border border-[#d4a857]/20 bg-[#d4a857]/5 p-6 text-center"><p className="mb-4 text-sm text-gray-300">Log in and verify your email to join the conversation.</p><button type="button" onClick={requireLogin} className="rounded-full bg-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-black transition hover:bg-[#d4a857]">Log in to Studio Talk</button></div>}
    <div className="border-t border-white/5 pt-8">{error && <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300"><span>{error}</span><button type="button" onClick={loadDiscussion} className="text-[10px] font-bold uppercase tracking-widest text-white">Retry</button></div>}{!loading && roots.length > 1 && <div className="mb-6 flex gap-2" aria-label="Sort discussions">{(["new", "top"] as const).map((sort) => <button key={sort} type="button" onClick={() => setSortBy(sort)} aria-pressed={sortBy === sort} className={`rounded-full px-4 py-2 text-[9px] font-bold uppercase tracking-widest ${sortBy === sort ? "bg-[#d4a857] text-black" : "border border-white/10 text-gray-500"}`}>{sort}</button>)}</div>}{loading ? <p className="py-10 text-center text-xs uppercase tracking-widest text-gray-600">Loading discussion…</p> : roots.length ? <div className="space-y-4">{roots.map((comment) => renderComment(comment))}</div> : <div className="py-10 text-center"><p className="text-gray-500">No discussions yet.</p>{!user && <Link href="/auth/login" className="mt-3 inline-block text-xs text-[#d4a857]">Be the first to start one</Link>}</div>}</div>
  </div></section>;
}

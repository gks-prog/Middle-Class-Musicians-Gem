"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "M";
}

export default function AuthNav({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const sync = async (nextUser: User | null) => {
      setUser(nextUser);
      if (!nextUser) {
        setName("");
        setLoading(false);
        return;
      }
      const { data } = await supabase.from("profiles").select("display_name").eq("id", nextUser.id).maybeSingle();
      setName(data?.display_name || nextUser.user_metadata?.display_name || nextUser.email?.split("@")[0] || "Artist");
      setLoading(false);
    };
    supabase.auth.getUser().then(({ data }) => sync(data.user));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => sync(session?.user || null), 0);
    });
    const profileUpdated = (event: Event) => setName((event as CustomEvent<string>).detail);
    window.addEventListener("mcm:profile-updated", profileUpdated);
    return () => {
      data.subscription.unsubscribe();
      window.removeEventListener("mcm:profile-updated", profileUpdated);
    };
  }, []);

  if (loading) return <span aria-hidden className={mobile ? "mt-4 h-12 w-12 animate-pulse rounded-full bg-white/10" : "h-10 w-10 animate-pulse rounded-full bg-white/10"} />;
  if (!user) return <Link href="/auth/login" onClick={onNavigate} className={mobile ? "mt-4 py-3 font-head text-3xl uppercase tracking-widest text-[#d4a857]" : "flex min-h-11 items-center text-[11px] font-bold uppercase tracking-[0.16em] text-[#d4a857] transition hover:text-white"}>Login</Link>;

  return (
    <Link href="/dashboard" onClick={onNavigate} title={`Open ${name}'s dashboard`} aria-label={`Open ${name}'s dashboard`} className={`flex shrink-0 items-center justify-center rounded-full border border-[#d4a857]/50 bg-[#d4a857]/10 font-head tracking-wider text-[#d4a857] transition hover:scale-105 hover:bg-[#d4a857] hover:text-black ${mobile ? "mt-5 h-14 w-14 text-xl" : "h-10 w-10 text-sm"}`}>
      {initials(name)}
    </Link>
  );
}

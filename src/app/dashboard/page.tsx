"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

type Booking = { id: string; service_name: string; project_title: string | null; scheduled_at: string | null; status: string; amount_inr: number | null; created_at: string };
type Purchase = { id: string; item_name: string; item_type: string; order_reference: string | null; status: string; amount_inr: number | null; purchased_at: string };

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const date = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" });
const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "M";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [draftName, setDraftName] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadDashboard = useCallback(async () => {
    const supabase = createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      router.replace("/auth/login?next=/dashboard");
      return;
    }

    const currentUser = authData.user;
    setUser(currentUser);
    const [profileResult, bookingResult, purchaseResult] = await Promise.all([
      supabase.from("profiles").select("display_name").eq("id", currentUser.id).maybeSingle(),
      supabase.from("bookings").select("id,service_name,project_title,scheduled_at,status,amount_inr,created_at").eq("user_id", currentUser.id).order("created_at", { ascending: false }),
      supabase.from("purchases").select("id,item_name,item_type,order_reference,status,amount_inr,purchased_at").eq("user_id", currentUser.id).order("purchased_at", { ascending: false }),
    ]);

    const firstError = profileResult.error || bookingResult.error || purchaseResult.error;
    if (firstError) setMessage(firstError.message);
    const displayName = profileResult.data?.display_name || currentUser.user_metadata?.display_name || currentUser.email?.split("@")[0] || "Artist";
    setName(displayName);
    setDraftName(displayName);
    setBookings((bookingResult.data || []) as Booking[]);
    setPurchases((purchaseResult.data || []) as Purchase[]);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    // Client account data is loaded after Supabase restores the browser session.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDashboard();
  }, [loadDashboard]);

  const saveName = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !draftName.trim()) return;
    setSaving(true);
    setMessage("");
    try {
      const nextName = draftName.trim();
      const supabase = createClient();
      const { error } = await supabase.from("profiles").upsert({ id: user.id, display_name: nextName });
      if (error) throw error;
      const { error: authError } = await supabase.auth.updateUser({ data: { display_name: nextName } });
      if (authError) throw authError;
      setName(nextName);
      window.dispatchEvent(new CustomEvent("mcm:profile-updated", { detail: nextName }));
      setMessage("Name updated everywhere, including Studio Talk.");
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Your name could not be updated.");
    } finally {
      setSaving(false);
    }
  };

  const signOut = async () => {
    await createClient().auth.signOut();
    router.replace("/");
    router.refresh();
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center pt-24 text-xs uppercase tracking-[0.2em] text-gray-500">Loading your studio account…</div>;

  return (
    <div className="min-h-screen pb-32 pt-32">
      <div className="container mx-auto max-w-6xl px-5 sm:px-6">
        <header className="mb-10 flex flex-col gap-6 rounded-[2rem] border border-white/10 bg-[#0c0c10] p-7 sm:p-9 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5"><div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#d4a857]/50 bg-[#d4a857]/10 font-head text-2xl text-[#d4a857]">{initials(name)}</div><div><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4a857]">Client dashboard</p><h1 className="font-head text-4xl sm:text-5xl">Welcome, {name}</h1><p className="mt-1 text-xs text-gray-500">{user?.email} · Email verified</p></div></div>
          <button type="button" onClick={signOut} className="self-start rounded-full border border-white/10 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 transition hover:border-white/30 hover:text-white">Sign out</button>
        </header>

        {message && <p role="status" className="mb-6 rounded-xl border border-[#d4a857]/20 bg-[#d4a857]/5 p-4 text-sm text-[#d4a857]">{message}</p>}

        <section className="mb-10 grid gap-5 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-[#15151c] p-7"><p className="text-xs uppercase tracking-widest text-gray-500">Bookings</p><p className="mt-3 font-head text-5xl text-white">{bookings.length}</p><p className="mt-2 text-sm text-gray-500">Studio sessions connected to this email.</p></div>
          <div className="rounded-3xl border border-white/10 bg-[#15151c] p-7"><p className="text-xs uppercase tracking-widest text-gray-500">Purchases</p><p className="mt-3 font-head text-5xl text-white">{purchases.length}</p><p className="mt-2 text-sm text-gray-500">Courses, beats and paid services in your account.</p></div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-8">
            <RecordSection title="Your bookings" empty="No bookings are linked to this account yet.">
              {bookings.map((booking) => <article key={booking.id} className="rounded-2xl border border-white/5 bg-[#15151c] p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-head text-2xl">{booking.project_title || booking.service_name}</h3><p className="text-sm text-gray-500">{booking.service_name}</p></div><Status value={booking.status} /></div><div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-400"><span>{date.format(new Date(booking.scheduled_at || booking.created_at))}</span>{booking.amount_inr !== null && <span>{money.format(booking.amount_inr)}</span>}</div></article>)}
            </RecordSection>
            <RecordSection title="Your purchases" empty="No purchases are linked to this account yet.">
              {purchases.map((purchase) => <article key={purchase.id} className="rounded-2xl border border-white/5 bg-[#15151c] p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-head text-2xl">{purchase.item_name}</h3><p className="text-xs uppercase tracking-widest text-gray-500">{purchase.item_type.replaceAll("_", " ")}{purchase.order_reference ? ` · ${purchase.order_reference}` : ""}</p></div><Status value={purchase.status} /></div><div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-400"><span>{date.format(new Date(purchase.purchased_at))}</span>{purchase.amount_inr !== null && <span>{money.format(purchase.amount_inr)}</span>}</div></article>)}
            </RecordSection>
          </div>

          <aside className="h-fit rounded-3xl border border-white/10 bg-[#0c0c10] p-7 lg:sticky lg:top-28">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4a857]">Profile</p><h2 className="mb-6 font-head text-3xl">Edit your name</h2>
            <form onSubmit={saveName} className="space-y-4"><label htmlFor="profile-name" className="sr-only">Display name</label><input id="profile-name" value={draftName} onChange={(event) => setDraftName(event.target.value)} minLength={1} maxLength={80} required className="w-full rounded-xl border border-white/10 bg-[#15151c] p-4 text-white outline-none focus:border-[#d4a857]" /><button disabled={saving || draftName.trim() === name} className="w-full rounded-xl bg-white py-4 text-[10px] font-bold uppercase tracking-widest text-black transition hover:bg-[#d4a857] disabled:opacity-40">{saving ? "Saving…" : "Save name"}</button></form>
            <div className="mt-7 border-t border-white/10 pt-6"><Link href="/blogs#studio-talk" className="text-xs font-bold uppercase tracking-widest text-[#d4a857] hover:text-white">Open Studio Talk →</Link></div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function RecordSection({ title, empty, children }: { title: string; empty: string; children: React.ReactNode }) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children);
  return <section><h2 className="mb-4 font-head text-3xl">{title}</h2>{hasChildren ? <div className="space-y-3">{children}</div> : <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-gray-500">{empty}</div>}</section>;
}

function Status({ value }: { value: string }) {
  return <span className="rounded-full border border-[#d4a857]/20 bg-[#d4a857]/5 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-[#d4a857]">{value}</span>;
}

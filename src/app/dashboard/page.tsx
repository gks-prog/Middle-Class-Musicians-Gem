"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

type Booking = {
  id: string;
  service_name: string;
  project_title: string | null;
  project_details: string | null;
  scheduled_at: string | null;
  status: string;
  amount_inr: number | null;
  created_at: string;
};
type Purchase = { id: string; item_name: string; item_type: string; order_reference: string | null; status: string; amount_inr: number | null; purchased_at: string };
type Notice = { type: "success" | "error"; text: string };

const SERVICES = ["Vocal Recording", "Mixing & Mastering", "Beat Production", "Songwriting Support"];
const TIME_SLOTS = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const dateTime = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });
const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "M";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [draftName, setDraftName] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [activeView, setActiveView] = useState<"overview" | "book" | "account">("overview");
  const [bookingForm, setBookingForm] = useState({ service_name: "", project_title: "", preferred_date: "", preferred_time: "", project_details: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const minimumDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  }, []);

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
      supabase.from("bookings").select("id,service_name,project_title,project_details,scheduled_at,status,amount_inr,created_at").eq("user_id", currentUser.id).order("created_at", { ascending: false }),
      supabase.from("purchases").select("id,item_name,item_type,order_reference,status,amount_inr,purchased_at").eq("user_id", currentUser.id).order("purchased_at", { ascending: false }),
    ]);

    const firstError = profileResult.error || bookingResult.error || purchaseResult.error;
    if (firstError) setNotice({ type: "error", text: "Your portal data could not load. Apply the latest Supabase migration, then retry." });
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
    void loadDashboard();
  }, [loadDashboard]);

  const requestBooking = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setSaving(true);
    setNotice(null);
    const scheduledAt = new Date(`${bookingForm.preferred_date}T${bookingForm.preferred_time}:00+05:30`).toISOString();
    const { error } = await createClient().from("bookings").insert({
      user_id: user.id,
      service_name: bookingForm.service_name,
      project_title: bookingForm.project_title.trim(),
      project_details: bookingForm.project_details.trim(),
      scheduled_at: scheduledAt,
      status: "pending",
    });

    if (error) {
      setNotice({ type: "error", text: error.code === "23505" ? "That studio slot has just been requested. Please choose another time." : error.message });
    } else {
      setBookingForm({ service_name: "", project_title: "", preferred_date: "", preferred_time: "", project_details: "" });
      setNotice({ type: "success", text: "Booking requested. The studio will confirm your slot before it becomes final." });
      setActiveView("overview");
      await loadDashboard();
    }
    setSaving(false);
  };

  const cancelBooking = async (id: string) => {
    if (!window.confirm("Cancel this booking request?")) return;
    setNotice(null);
    const { error } = await createClient().from("bookings").update({ status: "cancelled" }).eq("id", id).eq("status", "pending");
    setNotice(error ? { type: "error", text: error.message } : { type: "success", text: "Booking request cancelled." });
    if (!error) await loadDashboard();
  };

  const saveName = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !draftName.trim()) return;
    setSaving(true);
    setNotice(null);
    try {
      const nextName = draftName.trim();
      const supabase = createClient();
      const { error } = await supabase.from("profiles").upsert({ id: user.id, display_name: nextName });
      if (error) throw error;
      const { error: authError } = await supabase.auth.updateUser({ data: { display_name: nextName } });
      if (authError) throw authError;
      setName(nextName);
      window.dispatchEvent(new CustomEvent("mcm:profile-updated", { detail: nextName }));
      setNotice({ type: "success", text: "Name updated everywhere, including Studio Talk." });
    } catch (error: unknown) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Your name could not be updated." });
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
    <div className="min-h-screen pb-32 pt-28 sm:pt-32">
      <div className="container mx-auto max-w-6xl px-5 sm:px-6">
        <header className="mb-8 flex flex-col gap-6 rounded-[2rem] border border-white/10 bg-[#0c0c10] p-7 sm:p-9 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5"><div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#d4a857]/50 bg-[#d4a857]/10 font-head text-2xl text-[#d4a857]">{initials(name)}</div><div><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4a857]">Client portal</p><h1 className="font-head text-4xl sm:text-5xl">Welcome, {name}</h1><p className="mt-1 text-xs text-gray-500">Bookings are requests until the studio confirms them.</p></div></div>
          <div className="flex flex-wrap gap-3"><button type="button" onClick={() => setActiveView("book")} className="rounded-full bg-[#d4a857] px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-black transition hover:bg-white">Request booking</button><button type="button" onClick={signOut} className="rounded-full border border-white/10 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 transition hover:border-white/30 hover:text-white">Sign out</button></div>
        </header>

        <nav className="mb-7 flex gap-2 overflow-x-auto pb-1" aria-label="Client portal sections">
          {([['overview', 'Overview'], ['book', 'New booking'], ['account', 'Account']] as const).map(([id, label]) => <button key={id} type="button" onClick={() => { setActiveView(id); setNotice(null); }} aria-current={activeView === id ? "page" : undefined} className={`shrink-0 rounded-full border px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition ${activeView === id ? "border-[#d4a857] bg-[#d4a857]/10 text-[#d4a857]" : "border-white/10 text-gray-500 hover:text-white"}`}>{label}</button>)}
        </nav>

        {notice && <p role={notice.type === "error" ? "alert" : "status"} className={`mb-7 rounded-xl border p-4 text-sm ${notice.type === "error" ? "border-red-500/20 bg-red-500/5 text-red-300" : "border-emerald-500/20 bg-emerald-500/5 text-emerald-300"}`}>{notice.text}</p>}

        {activeView === "overview" && <>
          <section className="mb-10 grid gap-5 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-[#15151c] p-7"><p className="text-xs uppercase tracking-widest text-gray-500">Bookings</p><p className="mt-3 font-head text-5xl text-white">{bookings.length}</p><p className="mt-2 text-sm text-gray-500">Requests and confirmed sessions.</p></div>
            <div className="rounded-3xl border border-white/10 bg-[#15151c] p-7"><p className="text-xs uppercase tracking-widest text-gray-500">Purchases</p><p className="mt-3 font-head text-5xl text-white">{purchases.length}</p><p className="mt-2 text-sm text-gray-500">Courses, beats and paid studio services.</p></div>
          </section>
          <div className="space-y-9">
            <RecordSection title="Your bookings" empty="No bookings yet. Request your first studio slot.">
              {bookings.map((booking) => <article key={booking.id} className="rounded-2xl border border-white/5 bg-[#15151c] p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-head text-2xl">{booking.project_title || booking.service_name}</h3><p className="text-sm text-gray-500">{booking.service_name}</p></div><Status value={booking.status} /></div><div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-gray-400"><span>{dateTime.format(new Date(booking.scheduled_at || booking.created_at))}</span>{booking.amount_inr !== null && <span>{money.format(booking.amount_inr)}</span>}{booking.status === "pending" && <button type="button" onClick={() => cancelBooking(booking.id)} className="font-bold uppercase tracking-widest text-gray-500 hover:text-red-400">Cancel request</button>}</div>{booking.project_details && <p className="mt-4 border-t border-white/5 pt-4 text-sm leading-6 text-gray-500">{booking.project_details}</p>}</article>)}
            </RecordSection>
            <RecordSection title="Your purchases" empty="No purchases are linked to this account yet.">
              {purchases.map((purchase) => <article key={purchase.id} className="rounded-2xl border border-white/5 bg-[#15151c] p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-head text-2xl">{purchase.item_name}</h3><p className="text-xs uppercase tracking-widest text-gray-500">{purchase.item_type.replaceAll("_", " ")}{purchase.order_reference ? ` · ${purchase.order_reference}` : ""}</p></div><Status value={purchase.status} /></div><div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-400"><span>{dateTime.format(new Date(purchase.purchased_at))}</span>{purchase.amount_inr !== null && <span>{money.format(purchase.amount_inr)}</span>}</div></article>)}
            </RecordSection>
          </div>
        </>}

        {activeView === "book" && <form onSubmit={requestBooking} className="max-w-3xl space-y-6 rounded-[2rem] border border-white/10 bg-[#15151c] p-6 sm:p-10">
          <div><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4a857]">No payment required</p><h2 className="font-head text-4xl sm:text-5xl">Request a studio slot</h2><p className="mt-2 text-sm leading-6 text-gray-500">Choose a preferred time and share a useful brief. The studio confirms availability before the session is final.</p></div>
          <Field label="Service"><select required value={bookingForm.service_name} onChange={(event) => setBookingForm({ ...bookingForm, service_name: event.target.value })} className="form-control"><option value="" disabled>Select a service</option>{SERVICES.map((service) => <option key={service}>{service}</option>)}</select></Field>
          <Field label="Project or song title"><input required maxLength={100} value={bookingForm.project_title} onChange={(event) => setBookingForm({ ...bookingForm, project_title: event.target.value })} className="form-control" placeholder="For example: First Light" /></Field>
          <div className="grid gap-6 sm:grid-cols-2"><Field label="Preferred date"><input required type="date" min={minimumDate} value={bookingForm.preferred_date} onChange={(event) => setBookingForm({ ...bookingForm, preferred_date: event.target.value })} className="form-control" /></Field><Field label="Preferred time"><select required value={bookingForm.preferred_time} onChange={(event) => setBookingForm({ ...bookingForm, preferred_time: event.target.value })} className="form-control"><option value="" disabled>Select a time</option>{TIME_SLOTS.map((time) => <option key={time} value={time}>{time}</option>)}</select></Field></div>
          <Field label="Project details"><textarea required minLength={10} maxLength={1500} rows={5} value={bookingForm.project_details} onChange={(event) => setBookingForm({ ...bookingForm, project_details: event.target.value })} className="form-control resize-none" placeholder="Song type, number of vocalists, references, deadline and anything the engineer should prepare…" /><span className="mt-2 block text-right text-[10px] text-gray-600">{bookingForm.project_details.length}/1500</span></Field>
          <button disabled={saving} className="w-full rounded-xl bg-white py-4 text-xs font-bold uppercase tracking-widest text-black transition hover:bg-[#d4a857] disabled:opacity-40">{saving ? "Sending request…" : "Request booking"}</button>
        </form>}

        {activeView === "account" && <aside className="max-w-2xl rounded-[2rem] border border-white/10 bg-[#0c0c10] p-7 sm:p-10">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4a857]">Profile</p><h2 className="mb-6 font-head text-4xl">Account details</h2>
          <form onSubmit={saveName} className="space-y-4"><Field label="Artist / display name"><input value={draftName} onChange={(event) => setDraftName(event.target.value)} minLength={1} maxLength={80} required className="form-control" /></Field><Field label="Verified email"><input disabled value={user?.email || ""} className="form-control opacity-60" /></Field><button disabled={saving || draftName.trim() === name} className="w-full rounded-xl bg-white py-4 text-[10px] font-bold uppercase tracking-widest text-black transition hover:bg-[#d4a857] disabled:opacity-40">{saving ? "Saving…" : "Save name"}</button></form>
          <div className="mt-7 border-t border-white/10 pt-6"><Link href="/blogs#studio-talk" className="text-xs font-bold uppercase tracking-widest text-[#d4a857] hover:text-white">Open Studio Talk →</Link></div>
        </aside>}
      </div>
    </div>
  );
}

function RecordSection({ title, empty, children }: { title: string; empty: string; children: React.ReactNode }) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children);
  return <section><h2 className="mb-4 font-head text-3xl">{title}</h2>{hasChildren ? <div className="space-y-3">{children}</div> : <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-gray-500">{empty}</div>}</section>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-xs uppercase tracking-widest text-gray-400">{label}</span>{children}</label>;
}

function Status({ value }: { value: string }) {
  return <span className="rounded-full border border-[#d4a857]/20 bg-[#d4a857]/5 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-[#d4a857]">{value}</span>;
}

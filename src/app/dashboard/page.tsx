"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

type Booking = { id: string; service: string; preferred_date: string; preferred_time: string; project_details: string; status: string };
type Purchase = { id: string; item_name: string; amount_inr: number | null; payment_status: string; purchased_at: string };
type Project = { id: string; title: string; service: string; status: string; progress: number; delivery_url: string | null; updated_at: string };

const SERVICES = ["Recording & Mixing", "Beat Production", "Video Production", "Music Courses"];
const TIME_SLOTS = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00"];
const STATUS_STYLES: Record<string, string> = {
  requested: "text-amber-300 bg-amber-300/10 border-amber-300/20",
  confirmed: "text-sky-300 bg-sky-300/10 border-sky-300/20",
  completed: "text-emerald-300 bg-emerald-300/10 border-emerald-300/20",
  cancelled: "text-gray-400 bg-white/5 border-white/10",
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({ display_name: "", phone: "" });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "book" | "account">("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [bookingForm, setBookingForm] = useState({ service: "", preferred_date: "", preferred_time: "", project_details: "" });

  const minimumDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  }, []);

  const loadPortal = useCallback(async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.replace("/auth/login?next=/dashboard");
      return;
    }
    setUser(session.user);
    const [profileResult, bookingResult, purchaseResult, projectResult] = await Promise.all([
      supabase.from("profiles").select("display_name,phone").eq("id", session.user.id).maybeSingle(),
      supabase.from("bookings").select("id,service,preferred_date,preferred_time,project_details,status").order("preferred_date", { ascending: false }),
      supabase.from("purchases").select("id,item_name,amount_inr,payment_status,purchased_at").order("purchased_at", { ascending: false }),
      supabase.from("client_projects").select("id,title,service,status,progress,delivery_url,updated_at").order("updated_at", { ascending: false }),
    ]);
    if (profileResult.data) setProfile({ display_name: profileResult.data.display_name || "", phone: profileResult.data.phone || "" });
    else setProfile({ display_name: session.user.user_metadata?.user_name || session.user.email?.split("@")[0] || "Artist", phone: "" });
    setBookings(bookingResult.data || []);
    setPurchases(purchaseResult.data || []);
    setProjects(projectResult.data || []);
    const firstError = [profileResult.error, bookingResult.error, purchaseResult.error, projectResult.error].find(Boolean);
    if (firstError) setMessage({ type: "error", text: "Portal data could not be loaded. Confirm that the latest Supabase migration has been applied." });
    setLoading(false);
  }, [router]);

  useEffect(() => { void loadPortal(); }, [loadPortal]);

  const requestBooking = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage(null);
    const { error } = await createClient().from("bookings").insert({ ...bookingForm, user_id: user.id });
    if (error) {
      const slotTaken = error.code === "23505";
      setMessage({ type: "error", text: slotTaken ? "That time has just been requested. Please select another slot." : error.message });
    } else {
      setMessage({ type: "success", text: "Booking requested. The studio will confirm the slot before it becomes final." });
      setBookingForm({ service: "", preferred_date: "", preferred_time: "", project_details: "" });
      setActiveTab("overview");
      await loadPortal();
    }
    setSaving(false);
  };

  const cancelBooking = async (id: string) => {
    if (!window.confirm("Cancel this booking request?")) return;
    const { error } = await createClient().from("bookings").update({ status: "cancelled" }).eq("id", id).eq("status", "requested");
    setMessage(error ? { type: "error", text: error.message } : { type: "success", text: "Booking request cancelled." });
    if (!error) await loadPortal();
  };

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !profile.display_name.trim()) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("profiles").upsert({ id: user.id, display_name: profile.display_name.trim(), phone: profile.phone.trim() || null, updated_at: new Date().toISOString() });
    if (!error) await supabase.auth.updateUser({ data: { user_name: profile.display_name.trim() } });
    setMessage(error ? { type: "error", text: error.message } : { type: "success", text: "Profile updated." });
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen pt-40 text-center text-xs uppercase tracking-[.3em] text-gray-500">Loading secure portal…</div>;

  return (
    <div className="min-h-screen pt-28 pb-28">
      <section className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[.25em] text-[#d4a857] mb-3">Client Portal</p>
            <h1 className="font-head text-5xl md:text-7xl">Welcome, {profile.display_name || "Artist"}.</h1>
            <p className="text-gray-500 mt-3 text-sm">Bookings are requests until the studio confirms them.</p>
          </div>
          <button onClick={() => setActiveTab("book")} className="rounded-full bg-[#d4a857] px-7 py-3 font-bold text-black hover:bg-white transition-colors">Request a booking</button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-8" role="tablist" aria-label="Client portal sections">
          {([['overview', 'Overview'], ['book', 'New booking'], ['account', 'Account']] as const).map(([id, label]) => (
            <button key={id} role="tab" aria-selected={activeTab === id} onClick={() => { setActiveTab(id); setMessage(null); }} className={`shrink-0 rounded-full px-5 py-2.5 text-xs uppercase tracking-widest border transition-colors ${activeTab === id ? "border-[#d4a857] bg-[#d4a857]/10 text-[#d4a857]" : "border-white/10 text-gray-500 hover:text-white"}`}>{label}</button>
          ))}
        </div>

        {message && <div role="status" className={`mb-8 rounded-xl border p-4 text-sm ${message.type === "error" ? "border-red-500/30 bg-red-500/10 text-red-300" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"}`}>{message.text}</div>}

        {activeTab === "overview" && (
          <div className="space-y-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[['Bookings', bookings.length], ['Active projects', projects.filter((p) => p.status !== 'delivered').length], ['Purchases', purchases.length], ['Delivered', projects.filter((p) => p.status === 'delivered').length]].map(([label, value]) => (
                <div key={String(label)} className="rounded-2xl border border-white/5 bg-[#15151c] p-5"><strong className="font-head text-3xl text-[#d4a857] block">{value}</strong><span className="text-xs text-gray-500">{label}</span></div>
              ))}
            </div>

            <PortalSection title="Bookings" empty="No bookings yet. Request your first studio slot.">
              {bookings.map((booking) => <div key={booking.id} className="rounded-2xl border border-white/5 bg-[#15151c] p-5 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1"><h3 className="font-bold text-white">{booking.service}</h3><p className="text-sm text-gray-500 mt-1">{new Date(`${booking.preferred_date}T00:00:00`).toLocaleDateString('en-IN', { dateStyle: 'medium' })} · {booking.preferred_time.slice(0, 5)}</p></div>
                <span className={`w-fit rounded-full border px-3 py-1 text-[10px] uppercase tracking-widest ${STATUS_STYLES[booking.status] || STATUS_STYLES.requested}`}>{booking.status}</span>
                {booking.status === "requested" && <button onClick={() => cancelBooking(booking.id)} className="text-xs text-gray-500 hover:text-red-400">Cancel</button>}
              </div>)}
            </PortalSection>

            <PortalSection title="Projects" empty="Project progress will appear after a service is confirmed.">
              {projects.map((project) => <div key={project.id} className="rounded-2xl border border-white/5 bg-[#15151c] p-5">
                <div className="flex justify-between gap-4 mb-4"><div><h3 className="font-bold">{project.title}</h3><p className="text-xs text-gray-500 mt-1">{project.service} · {project.status}</p></div><span className="text-sm text-[#d4a857]">{project.progress}%</span></div>
                <div className="h-1.5 rounded-full bg-black overflow-hidden"><div className="h-full bg-[#d4a857]" style={{ width: `${project.progress}%` }} /></div>
                {project.delivery_url && <a href={project.delivery_url} target="_blank" rel="noreferrer" className="inline-block mt-4 text-xs text-[#d4a857] hover:text-white">Download delivery ↗</a>}
              </div>)}
            </PortalSection>

            <PortalSection title="Purchases" empty="No recorded purchases yet.">
              {purchases.map((purchase) => <div key={purchase.id} className="rounded-2xl border border-white/5 bg-[#15151c] p-5 flex justify-between gap-4"><div><h3 className="font-bold">{purchase.item_name}</h3><p className="text-xs text-gray-500 mt-1">{new Date(purchase.purchased_at).toLocaleDateString('en-IN')}</p></div><div className="text-right"><p className="text-sm">{purchase.amount_inr == null ? "—" : `₹${purchase.amount_inr.toLocaleString('en-IN')}`}</p><p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{purchase.payment_status}</p></div></div>)}
            </PortalSection>
          </div>
        )}

        {activeTab === "book" && (
          <form onSubmit={requestBooking} className="max-w-3xl rounded-[2rem] border border-white/10 bg-[#15151c] p-6 md:p-10 space-y-6">
            <div><h2 className="font-head text-4xl">Request a studio slot</h2><p className="text-sm text-gray-500 mt-2">No payment is taken here. Availability is confirmed manually to prevent scheduling conflicts.</p></div>
            <Field label="Service"><select required value={bookingForm.service} onChange={(e) => setBookingForm({ ...bookingForm, service: e.target.value })} className="form-control"><option value="" disabled>Select a service</option>{SERVICES.map((service) => <option key={service}>{service}</option>)}</select></Field>
            <div className="grid sm:grid-cols-2 gap-6">
              <Field label="Preferred date"><input required type="date" min={minimumDate} value={bookingForm.preferred_date} onChange={(e) => setBookingForm({ ...bookingForm, preferred_date: e.target.value })} className="form-control" /></Field>
              <Field label="Preferred time"><select required value={bookingForm.preferred_time} onChange={(e) => setBookingForm({ ...bookingForm, preferred_time: e.target.value })} className="form-control"><option value="" disabled>Select a time</option>{TIME_SLOTS.map((time) => <option key={time} value={time}>{time}</option>)}</select></Field>
            </div>
            <Field label="Project details"><textarea required minLength={10} maxLength={1500} rows={5} value={bookingForm.project_details} onChange={(e) => setBookingForm({ ...bookingForm, project_details: e.target.value })} className="form-control resize-none" placeholder="Song type, recording requirements, references, deadline…" /><span className="text-[10px] text-gray-600 block text-right mt-2">{bookingForm.project_details.length}/1500</span></Field>
            <button disabled={saving} className="w-full rounded-xl bg-white py-4 font-bold uppercase tracking-widest text-black hover:bg-[#d4a857] disabled:opacity-50">{saving ? "Sending request…" : "Request booking"}</button>
          </form>
        )}

        {activeTab === "account" && (
          <form onSubmit={saveProfile} className="max-w-2xl rounded-[2rem] border border-white/10 bg-[#15151c] p-6 md:p-10 space-y-6">
            <div><h2 className="font-head text-4xl">Account details</h2><p className="text-sm text-gray-500 mt-2">Your email is managed securely through authentication.</p></div>
            <Field label="Artist / display name"><input required maxLength={50} value={profile.display_name} onChange={(e) => setProfile({ ...profile, display_name: e.target.value })} className="form-control" /></Field>
            <Field label="Phone"><input type="tel" autoComplete="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="form-control" placeholder="Optional contact number" /></Field>
            <Field label="Email"><input disabled value={user?.email || ""} className="form-control opacity-60" /></Field>
            <div className="flex flex-col sm:flex-row gap-3"><button disabled={saving} className="rounded-xl bg-white px-7 py-4 font-bold text-black hover:bg-[#d4a857] disabled:opacity-50">Save profile</button><Link href="/auth/login" className="rounded-xl border border-white/10 px-7 py-4 text-center text-sm text-gray-400 hover:text-white">Password & security</Link></div>
          </form>
        )}
      </section>
    </div>
  );
}

function PortalSection({ title, empty, children }: { title: string; empty: string; children: React.ReactNode[] }) {
  return <section><div className="flex items-end justify-between mb-4"><h2 className="font-head text-3xl">{title}</h2></div>{children.length ? <div className="space-y-3">{children}</div> : <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-gray-600">{empty}</div>}</section>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-xs uppercase tracking-widest text-gray-400 mb-2">{label}</span>{children}</label>;
}

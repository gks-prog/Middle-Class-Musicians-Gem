"use client";
import { useEffect, useState } from "react";
import type { Snapshot, StudioContent } from "@/lib/cms/types";

type Collection = "songs" | "visuals" | "testimonials" | "blogs" | "reviews";
type Row = Record<string, string | number>;
type Field = { key: string; label: string; kind?: "long" | "rating" | "category" | "date"; optional?: boolean };
const labels: Record<Collection, string> = { songs: "Songs", visuals: "Latest visuals", testimonials: "Testimonials", blogs: "Blogs", reviews: "Google reviews" };
const fields: Record<Collection, Field[]> = {
  songs: [{ key: "title", label: "Song title" }, { key: "final", label: "Final audio URL" }, { key: "raw", label: "Raw audio URL", optional: true }],
  visuals: [{ key: "title", label: "Video title" }, { key: "artist", label: "Artist" }, { key: "id", label: "YouTube video ID (11 characters)" }],
  testimonials: [{ key: "title", label: "Accessibility label (not shown on the video)" }, { key: "videoSrc", label: "Direct video URL" }],
  blogs: [{ key: "title", label: "Article title" }, { key: "slug", label: "URL name, e.g. preparing-for-your-first-session" }, { key: "category", label: "Category", kind: "category" }, { key: "date", label: "Publication date", kind: "date", optional: true }, { key: "excerpt", label: "Short summary" }, { key: "content", label: "Article text — separate paragraphs with a blank line", kind: "long" }],
  reviews: [{ key: "author", label: "Reviewer name" }, { key: "rating", label: "Stars", kind: "rating" }, { key: "text", label: "Original review wording", kind: "long" }, { key: "sourceUrl", label: "Original Google review / business profile URL" }],
};
const sectionLabels: Record<keyof StudioContent["sections"], string> = { hero: "Hero slideshow", reviews: "Google reviews", ecosystem: "Services / Portfolio / Academy cards", visuals: "Latest visuals", process: "Our process", testimonials: "Video testimonials", faq: "Direct Answers / FAQ", portfolio: "Audio portfolio page", blogs: "Journal and blog articles" };
function blank(tab: Collection): Row {
  const id = crypto.randomUUID();
  if (tab === "songs") return { id, title: "", raw: "", final: "" };
  if (tab === "visuals") return { id: "", title: "", artist: "" };
  if (tab === "testimonials") return { id, title: "Client video", videoSrc: "" };
  if (tab === "reviews") return { id, author: "", rating: 5, text: "", sourceUrl: "", dateLabel: "", sourceScreenshot: "" };
  return { id, title: "", slug: "", category: "rappers", date: new Date().toISOString().slice(0,10), excerpt: "", content: "" };
}
export default function AdminEditor({ initial, email }: { initial: Snapshot; email: string }) {
  const [data, setData] = useState(initial.data);
  const [version, setVersion] = useState(initial.version);
  const [saved, setSaved] = useState(JSON.stringify(initial.data));
  const [tab, setTab] = useState<Collection | "sections">("songs");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const dirty = JSON.stringify(data) !== saved;
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = ""; } };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  const rows = tab === "sections" ? [] : data[tab] as unknown as Row[];
  const updateRows = (next: Row[]) => {
    if (tab !== "sections") setData(previous => ({ ...previous, [tab]: next }) as StudioContent);
    setNotice("");
  };
  const publish = async () => {
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data, version }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not publish.");
      setData(result.data); setVersion(result.version); setSaved(JSON.stringify(result.data)); setNotice("Published. New page loads will show your changes.");
    } catch (error) { setError(error instanceof Error ? error.message : "Could not publish."); }
    finally { setBusy(false); }
  };
  return <div className="mx-auto min-h-screen max-w-7xl px-5 pb-24 pt-32 sm:px-8">
    <header className="mb-8 flex flex-wrap items-start justify-between gap-5">
      <div><p className="eyebrow mb-3">MCM / Content manager</p><h1 className="font-head text-5xl">Your studio. Your website.</h1><p className="mt-3 text-xs text-gray-400">{email}</p></div>
      <div className="flex flex-wrap gap-3">
        <a href="/" target="_blank" rel="noopener noreferrer" className="button-secondary">View website</a>
        <button disabled={busy} className="button-secondary" onClick={async () => {
          if (dirty && !window.confirm("Discard unpublished edits and sign out?")) return;
          setBusy(true); setError("");
          try { const response = await fetch("/api/admin/logout", { method: "POST" }); if (!response.ok) throw new Error("Sign-out failed."); window.location.assign("/admin/login"); }
          catch { setError("Could not sign out. Try again."); setBusy(false); }
        }}>Sign out</button>
      </div>
    </header>
    <div className="sticky top-20 z-30 mb-7 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-[#101014]/95 p-4 backdrop-blur">
      <p className="text-sm text-gray-300">{dirty ? "You have unpublished changes." : "All changes published."} <span className="text-gray-500">Version {version}</span></p>
      <div className="flex flex-wrap gap-3">
        <button disabled={busy || !dirty} className="button-secondary disabled:opacity-40" onClick={() => { if (window.confirm("Discard your unpublished edits?")) { setData(JSON.parse(saved)); setError(""); setNotice(""); } }}>Discard edits</button>
        <button disabled={busy || !dirty} className="button-primary disabled:opacity-40" onClick={publish}>{busy ? "Working…" : "Publish changes"}</button>
      </div>
    </div>
    {notice && <p role="status" className="mb-6 rounded-xl border border-green-400/30 bg-green-400/10 p-4 text-sm text-green-200">{notice}</p>}
    {error && <div role="alert" className="mb-6 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">{error}<div className="mt-3 flex gap-5"><a href="/admin/login" target="_blank" rel="noopener noreferrer" className="underline">Sign in in a new tab</a><button disabled={busy} className="underline" onClick={async () => {
      if (dirty && !window.confirm("Reloading discards your unsaved edits. Continue?")) return;
      setBusy(true);
      try { const response = await fetch("/api/admin/content"); const result = await response.json(); if (!response.ok) throw new Error(result.error); setData(result.data); setVersion(result.version); setSaved(JSON.stringify(result.data)); setError(""); } catch { setError("Could not reload. Your edits are still here."); } finally { setBusy(false); }
    }}>Reload latest content</button></div></div>}
    <nav aria-label="Content categories" className="mb-8 flex flex-wrap gap-2">{(["sections", ...Object.keys(labels)] as (Collection | "sections")[]).map(key => <button key={key} type="button" disabled={busy} aria-pressed={tab === key} onClick={() => setTab(key)} className={`min-h-11 rounded-full border px-5 py-2 text-sm ${tab === key ? "border-gold bg-gold text-black" : "border-white/15 text-gray-300"}`}>{key === "sections" ? "Sections" : labels[key]}</button>)}</nav>
    <fieldset disabled={busy} className="min-w-0">
      {tab === "sections" ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{(Object.keys(sectionLabels) as (keyof StudioContent["sections"])[]).map(key => <label key={key} className="flex min-h-24 cursor-pointer items-center justify-between gap-5 rounded-2xl border border-white/10 bg-[#15151c] p-6"><span>{sectionLabels[key]}</span><input type="checkbox" checked={data.sections[key]} onChange={event => setData(previous => ({ ...previous, sections: { ...previous.sections, [key]: event.target.checked } }))} className="h-5 w-5 accent-[#d4a857]" /></label>)}</div> : <>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-head text-3xl">{labels[tab]}</h2><p className="mt-2 text-sm text-gray-400">Edit the fields below. Move items up or down to change their order.</p></div><button type="button" className="button-secondary" onClick={() => updateRows([...rows, blank(tab)])}>+ Add item</button></div>
        {["songs", "testimonials"].includes(tab) && <p className="mb-5 text-sm leading-7 text-gray-400">Upload media to Cloudinary and paste its direct file URL here. Use audio files for songs and MP4 videos for testimonials. Instagram page links will not play as native videos.</p>}
        {tab === "reviews" && <p className="mb-5 text-sm text-gray-400">Copy real Google reviews exactly, including their original star rating. Dates are kept hidden on the website.</p>}
        {!rows.length && <p className="rounded-2xl border border-dashed border-white/20 p-10 text-center text-gray-400">No items. Use Add item to start.</p>}
        <div className="space-y-5">{rows.map((row, index) => <details key={tab + "-" + index} open className="rounded-2xl border border-white/10 bg-[#15151c] p-5 sm:p-7">
          <summary className="cursor-pointer text-lg font-semibold">{String(row.title || row.author || "New item")}</summary>
          <div className="mt-5 grid gap-5 md:grid-cols-2">{fields[tab].map(field => <label key={field.key} className={`block text-sm text-gray-300 ${field.kind === "long" ? "md:col-span-2" : ""}`}>{field.label}{field.optional ? " (optional)" : ""}
            {field.kind === "long" ? <textarea rows={tab === "blogs" ? 12 : 5} value={String(row[field.key] ?? "")} onChange={event => updateRows(rows.map((item, i) => i === index ? { ...item, [field.key]: event.target.value } : item))} className="form-control mt-2 w-full" /> :
              field.kind === "rating" || field.kind === "category" ? <select value={String(row[field.key])} onChange={event => updateRows(rows.map((item, i) => i === index ? { ...item, [field.key]: field.kind === "rating" ? Number(event.target.value) : event.target.value } : item))} className="form-control mt-2 w-full">{(field.kind === "rating" ? ["1", "2", "3", "4", "5"] : ["rappers", "producers"]).map(option => <option key={option} value={option}>{option}</option>)}</select> :
              <input type={field.kind === "date" ? "date" : "text"} value={String(row[field.key] ?? "")} onChange={event => updateRows(rows.map((item, i) => i === index ? { ...item, [field.key]: event.target.value } : item))} className="form-control mt-2 w-full" />}
          </label>)}</div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" disabled={index === 0} className="min-h-11 rounded-xl border border-white/15 px-4 text-sm disabled:opacity-30" onClick={() => { const next = [...rows]; [next[index-1], next[index]] = [next[index], next[index-1]]; updateRows(next); }}>↑ Move up</button>
            <button type="button" disabled={index === rows.length-1} className="min-h-11 rounded-xl border border-white/15 px-4 text-sm disabled:opacity-30" onClick={() => { const next = [...rows]; [next[index+1], next[index]] = [next[index], next[index+1]]; updateRows(next); }}>↓ Move down</button>
            <button type="button" className="min-h-11 rounded-xl border border-red-300/30 px-4 text-sm text-red-200" onClick={() => { if (window.confirm("Remove this item? The website changes only after you publish.")) updateRows(rows.filter((_, i) => i !== index)); }}>Remove</button>
          </div>
        </details>)}</div>
      </>}
    </fieldset>
  </div>;
}

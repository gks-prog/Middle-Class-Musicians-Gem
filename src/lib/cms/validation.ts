import type { StudioContent } from "./types";
const sections = ["hero", "reviews", "ecosystem", "visuals", "process", "testimonials", "faq", "portfolio", "blogs"];
function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid content object.");
  return value as Record<string, unknown>;
}
function text(value: unknown, label: string, max: number, optional = false): string {
  if (typeof value !== "string" || value.length > max || (!optional && !value.trim())) throw new Error(label + " is missing or too long.");
  return value.trim();
}
function media(value: unknown, label: string, optional = false): string {
  const result = text(value, label, 2000, optional);
  if (!result && optional) return "";
  if (/^\/(?!\/)[A-Za-z0-9/_%.()-]+$/.test(result)) return result;
  let url: URL;
  try { url = new URL(result); } catch { throw new Error(label + " needs a direct HTTPS media URL."); }
  if (url.protocol !== "https:" || url.username || url.password) throw new Error(label + " must use HTTPS.");
  return url.href;
}
function list(value: unknown, label: string): Record<string, unknown>[] {
  if (!Array.isArray(value) || value.length > 100) throw new Error(label + " must contain at most 100 items.");
  const rows = value.map(record);
  const ids = rows.map(row => text(row.id, label + " ID", 100));
  if (new Set(ids).size !== ids.length) throw new Error(label + " contains duplicate IDs.");
  return rows;
}
export function validateContent(value: unknown): StudioContent {
  const root = record(value);
  if (JSON.stringify(root).length > 500000) throw new Error("Content is too large. Use media links instead of pasted files.");
  const visibility = record(root.sections);
  for (const key of sections) if (typeof visibility[key] !== "boolean") throw new Error("Invalid section visibility.");
  const result = {
    sections: Object.fromEntries(sections.map(key => [key, visibility[key]])) as StudioContent["sections"],
    songs: list(root.songs, "Songs").map(row => ({ id: text(row.id, "ID", 100), title: text(row.title, "Song title", 160), raw: media(row.raw, "Raw audio", true), final: media(row.final, "Final audio") })),
    visuals: list(root.visuals, "Visuals").map(row => {
      const id = text(row.id, "YouTube video ID", 11);
      if (!/^[A-Za-z0-9_-]{11}$/.test(id)) throw new Error("Use the 11-character YouTube video ID.");
      return { id, title: text(row.title, "Video title", 160), artist: text(row.artist, "Artist", 160) };
    }),
    reviews: list(root.reviews, "Reviews").map(row => {
      if (!Number.isInteger(row.rating) || Number(row.rating) < 1 || Number(row.rating) > 5) throw new Error("Review ratings must be 1–5.");
      const sourceUrl = media(row.sourceUrl, "Google review source");
      const host = new URL(sourceUrl).hostname;
      if (!["share.google", "maps.app.goo.gl", "google.com"].includes(host) && !host.endsWith(".google.com")) throw new Error("Reviews need an original Google source link.");
      return { id: text(row.id, "ID", 100), author: text(row.author, "Reviewer name", 120), rating: Number(row.rating), text: text(row.text, "Review", 6000), sourceUrl, dateLabel: text(row.dateLabel ?? "", "Date", 100, true), sourceScreenshot: text(row.sourceScreenshot ?? "", "Source screenshot", 300, true) };
    }),
    testimonials: list(root.testimonials, "Testimonials").map(row => ({ id: text(row.id, "ID", 100), title: text(row.title, "Video accessibility label", 160), videoSrc: media(row.videoSrc, "Testimonial video") })),
    blogs: list(root.blogs, "Blogs").map(row => {
      const slug = text(row.slug, "Article URL name", 120);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || ["rappers", "producers"].includes(slug)) throw new Error("Article URL names need lowercase words separated by hyphens.");
      if (!["rappers", "producers"].includes(String(row.category))) throw new Error("Choose a blog category.");
      const date = text(row.date ?? "", "Publication date", 10, true);
      if (date && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || new Date(date).toISOString().slice(0,10) !== date)) throw new Error("Use a valid publication date.");
      return { id: text(row.id, "ID", 100), slug, title: text(row.title, "Article title", 180), excerpt: text(row.excerpt, "Summary", 320), content: text(row.content, "Article body", 30000), category: row.category as "rappers" | "producers", date };
    }),
  };
  if (new Set(result.blogs.map(row => row.slug)).size !== result.blogs.length) throw new Error("Each article needs a different URL name.");
  return result;
}

import "server-only";
import { cookies } from "next/headers";
import defaults from "@/content/studio-defaults.json";
import { validateContent } from "./validation";
import type { Snapshot } from "./types";

export const SESSION_COOKIE = "mcm_admin_session";
export class AdminError extends Error {
  constructor(message: string, public status = 500) { super(message); }
}
export function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new AdminError("Admin setup is incomplete. Configure Supabase and run the admin migration.", 503);
  return { url: url.replace(/\/$/, ""), key };
}
export async function supabase(path: string, init: RequestInit = {}, token?: string) {
  const { url, key } = config();
  return fetch(url + path, { ...init, cache: "no-store", signal: AbortSignal.timeout(10000), headers: { apikey: key, ...(token || key.startsWith("eyJ") ? { Authorization: "Bearer " + (token || key) } : {}), "Content-Type": "application/json", ...init.headers } });
}
export async function requireAdmin(tokenOverride?: string) {
  const token = tokenOverride || (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) throw new AdminError("Please sign in as an administrator.", 401);
  const userResponse = await supabase("/auth/v1/user", {}, token);
  if (!userResponse.ok) throw new AdminError("Your session expired. Sign in again in a new tab, then retry.", 401);
  const user = await userResponse.json();
  if (typeof user.id !== "string") throw new AdminError("Invalid session.", 401);
  const membership = await supabase("/rest/v1/studio_admins?select=user_id&user_id=eq." + encodeURIComponent(user.id), {}, token);
  if (!membership.ok) throw new AdminError("Admin setup is incomplete. Run the database migration.", 503);
  const admins = await membership.json();
  if (!Array.isArray(admins) || admins.length !== 1) throw new AdminError("This account does not have admin access.", 403);
  return { token, email: String(user.email || "") };
}
export async function getSnapshot(token?: string): Promise<Snapshot> {
  const response = await supabase("/rest/v1/studio_content?select=data,version&id=eq.1", {}, token);
  if (!response.ok) throw new AdminError("Content storage is unavailable. Check the database migration.", 503);
  const rows = await response.json();
  if (!Array.isArray(rows) || rows.length !== 1) throw new AdminError("Content storage has not been initialized.", 503);
  return { data: validateContent(rows[0].data ?? defaults), version: rows[0].version };
}
export async function getPublicContent() {
  // The existing website remains available before admin setup or during a backend outage.
  try {
    const { url, key } = config();
    const response = await fetch(url + "/rest/v1/studio_content?select=data&id=eq.1", {
      headers: { apikey: key, ...(key.startsWith("eyJ") ? { Authorization: "Bearer " + key } : {}) },
      next: { revalidate: 60, tags: ["studio-content"] }, signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) throw new Error("Content unavailable");
    const rows = await response.json();
    if (!rows?.[0]?.data) return validateContent(defaults);
    return validateContent(rows[0].data);
  } catch { return validateContent(defaults); }
}
export function sameOrigin(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) throw new AdminError("Request origin was rejected.", 403);
}
export async function readJson(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) throw new AdminError("Expected JSON.", 415);
  if (Number(request.headers.get("content-length") || 0) > 600000) throw new AdminError("Request is too large.", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new AdminError("Request body is missing.", 400);
  const decoder = new TextDecoder();
  let size = 0; let body = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 600000) { await reader.cancel(); throw new AdminError("Request is too large.", 413); }
    body += decoder.decode(value, { stream: true });
  }
  try { return JSON.parse(body + decoder.decode()); } catch { throw new AdminError("Invalid JSON.", 400); }
}
export function failure(error: unknown) {
  const known = error instanceof AdminError;
  return Response.json({ error: known ? error.message : "Request failed. Please try again." }, { status: known ? error.status : 500, headers: { "Cache-Control": "no-store" } });
}

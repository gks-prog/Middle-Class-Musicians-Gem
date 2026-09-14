import { cookies } from "next/headers";
import { AdminError, failure, readJson, requireAdmin, sameOrigin, SESSION_COOKIE, supabase } from "@/lib/cms/server";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const body = await readJson(request);
    if (typeof body?.email !== "string" || body.email.length > 254 || typeof body.password !== "string" || !body.password || body.password.length > 256) throw new AdminError("Enter your email and password.", 400);
    const response = await supabase("/auth/v1/token?grant_type=password", { method: "POST", body: JSON.stringify({ email: body.email.trim(), password: body.password }) });
    if (!response.ok) throw new AdminError(response.status === 429 ? "Too many login attempts. Please wait and try again." : "Sign-in failed. Check your email and password.", response.status === 429 ? 429 : 401);
    const session = await response.json();
    if (typeof session.access_token !== "string") throw new AdminError("Sign-in failed.", 401);
    await requireAdmin(session.access_token);
    (await cookies()).set(SESSION_COOKIE, session.access_token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: Math.min(Number(session.expires_in) || 3600, 3600) });
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return failure(error); }
}

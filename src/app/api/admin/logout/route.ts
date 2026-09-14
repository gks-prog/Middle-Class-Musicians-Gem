import { cookies } from "next/headers";
import { failure, sameOrigin, SESSION_COOKIE, supabase } from "@/lib/cms/server";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const jar = await cookies();
    const token = jar.get(SESSION_COOKIE)?.value;
    jar.set(SESSION_COOKIE, "", { path: "/", maxAge: 0, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
    if (token) { try { await supabase("/auth/v1/logout", { method: "POST" }, token); } catch { /* The local cookie has already been cleared. */ } }
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return failure(error); }
}

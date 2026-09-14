"use client";
import { useState } from "react";
export default function AdminLogin() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return <div className="mx-auto min-h-screen max-w-lg px-6 pb-24 pt-36">
    <p className="eyebrow mb-4">MCM / Studio administration</p>
    <h1 className="font-head text-5xl">Sign in.</h1>
    <p className="mb-8 mt-4 text-sm leading-7 text-gray-400">Manage your website with your administrator email and password.</p>
    <form className="space-y-5 rounded-3xl border border-white/10 bg-[#15151c] p-7" onSubmit={async event => {
      event.preventDefault(); setBusy(true); setError("");
      const values = new FormData(event.currentTarget);
      try {
        const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: values.get("email"), password: values.get("password") }) });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Sign-in failed.");
        window.location.assign("/admin");
      } catch (error) { setError(error instanceof Error ? error.message : "Sign-in failed."); }
      finally { setBusy(false); }
    }}>
      <label className="block text-sm">Email<input name="email" type="email" autoComplete="username" required maxLength={254} className="form-control mt-2 w-full" /></label>
      <label className="block text-sm">Password<input name="password" type="password" autoComplete="current-password" required maxLength={256} className="form-control mt-2 w-full" /></label>
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      <button disabled={busy} className="button-primary w-full disabled:opacity-50">{busy ? "Signing in…" : "Sign in"}</button>
    </form>
  </div>;
}

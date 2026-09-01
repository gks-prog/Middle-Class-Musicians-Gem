"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session)));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setReady(Boolean(session)));
    return () => data.subscription.unsubscribe();
  }, []);

  const updatePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) return setMessage("Passwords do not match.");
    setLoading(true);
    setMessage("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage("Password updated successfully.");
      window.setTimeout(() => router.replace("/dashboard"), 800);
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Password update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5 pb-32 pt-28">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#15151c] p-8 shadow-2xl sm:p-10">
        <p className="mb-3 font-head text-xs uppercase tracking-[0.2em] text-[#d4a857]">Account recovery</p>
        <h1 className="mb-3 font-head text-4xl">Choose a new password</h1>
        <p className="mb-8 text-sm leading-relaxed text-gray-400">Use at least six characters and avoid reusing a password from another service.</p>
        {!ready ? <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-200">Open the password-reset link from your email on this device. If the link expired, <Link href="/auth/login" className="underline">request another</Link>.</div> : (
          <form onSubmit={updatePassword} className="space-y-5">
            <div><label htmlFor="new-password" className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-400">New password</label><input id="new-password" type="password" autoComplete="new-password" minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#07070a] p-4 outline-none focus:border-[#d4a857]" /></div>
            <div><label htmlFor="confirm-password" className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-400">Confirm password</label><input id="confirm-password" type="password" autoComplete="new-password" minLength={6} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#07070a] p-4 outline-none focus:border-[#d4a857]" /></div>
            {message && <p role="status" className="text-sm text-[#d4a857]">{message}</p>}
            <button disabled={loading} className="w-full rounded-xl bg-white py-4 text-xs font-bold uppercase tracking-widest text-black transition hover:bg-[#d4a857] disabled:opacity-50">{loading ? "Updating…" : "Update password"}</button>
          </form>
        )}
      </div>
    </div>
  );
}

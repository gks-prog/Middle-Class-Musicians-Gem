"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { createClient } from "@/lib/supabase";

type Mode = "login" | "signup" | "forgot";
type OtpPurpose = "login" | "signup";
type Feedback = { type: "error" | "success"; message: string } | null;

function safeDestination() {
  const next = new URLSearchParams(window.location.search).get("next");
  return next?.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

function authCallback(destination = safeDestination()) {
  const callback = new URL("/auth/callback", window.location.origin);
  callback.searchParams.set("next", destination);
  return callback.toString();
}

export default function LoginPage() {
  const container = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [otpPurpose, setOtpPurpose] = useState<OtpPurpose | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  useGSAP(() => {
    gsap.from(".login-anim", { y: 24, opacity: 0, duration: 0.75, stagger: 0.08, ease: "power3.out", clearProps: "all" });
  }, { scope: container });

  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get("error");
    if (error) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFeedback({ type: "error", message: error });
    }
  }, []);

  const beginAuthentication = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);
    const supabase = createClient();

    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: authCallback("/auth/update-password") });
        if (error) throw error;
        setFeedback({ type: "success", message: "Password reset link sent. Check your inbox and spam folder." });
        return;
      }

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName.trim() },
            emailRedirectTo: authCallback(),
          },
        });
        if (error) throw error;
        if (data.session) {
          await supabase.auth.signOut({ scope: "local" });
          const { error: otpError } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: authCallback() } });
          if (otpError) throw otpError;
          setOtpPurpose("login");
        } else {
          setOtpPurpose("signup");
        }
        setFeedback({ type: "success", message: "Verification email sent. Enter its six-digit code, or use the secure link in the email." });
        return;
      }

      const { error: passwordError } = await supabase.auth.signInWithPassword({ email, password });
      if (passwordError) throw passwordError;
      await supabase.auth.signOut({ scope: "local" });
      const { error: otpError } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: authCallback() } });
      if (otpError) throw otpError;
      setOtpPurpose("login");
      setFeedback({ type: "success", message: "Password accepted. Enter the email code, or use the secure sign-in link in that email." });
    } catch (error: unknown) {
      setFeedback({ type: "error", message: error instanceof Error ? error.message : "Authentication failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!otpPurpose) return;
    setLoading(true);
    setFeedback(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: otpPurpose === "signup" ? "signup" : "email" });
      if (error) throw error;
      setFeedback({ type: "success", message: "Email verified. Opening your dashboard…" });
      router.replace(safeDestination());
      router.refresh();
    } catch (error: unknown) {
      setFeedback({ type: "error", message: error instanceof Error ? error.message : "That code is invalid or expired." });
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!otpPurpose) return;
    setLoading(true);
    setFeedback(null);
    try {
      const supabase = createClient();
      const result = otpPurpose === "signup"
        ? await supabase.auth.resend({ type: "signup", email, options: { emailRedirectTo: authCallback() } })
        : await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: authCallback() } });
      if (result.error) throw result.error;
      setFeedback({ type: "success", message: "A fresh code has been sent." });
    } catch (error: unknown) {
      setFeedback({ type: "error", message: error instanceof Error ? error.message : "The code could not be resent." });
    } finally {
      setLoading(false);
    }
  };

  const changeMode = (nextMode: Mode) => {
    setMode(nextMode);
    setOtpPurpose(null);
    setOtp("");
    setFeedback(null);
  };

  return (
    <div ref={container} className="flex min-h-screen items-center justify-center px-5 pb-32 pt-28">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#15151c] p-7 shadow-2xl sm:p-10">
        <div className="pointer-events-none absolute right-0 top-0 h-[300px] w-[300px] -translate-y-1/2 translate-x-1/3 rounded-full bg-[#d4a857]/10 blur-[80px]" />
        <div className="login-anim relative z-10 mb-8 text-center">
          <Link href="/" className="mb-2 inline-block font-head text-3xl tracking-widest"><span className="text-[#d4a857]">MCM</span> LOGIN</Link>
          <p className="text-sm text-gray-400">{otpPurpose ? "Confirm it’s really you." : mode === "signup" ? "Create your studio account." : mode === "forgot" ? "Recover access securely." : "Access bookings, purchases and Studio Talk."}</p>
        </div>
        {feedback && <div role={feedback.type === "error" ? "alert" : "status"} className={`relative z-10 mb-6 rounded-xl border p-4 text-sm ${feedback.type === "error" ? "border-red-500/40 bg-red-500/10 text-red-300" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"}`}>{feedback.message}</div>}

        {otpPurpose ? (
          <form onSubmit={verifyOtp} className="login-anim relative z-10 flex flex-col gap-5">
            <div>
              <label htmlFor="login-otp" className="mb-2 block font-head text-xs uppercase tracking-widest text-gray-400">Email code</label>
              <input id="login-otp" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} placeholder="000000" className="w-full rounded-xl border border-white/10 bg-[#07070a] p-4 text-center font-head text-3xl tracking-[0.35em] text-white outline-none transition focus:border-[#d4a857]" />
              <p className="mt-2 text-xs leading-relaxed text-gray-500">Sent to {email}. If the email shows a secure sign-in button instead of a code, use that button—the callback will return you here safely.</p>
            </div>
            <button type="submit" disabled={loading || otp.length !== 6} className="w-full rounded-xl bg-white py-4 text-xs font-bold uppercase tracking-widest text-black transition hover:bg-[#d4a857] disabled:opacity-40">{loading ? "Verifying…" : "Verify & continue"}</button>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest"><button type="button" onClick={() => changeMode(otpPurpose === "signup" ? "signup" : "login")} className="text-gray-500 hover:text-white">Back</button><button type="button" onClick={resendOtp} disabled={loading} className="text-[#d4a857] hover:text-white disabled:opacity-40">Resend code</button></div>
          </form>
        ) : (
          <form onSubmit={beginAuthentication} className="login-anim relative z-10 flex flex-col gap-5">
            {mode === "signup" && <div><label htmlFor="display-name" className="mb-2 block font-head text-xs uppercase tracking-widest text-gray-400">Name</label><input id="display-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} required maxLength={80} autoComplete="name" placeholder="Your artist name" className="w-full rounded-xl border border-white/10 bg-[#07070a] p-4 text-white outline-none transition focus:border-[#d4a857]" /></div>}
            <div><label htmlFor="login-email" className="mb-2 block font-head text-xs uppercase tracking-widest text-gray-400">Email</label><input id="login-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="artist@domain.com" className="w-full rounded-xl border border-white/10 bg-[#07070a] p-4 text-white outline-none transition focus:border-[#d4a857]" /></div>
            {mode !== "forgot" && <div><div className="mb-2 flex items-center justify-between"><label htmlFor="login-password" className="font-head text-xs uppercase tracking-widest text-gray-400">Password</label>{mode === "login" && <button type="button" onClick={() => changeMode("forgot")} className="text-[10px] font-bold uppercase tracking-widest text-[#d4a857] hover:text-white">Forgot password?</button>}</div><div className="relative"><input id="login-password" type={showPassword ? "text" : "password"} required autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} placeholder="••••••••" className="w-full rounded-xl border border-white/10 bg-[#07070a] p-4 pr-20 text-white outline-none transition focus:border-[#d4a857]" /><button type="button" onClick={() => setShowPassword((show) => !show)} className="absolute inset-y-0 right-0 px-4 text-[9px] font-bold uppercase tracking-widest text-gray-500 hover:text-white" aria-label={`${showPassword ? "Hide" : "Show"} password`}>{showPassword ? "Hide" : "Show"}</button></div></div>}
            <button type="submit" disabled={loading} className="mt-2 w-full rounded-xl bg-white py-4 text-xs font-bold uppercase tracking-widest text-black transition hover:bg-[#d4a857] disabled:opacity-50">{loading ? "Processing…" : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Continue securely"}</button>
            {mode === "login" && <p className="text-center text-[10px] leading-relaxed text-gray-500">Your password is checked first, then a one-time email code confirms the login.</p>}
          </form>
        )}
        {!otpPurpose && <div className="login-anim relative z-10 mt-7 border-t border-white/10 pt-6 text-center text-xs uppercase tracking-widest text-gray-500">{mode === "forgot" ? <button type="button" onClick={() => changeMode("login")} className="font-bold text-[#d4a857] hover:text-white">Back to login</button> : <>{mode === "signup" ? "Already registered?" : "New here?"} <button type="button" onClick={() => changeMode(mode === "signup" ? "login" : "signup")} className="ml-1 font-bold text-[#d4a857] hover:text-white">{mode === "signup" ? "Log in" : "Create account"}</button></>}</div>}
      </div>
    </div>
  );
}

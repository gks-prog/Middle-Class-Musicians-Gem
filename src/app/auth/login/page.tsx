"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { createClient } from "@/lib/supabase";

type Channel = "sms" | "whatsapp";
type Feedback = { type: "error" | "success"; message: string } | null;

function safeDestination() {
  const next = new URLSearchParams(window.location.search).get("next");
  return next?.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

function indianPhone(localNumber: string) {
  return `+91${localNumber.replace(/\D/g, "")}`;
}

export default function LoginPage() {
  const container = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);

  useGSAP(() => {
    gsap.from(".login-anim", { y: 24, opacity: 0, duration: 0.75, stagger: 0.08, ease: "power3.out", clearProps: "all" });
  }, { scope: container });

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const updatePhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    setPhone(digits);
    setFeedback(null);
  };

  const sendOtp = async (event?: React.FormEvent) => {
    event?.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setFeedback({ type: "error", message: "Enter a valid 10-digit Indian mobile number." });
      return;
    }

    setLoading(true);
    setFeedback(null);
    try {
      const { error } = await createClient().auth.signInWithOtp({
        phone: indianPhone(phone),
        options: { channel, shouldCreateUser: true },
      });
      if (error) throw error;
      setOtpSent(true);
      setOtp("");
      setCooldown(60);
      setFeedback({ type: "success", message: `Six-digit code sent by ${channel === "whatsapp" ? "WhatsApp" : "SMS"}.` });
    } catch (error: unknown) {
      setFeedback({ type: "error", message: error instanceof Error ? error.message : "The code could not be sent. Please retry." });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (otp.length !== 6) return;
    setLoading(true);
    setFeedback(null);
    try {
      const { error } = await createClient().auth.verifyOtp({
        phone: indianPhone(phone),
        token: otp,
        type: "sms",
      });
      if (error) throw error;
      setFeedback({ type: "success", message: "Phone verified. Opening your dashboard…" });
      router.replace(safeDestination());
      router.refresh();
    } catch (error: unknown) {
      setFeedback({ type: "error", message: error instanceof Error ? error.message : "That code is invalid or expired." });
    } finally {
      setLoading(false);
    }
  };

  const changeNumber = () => {
    setOtpSent(false);
    setOtp("");
    setCooldown(0);
    setFeedback(null);
  };

  const maskedPhone = phone.length === 10 ? `+91 ••••••${phone.slice(-4)}` : "+91";

  return (
    <div ref={container} className="flex min-h-screen items-center justify-center px-5 pb-32 pt-28">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#15151c] p-7 shadow-2xl sm:p-10">
        <div className="pointer-events-none absolute right-0 top-0 h-[300px] w-[300px] -translate-y-1/2 translate-x-1/3 rounded-full bg-[#d4a857]/10 blur-[80px]" />

        <div className="login-anim relative z-10 mb-8 text-center">
          <Link href="/" className="mb-2 inline-block font-head text-3xl tracking-widest"><span className="text-[#d4a857]">MCM</span> ACCESS</Link>
          <p className="text-sm leading-relaxed text-gray-400">{otpSent ? `Enter the code sent to ${maskedPhone}.` : "Log in or create your account with one verified phone number."}</p>
        </div>

        {feedback && <div role={feedback.type === "error" ? "alert" : "status"} className={`relative z-10 mb-6 rounded-xl border p-4 text-sm ${feedback.type === "error" ? "border-red-500/40 bg-red-500/10 text-red-300" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"}`}>{feedback.message}</div>}

        {!otpSent ? (
          <form onSubmit={sendOtp} className="login-anim relative z-10 space-y-6">
            <fieldset>
              <legend className="mb-3 font-head text-xs uppercase tracking-widest text-gray-400">Receive code via</legend>
              <div className="grid grid-cols-2 gap-3">
                {([['whatsapp', 'WhatsApp'], ['sms', 'SMS']] as const).map(([value, label]) => (
                  <button key={value} type="button" onClick={() => { setChannel(value); setFeedback(null); }} aria-pressed={channel === value} className={`min-h-14 rounded-xl border px-4 text-xs font-bold uppercase tracking-widest transition ${channel === value ? "border-[#d4a857] bg-[#d4a857]/10 text-[#d4a857]" : "border-white/10 bg-[#07070a] text-gray-500 hover:border-white/30 hover:text-white"}`}>{label}</button>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="phone-number" className="mb-2 block font-head text-xs uppercase tracking-widest text-gray-400">Mobile number</label>
              <div className="flex overflow-hidden rounded-xl border border-white/10 bg-[#07070a] transition focus-within:border-[#d4a857]">
                <span className="flex items-center border-r border-white/10 px-4 text-sm font-bold text-gray-300">+91</span>
                <input id="phone-number" type="tel" inputMode="numeric" autoComplete="tel-national" pattern="[6-9][0-9]{9}" maxLength={10} required value={phone} onChange={(event) => updatePhone(event.target.value)} placeholder="98765 43210" className="min-w-0 flex-1 bg-transparent p-4 text-white outline-none" />
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-gray-500">Use a number that can receive {channel === "whatsapp" ? "WhatsApp messages" : "SMS"}. New numbers create an account automatically.</p>
            </div>

            <button type="submit" disabled={loading || phone.length !== 10} className="w-full rounded-xl bg-white py-4 text-xs font-bold uppercase tracking-widest text-black transition hover:bg-[#d4a857] disabled:opacity-40">{loading ? "Sending code…" : `Send code on ${channel === "whatsapp" ? "WhatsApp" : "SMS"}`}</button>
            <p className="text-center text-[10px] leading-relaxed text-gray-600">By continuing, you agree to receive a one-time authentication message. Standard provider charges may apply.</p>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="login-anim relative z-10 space-y-5">
            <div>
              <label htmlFor="phone-otp" className="mb-2 block font-head text-xs uppercase tracking-widest text-gray-400">Six-digit code</label>
              <input id="phone-otp" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required autoFocus value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" className="w-full rounded-xl border border-white/10 bg-[#07070a] p-4 text-center font-head text-3xl tracking-[0.35em] text-white outline-none transition focus:border-[#d4a857]" />
            </div>
            <button type="submit" disabled={loading || otp.length !== 6} className="w-full rounded-xl bg-white py-4 text-xs font-bold uppercase tracking-widest text-black transition hover:bg-[#d4a857] disabled:opacity-40">{loading ? "Verifying…" : "Verify & continue"}</button>
            <div className="flex items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-widest"><button type="button" onClick={changeNumber} className="text-gray-500 hover:text-white">Change number</button><button type="button" onClick={() => sendOtp()} disabled={loading || cooldown > 0} className="text-[#d4a857] hover:text-white disabled:text-gray-600">{cooldown > 0 ? `Resend in ${cooldown}s` : `Resend via ${channel === "whatsapp" ? "WhatsApp" : "SMS"}`}</button></div>
          </form>
        )}
      </div>
    </div>
  );
}

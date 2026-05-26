"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const container = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; message: string } | null>(null);

  useGSAP(() => {
    gsap.fromTo(".gsap-reveal", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" }
    );
  }, { scope: container });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      if (isSignUp) {
        // Registration Flow
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        
        if (error) throw error;
        setFeedback({ type: "success", message: "Registration successful! You can now log in." });
        setIsSignUp(false); // Switch to login view automatically
      } else {
        // Login Flow
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        setFeedback({ type: "success", message: "Authenticating..." });
        router.push("/blogs"); // Redirect to community/blogs after login
      }
    } catch (error: any) {
      setFeedback({ type: "error", message: error.message || "Authentication failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={container} className="min-h-screen flex items-center justify-center pt-20 px-6">
      <div className="w-full max-w-md p-10 rounded-3xl bg-[#15151c] border border-white/10 relative overflow-hidden">
        {/* Cinematic Lighting Effect */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#d4a857]/10 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
        
        <div className="relative z-10 text-center mb-10 gsap-reveal">
          <Link href="/" className="inline-block font-head text-3xl tracking-widest mb-2">
            <span className="text-[#d4a857]">MCM</span> PORTAL
          </Link>
          <p className="text-gray-400 text-sm">
            {isSignUp ? "Create an account to join the community." : "Sign in to access the studio community."}
          </p>
        </div>

        {feedback && (
          <div className={`relative z-10 p-4 mb-6 rounded-xl text-sm font-semibold tracking-wide border ${
            feedback.type === "error" ? "bg-red-500/10 border-red-500/50 text-red-400" : "bg-green-500/10 border-green-500/50 text-green-400"
          }`}>
            {feedback.message}
          </div>
        )}

        <form onSubmit={handleAuth} className="relative z-10 flex flex-col gap-5 gsap-reveal">
          <div>
            <label className="block font-head text-xs tracking-widest text-gray-400 mb-2 uppercase">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="artist@domain.com" 
              className="w-full bg-[#07070a] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#d4a857] transition-colors" 
            />
          </div>
          <div>
            <label className="block font-head text-xs tracking-widest text-gray-400 mb-2 uppercase">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              minLength={6}
              className="w-full bg-[#07070a] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#d4a857] transition-colors" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 mt-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-[#d4a857] transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : (isSignUp ? "Create Account" : "Enter Portal")}
          </button>
        </form>

        <div className="mt-8 text-center gsap-reveal relative z-10 border-t border-white/10 pt-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button 
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setFeedback(null); }}
              className="text-[#d4a857] font-bold cursor-pointer hover:text-white transition-colors"
            >
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

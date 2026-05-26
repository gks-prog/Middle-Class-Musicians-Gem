"use client";

import { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [btnText, setBtnText] = useState("Send Inquiry");

  const handleWhatsAppSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setBtnText("Opening WhatsApp...");

    const formData = new FormData(e.currentTarget);
    const waText = `*New Studio Enquiry*%0A%0A*Name:* ${formData.get("name")}%0A*Service Required:* ${formData.get("service")}%0A*Message:* ${formData.get("message")}`;
    
    setTimeout(() => {
      window.open(`https://wa.me/919315778147?text=${waText}`, "_blank");
      setBtnText("Sent Successfully ✓");
      setTimeout(() => { setIsSubmitting(false); setBtnText("Send Inquiry"); (e.target as HTMLFormElement).reset(); }, 3000);
    }, 800);
  };

  return (
    <footer className="w-full bg-[#0c0c10] border-t border-white/5 relative z-10">
      
      {/* 1. GLOBAL CONTACT FUNNEL */}
      <div className="container mx-auto px-6 pt-24 pb-16 border-b border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 bg-[#15151c] p-8 md:p-14 rounded-[2.5rem] border border-white/5 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#d4a857]/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3 animate-pulse duration-[5000ms]" />
          
          <div className="relative z-10">
            <span className="text-[#d4a857] font-head tracking-[0.2em] uppercase text-sm block mb-4">Connect</span>
            <h2 className="text-5xl md:text-7xl font-head leading-none mb-6">Let's make something <em className="text-[#d4a857] not-italic text-glow">iconic.</em></h2>
            <p className="text-gray-400 mb-10 max-w-md text-sm leading-relaxed">Select your required service and send us a direct inquiry. Our engineers will reply via WhatsApp immediately.</p>
            
            <a href="https://wa.me/919315778147" data-sound="click" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 p-4 rounded-2xl border border-white/5 hover:border-[#d4a857]/50 box-glow-hover transition-all duration-300 bg-[#07070a] w-fit pr-8 group">
              <div className="w-12 h-12 rounded-full bg-[#15151c] flex items-center justify-center text-[#d4a857] font-head text-xl group-hover:scale-110 transition-transform">WA</div>
              <div>
                <strong className="block text-sm text-white group-hover:text-[#d4a857] transition-colors">WhatsApp Direct</strong>
                <span className="text-xs text-gray-500 font-mono mt-1 block">+91 93157 78147</span>
              </div>
            </a>
          </div>

          <form onSubmit={handleWhatsAppSubmit} className="relative z-10 flex flex-col gap-6">
            <input type="text" name="name" required placeholder="Your Name / Artist Name" data-sound="hover" className="w-full bg-[#07070a] border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-[#d4a857] focus:shadow-[0_0_20px_rgba(212,168,87,0.2)] transition-all duration-300" />
            <select name="service" required data-sound="click" className="w-full bg-[#07070a] border border-white/10 rounded-2xl p-5 text-gray-400 focus:outline-none focus:border-[#d4a857] focus:shadow-[0_0_20px_rgba(212,168,87,0.2)] transition-all duration-300 appearance-none cursor-pointer">
              <option value="" disabled selected>Select a Service</option>
              <option value="Recording & Mixing">Recording & Mixing</option>
              <option value="Beat Production">Beat Production</option>
              <option value="Video Production">Video Production</option>
              <option value="Music Courses">Academy / Courses</option>
            </select>
            <textarea name="message" required rows={4} placeholder="Tell us about your project or vision..." data-sound="hover" className="w-full bg-[#07070a] border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-[#d4a857] focus:shadow-[0_0_20px_rgba(212,168,87,0.2)] transition-all duration-300 resize-none" />
            
            <button type="submit" disabled={isSubmitting} data-sound="click" className="w-full py-5 bg-white text-black font-bold uppercase tracking-widest rounded-2xl hover:bg-[#d4a857] box-glow-hover hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 mt-2">
              {btnText}
            </button>
          </form>
        </div>
      </div>

      {/* 2. STANDARD FOOTER & MAP */}
      <div className="container mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mb-20">
          <div className="lg:col-span-1">
            <h3 className="font-head text-4xl tracking-widest mb-4 flex items-center gap-2">
              <span className="text-[#d4a857] text-glow">MCM</span> STUDIO
            </h3>
            <p className="text-gray-400 text-sm max-w-sm mb-8 leading-relaxed">
              Delhi's premier studio for Recording, Mixing, Mastering, and Beat Production. Built for sound. Designed for vision.
            </p>
            <div className="flex gap-8 text-xs font-bold tracking-[0.2em] uppercase text-gray-500">
              <a href="https://instagram.com/middleclassmusicians" data-sound="hover" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:text-glow transition-all">Instagram</a>
            </div>
          </div>

          <div className="flex flex-col gap-4 font-head text-2xl tracking-widest uppercase text-gray-400">
            {["Studio", "Services", "Portfolio", "Blogs", "Courses"].map((link) => (
              <Link key={link} href={`/${link.toLowerCase()}`} data-sound="hover" className="hover:text-white hover:translate-x-2 transition-all w-fit">{link}</Link>
            ))}
          </div>

          <div className="flex justify-start md:justify-end lg:col-span-1">
            <div className="w-full max-w-sm h-56 rounded-3xl overflow-hidden border border-white/5 bg-[#15151c] relative group cursor-pointer shadow-xl" data-sound="hover">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224098.81604169542!2d76.9531792!3d28.6469655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sDelhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" width="100%" height="100%" style={{ border: 0, pointerEvents: "none", filter: "grayscale(100%) invert(92%) contrast(83%)" }} allowFullScreen={false} loading="lazy" className="opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 block" />
              <a href="https://maps.app.goo.gl/47Ez6RdTwQ1ZUizU7" target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10 flex items-end justify-end p-4">
                <span className="px-4 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-[#d4a857] group-hover:text-white group-hover:bg-[#d4a857]/20 transition-all">Open Maps ↗</span>
              </a>
            </div>
          </div>
        </div>

        <div className="text-xs font-semibold tracking-widest uppercase text-gray-600 border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>© {year} Middle Class Musicians.</span>
          <span>A venture by Wenon Bont & Bunny Nation Music</span>
        </div>
      </div>
    </footer>
  );
}

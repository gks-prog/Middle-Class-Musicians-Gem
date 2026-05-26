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
    const name = formData.get("name");
    const service = formData.get("service");
    const message = formData.get("message");

    const waText = `*New Studio Enquiry*%0A%0A*Name:* ${name}%0A*Service Required:* ${service}%0A*Message:* ${message}`;
    const waURL = `https://wa.me/919315778147?text=${waText}`;

    setTimeout(() => {
      window.open(waURL, "_blank");
      setBtnText("Sent Successfully ✓");
      setTimeout(() => {
        setIsSubmitting(false);
        setBtnText("Send Inquiry");
        (e.target as HTMLFormElement).reset();
      }, 3000);
    }, 800);
  };

  return (
    <footer className="w-full bg-[#0c0c10] border-t border-white/10 relative z-10">
      {/* 1. GLOBAL CONTACT FUNNEL */}
      <div className="container mx-auto px-6 pt-24 pb-16 border-b border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 bg-[#15151c] p-8 md:p-12 rounded-[2rem] border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4a857]/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative z-10">
            <span className="text-[#d4a857] font-head tracking-[0.2em] uppercase text-sm block mb-4">Connect</span>
            <h2 className="text-4xl md:text-6xl font-head leading-none mb-6">Let's make something <em className="text-[#d4a857] not-italic">iconic.</em></h2>
            <p className="text-gray-400 mb-8 max-w-md">Select your required service and send us a direct inquiry. Our engineers will reply via WhatsApp immediately.</p>
            
            <div className="space-y-4">
              <a href="https://wa.me/919315778147" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 p-4 rounded-xl border border-white/10 hover:border-[#d4a857] transition-colors bg-[#07070a] w-fit pr-8">
                <div className="w-10 h-10 rounded-full bg-[#15151c] flex items-center justify-center text-[#d4a857] font-head">WA</div>
                <div>
                  <strong className="block text-sm">WhatsApp Direct</strong>
                  <span className="text-xs text-gray-400">+91 93157 78147</span>
                </div>
              </a>
            </div>
          </div>

          <form onSubmit={handleWhatsAppSubmit} className="relative z-10 flex flex-col gap-5">
            <div>
              <input type="text" name="name" required placeholder="Your Name / Artist Name" className="w-full bg-[#07070a] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#d4a857] transition-colors" />
            </div>
            <div>
              <select name="service" required className="w-full bg-[#07070a] border border-white/10 rounded-xl p-4 text-gray-400 focus:outline-none focus:border-[#d4a857] transition-colors appearance-none cursor-pointer">
                <option value="" disabled selected>Select a Service</option>
                <option value="Recording & Mixing">Recording & Mixing</option>
                <option value="Beat Production">Beat Production</option>
                <option value="Video Production">Video Production</option>
                <option value="Music Courses">Academy / Courses</option>
              </select>
            </div>
            <div>
              <textarea name="message" required rows={3} placeholder="Tell us about your project or vision..." className="w-full bg-[#07070a] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#d4a857] transition-colors resize-none" />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-[#d4a857] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {btnText}
            </button>
          </form>
        </div>
      </div>

      {/* 2. STANDARD FOOTER & MAP */}
      <div className="container mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-1">
            <h3 className="font-head text-3xl tracking-widest mb-4 flex items-center gap-2">
              <span className="text-[#d4a857]">MCM</span> STUDIO
            </h3>
            <p className="text-gray-400 text-sm max-w-sm mb-6">
              Delhi's premier studio for Recording, Mixing, Mastering, and Beat Production. Built for sound. Designed for vision.
            </p>
            <div className="flex gap-6 text-sm font-semibold tracking-widest uppercase text-gray-500">
              <a href="https://instagram.com/middleclassmusicians" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
            </div>
          </div>

          <div className="flex flex-col gap-3 font-head text-xl tracking-widest uppercase text-gray-400">
            <Link href="/studio" className="hover:text-white transition-colors w-fit">Studio</Link>
            <Link href="/services" className="hover:text-white transition-colors w-fit">Services</Link>
            <Link href="/portfolio" className="hover:text-white transition-colors w-fit">Portfolio</Link>
            <Link href="/blogs" className="hover:text-white transition-colors w-fit">Editorial</Link>
          </div>

          <div className="flex justify-start md:justify-end lg:col-span-1">
            <div className="w-full max-w-md h-48 rounded-xl overflow-hidden border border-white/10 bg-[#15151c] relative group cursor-pointer">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224098.81604169542!2d76.9531792!3d28.6469655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sDelhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0, pointerEvents: "none", filter: "grayscale(100%) invert(92%) contrast(83%)" }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-70 group-hover:opacity-100 transition-opacity duration-300 block"
              />
              <a 
                href="https://maps.app.goo.gl/47Ez6RdTwQ1ZUizU7" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="absolute inset-0 z-10 flex items-end justify-end p-3"
              >
                <span className="px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/10 rounded text-[10px] uppercase tracking-widest text-[#d4a857] hover:text-white transition-colors">
                  Open Maps ↗
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>© {year} Middle Class Musicians. All rights reserved.</span>
          <span>A venture by Wenon Bont & Bunny Nation Music</span>
        </div>
      </div>
    </footer>
  );
}

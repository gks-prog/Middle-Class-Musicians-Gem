"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
    }`}>
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="font-head text-2xl tracking-widest flex items-center gap-2">
          {/* Next.js Image component should be used here for the logo */}
          <span className="text-gold">MCM</span>
        </Link>

        <nav className="hidden md:flex gap-8">
          {[
            { name: "Studio", path: "/studio" },
            { name: "Services", path: "/services" },
            { name: "Portfolio", path: "/portfolio" },
            { name: "Courses", path: "/courses" },
          ].map((item) => (
            <Link 
              key={item.name} 
              href={item.path}
              className={`text-sm uppercase tracking-wider transition-colors ${
                pathname === item.path ? "text-white font-bold" : "text-gray-400 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Link href="/auth/login" className="text-sm uppercase tracking-wider text-gold font-bold">
            Portal
          </Link>
        </nav>

        <a 
          href="https://wa.me/919315778147" 
          target="_blank" 
          rel="noreferrer"
          className="hidden md:inline-flex px-6 py-2 bg-white text-black rounded-full font-bold text-sm uppercase hover:bg-gold hover:text-black transition-all"
          data-sound="hover"
        >
          Book Session
        </a>
      </div>
    </header>
  );
}

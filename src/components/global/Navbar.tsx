"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [pathname]);

  const navLinks = [
    { name: "Studio", path: "/studio" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Blogs", path: "/blogs" },
    { name: "Courses", path: "/courses" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${
          scrolled || isOpen
            ? "bg-[#07070a]/80 backdrop-blur-xl border-b border-white/5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="font-head text-2xl tracking-widest flex items-center gap-2 relative z-50 group" data-sound="hover">
            <span className="text-[#d4a857] group-hover:text-glow transition-all duration-300">MCM</span>
            <span className="hidden sm:inline-block text-white/90">STUDIO</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                data-sound="hover"
                className={`text-sm uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 ${
                  pathname === link.path 
                    ? "text-white font-bold text-glow" 
                    : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="/auth/login" 
              data-sound="hover"
              className="text-sm uppercase tracking-widest font-bold text-[#d4a857] hover:text-white hover:text-glow transition-all duration-300 hover:-translate-y-0.5"
            >
              Client Portal
            </Link>
          </nav>

          <a
            href="https://wa.me/919315778147"
            target="_blank"
            rel="noopener noreferrer"
            data-sound="click"
            className="hidden lg:inline-flex items-center justify-center px-7 py-2.5 rounded-full bg-white text-black font-head tracking-wider text-lg hover:bg-[#d4a857] hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(212,168,87,0.6)]"
          >
            Book Session
          </a>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 relative z-50 group" 
            aria-label="Toggle Menu"
            data-sound="click"
          >
            <span className={`w-6 h-[2px] bg-white block transition-all duration-300 ease-out group-hover:bg-[#d4a857] ${isOpen ? "translate-y-[8px] rotate-45" : ""}`}></span>
            <span className={`w-6 h-[2px] bg-white block transition-all duration-300 ease-out group-hover:bg-[#d4a857] ${isOpen ? "opacity-0" : ""}`}></span>
            <span className={`w-6 h-[2px] bg-white block transition-all duration-300 ease-out group-hover:bg-[#d4a857] ${isOpen ? "-translate-y-[8px] -rotate-45" : ""}`}></span>
          </button>
        </div>
      </header>

      <div 
        className={`fixed inset-0 bg-[#07070a]/95 backdrop-blur-3xl z-40 flex flex-col items-center justify-center transition-all duration-700 ease-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              data-sound="hover"
              className="text-4xl font-head tracking-widest uppercase text-gray-400 hover:text-white hover:scale-110 hover:text-glow transition-all duration-300"
            >
              {link.name}
            </Link>
          ))}
          <Link href="/auth/login" data-sound="hover" className="text-4xl font-head tracking-widest uppercase text-[#d4a857] mt-4 hover:text-glow hover:scale-110 transition-all duration-300">
            Client Portal
          </Link>
        </nav>
      </div>
    </>
  );
}

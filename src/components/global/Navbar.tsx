"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Studio", path: "/studio" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Courses", path: "/courses" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled || isOpen
            ? "bg-[#07070a]/90 backdrop-blur-md border-b border-white/10 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="font-head text-2xl tracking-widest flex items-center gap-2 relative z-50">
            <span className="text-[#d4a857]">MCM</span>
            <span className="hidden sm:inline-block">STUDIO</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`text-sm uppercase tracking-widest transition-colors duration-300 ${
                  pathname === link.path ? "text-white font-semibold" : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link href="/auth/login" className="text-sm uppercase tracking-widest font-semibold text-[#d4a857] hover:text-white transition-colors duration-300">
              Client Portal
            </Link>
          </nav>

          <a
            href="https://wa.me/919315778147"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-white text-black font-head tracking-wider text-lg hover:bg-[#d4a857] hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(212,168,87,0)] hover:shadow-[0_0_20px_rgba(212,168,87,0.3)]"
          >
            Book Session
          </a>

          {/* Mobile Hamburger Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 relative z-50" 
            aria-label="Toggle Menu"
          >
            <span className={`w-6 h-[2px] bg-white block transition-transform duration-300 ${isOpen ? "translate-y-[8px] rotate-45" : ""}`}></span>
            <span className={`w-6 h-[2px] bg-white block transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`}></span>
            <span className={`w-6 h-[2px] bg-white block transition-transform duration-300 ${isOpen ? "-translate-y-[8px] -rotate-45" : ""}`}></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-[#07070a]/95 backdrop-blur-2xl z-40 flex flex-col items-center justify-center transition-all duration-500 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className="text-3xl font-head tracking-widest uppercase text-white hover:text-[#d4a857] transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link href="/auth/login" className="text-3xl font-head tracking-widest uppercase text-[#d4a857] mt-4">
            Client Portal
          </Link>
          <a
            href="https://wa.me/919315778147"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 px-8 py-3 rounded-full border border-[#d4a857] text-[#d4a857] font-head tracking-wider text-xl uppercase"
          >
            Book on WhatsApp
          </a>
        </nav>
      </div>
    </>
  );
}

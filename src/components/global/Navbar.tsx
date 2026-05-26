"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle the scroll effect for the glassmorphism header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Studio", path: "/studio" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Courses", path: "/courses" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#07070a]/85 backdrop-blur-md border-b border-white/10 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="font-head text-2xl tracking-widest flex items-center gap-2">
          <span className="text-[#d4a857]">MCM</span>
          <span className="hidden sm:inline-block">STUDIO</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`text-sm uppercase tracking-widest transition-colors duration-300 ${
                  isActive 
                    ? "text-white font-semibold" 
                    : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          
          {/* Client Portal Link */}
          <Link
            href="/auth/login"
            className="text-sm uppercase tracking-widest font-semibold text-[#d4a857] hover:text-white transition-colors duration-300"
          >
            Client Portal
          </Link>
        </nav>

        {/* CTA Button */}
        <a
          href="https://wa.me/919315778147"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-white text-black font-head tracking-wider text-lg hover:bg-[#d4a857] hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(212,168,87,0)] hover:shadow-[0_0_20px_rgba(212,168,87,0.3)]"
          data-sound="hover"
        >
          Book Session
        </a>

        {/* Mobile Menu Hamburger (Logic will be wired up later if needed) */}
        <button 
          className="md:hidden flex flex-col gap-1.5 p-2" 
          aria-label="Toggle Menu" 
          data-sound="click"
        >
          <span className="w-6 h-[2px] bg-white block transition-transform"></span>
          <span className="w-6 h-[2px] bg-white block transition-opacity"></span>
          <span className="w-6 h-[2px] bg-white block transition-transform"></span>
        </button>
        
      </div>
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SoundToggle from "./SoundToggle";
import { siteConfig } from "@/lib/site";

const navLinks = [
  { name: "Studio", path: "/studio" },
  { name: "Services", path: "/services" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Blogs", path: "/blogs" },
  { name: "Courses", path: "/courses" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          scrolled || isOpen
            ? "border-white/5 bg-[#07070a]/90 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl"
            : "border-transparent bg-gradient-to-b from-black/45 to-transparent py-5"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between gap-5 px-5 sm:px-6 md:px-10">
          <Link
            href="/"
            className="group relative z-50 flex min-h-11 items-center gap-2 font-head text-2xl tracking-widest"
            data-sound="hover"
            aria-label="Middle Class Musicians home"
          >
            <span className="text-[#d4a857] transition group-hover:text-glow">MCM</span>
            <span className="hidden text-white/90 sm:inline">Studio</span>
          </Link>

          <nav className="hidden items-center gap-5 lg:flex xl:gap-7" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                data-sound="hover"
                aria-current={isActive(link.path) ? "page" : undefined}
                className={`relative flex min-h-11 items-center text-[11px] font-bold uppercase tracking-[0.16em] transition hover:text-white ${
                  isActive(link.path) ? "text-white after:absolute after:inset-x-0 after:bottom-1 after:h-px after:bg-[#d4a857]" : "text-[#a1a1aa]"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/auth/login"
              data-sound="hover"
              aria-current={isActive("/auth/login") ? "page" : undefined}
              className="flex min-h-11 items-center text-[11px] font-bold uppercase tracking-[0.16em] text-[#d4a857] transition hover:text-white"
            >
              Client Portal
            </Link>
          </nav>

          <div className="relative z-50 flex items-center gap-2">
            <div className="hidden lg:block">
              <SoundToggle compact />
            </div>
            <a
              href={`${siteConfig.whatsapp}?text=Hi%20MCM%2C%20I%20want%20to%20book%20a%20studio%20session.`}
              target="_blank"
              rel="noopener noreferrer"
              data-sound="click"
              className="hidden min-h-11 items-center justify-center rounded-full bg-white px-6 font-head text-base tracking-wider text-black transition hover:scale-[1.03] hover:bg-[#d4a857] xl:inline-flex"
            >
              Book Session
            </a>

            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              className="group flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-white/10 lg:hidden"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              data-sound="click"
            >
              <span className={`block h-0.5 w-5 bg-white transition ${isOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 bg-white transition ${isOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-5 bg-white transition ${isOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-navigation"
        className={`fixed inset-0 z-40 overflow-y-auto bg-[#07070a]/98 px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-28 backdrop-blur-3xl transition duration-300 lg:hidden ${
          isOpen ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
        }`}
      >
        <nav className="mx-auto flex min-h-full max-w-md flex-col justify-center gap-2" aria-label="Mobile navigation">
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setIsOpen(false)}
              aria-current={isActive(link.path) ? "page" : undefined}
              className={`flex min-h-14 items-center justify-between border-b border-white/5 py-3 font-head text-4xl uppercase tracking-widest transition ${
                isActive(link.path) ? "text-[#d4a857]" : "text-gray-300 hover:text-white"
              }`}
            >
              <span>{link.name}</span>
              <span className="font-body text-[10px] tracking-widest text-gray-600">0{index + 1}</span>
            </Link>
          ))}
          <Link href="/auth/login" onClick={() => setIsOpen(false)} className="mt-4 py-3 font-head text-3xl uppercase tracking-widest text-[#d4a857]">
            Client Portal
          </Link>
          <a
            href={`${siteConfig.whatsapp}?text=Hi%20MCM%2C%20I%20want%20to%20book%20a%20studio%20session.`}
            target="_blank"
            rel="noopener noreferrer"
            className="button-primary mt-6 w-full"
          >
            Book a Session
          </a>
          <div className="mt-4 flex justify-center"><SoundToggle /></div>
        </nav>
      </div>
    </>
  );
}

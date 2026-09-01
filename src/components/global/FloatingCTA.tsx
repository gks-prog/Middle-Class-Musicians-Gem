"use client";

import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site";

export default function FloatingCTA() {
  const pathname = usePathname();
  const isPortfolio = pathname === "/portfolio";

  return (
    <a
      href={`${siteConfig.whatsapp}?text=Hi%20MCM%2C%20I%20want%20to%20discuss%20a%20music%20project.`}
      target="_blank"
      rel="noopener noreferrer"
      className={`group fixed right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#25d366] to-[#128c7e] text-white shadow-[0_12px_35px_rgba(37,211,102,0.3)] transition-transform duration-300 hover:scale-105 sm:right-6 ${
        isPortfolio ? "bottom-28 md:bottom-32" : "bottom-[max(1rem,env(safe-area-inset-bottom))] sm:bottom-6"
      }`}
      aria-label="Chat with MCM Studio on WhatsApp"
      data-sound="hover"
    >
      <span className="absolute inset-0 -z-10 rounded-full bg-[#25d366]/40 motion-safe:animate-ping motion-reduce:hidden" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg border border-white/10 bg-[#15151c] px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white shadow-xl group-hover:block lg:block lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100">
        Discuss your project
      </span>
      <svg viewBox="0 0 24 24" fill="currentColor" className="relative z-10 h-7 w-7" aria-hidden="true">
        <path d="M20 3.5A11.5 11.5 0 0 0 3.5 19.7L2 22.5l2.9-1.5A11.5 11.5 0 1 0 20 3.5Zm-8 19a9.4 9.4 0 0 1-4.8-1.3l-.3-.2-2.9.8.8-2.8-.2-.3A9.4 9.4 0 1 1 12 22.5Zm5.3-7c-.3-.1-1.7-.8-2-.9s-.5-.2-.7.2-.8.9-1 1.1-.4.2-.7.1a7.8 7.8 0 0 1-2.3-1.4 8.6 8.6 0 0 1-1.6-2c-.2-.3 0-.4.1-.5l.4-.5a2 2 0 0 0 .3-.4.4.4 0 0 0 0-.4l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.8.4 3.4 3.4 0 0 0-1.1 2.6 6 6 0 0 0 1.3 3.2 13.7 13.7 0 0 0 5.2 4.6c.7.3 1.3.5 1.7.6a4.2 4.2 0 0 0 1.9.1 3.2 3.2 0 0 0 2-1.5 2.5 2.5 0 0 0 .2-1.4c-.1-.1-.3-.2-.6-.4Z" />
      </svg>
    </a>
  );
}

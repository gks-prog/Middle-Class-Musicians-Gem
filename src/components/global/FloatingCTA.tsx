"use client";

export default function FloatingCTA() {
  return (
    <a
      href="https://wa.me/919315778147?text=Hi%20MCM%21"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-[#25d366] to-[#128c7e] text-white rounded-full flex items-center justify-center shadow-[0_12px_40px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform duration-300 group"
      aria-label="WhatsApp CTA"
      data-sound="hover"
    >
      {/* Tailwind native ping animation replaces your old custom CSS keyframe */}
      <div className="absolute inset-0 rounded-full animate-ping opacity-60 bg-[#25d366] group-hover:hidden duration-1000"></div>
      
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 relative z-10">
        <path d="M20 3.5A11.5 11.5 0 0 0 3.5 19.7L2 22.5l2.9-1.5A11.5 11.5 0 1 0 20 3.5Zm-8 19a9.4 9.4 0 0 1-4.8-1.3l-.3-.2-2.9.8.8-2.8-.2-.3A9.4 9.4 0 1 1 12 22.5Zm5.3-7c-.3-.1-1.7-.8-2-.9s-.5-.2-.7.2-.8.9-1 1.1-.4.2-.7.1a7.8 7.8 0 0 1-2.3-1.4 8.6 8.6 0 0 1-1.6-2c-.2-.3 0-.4.1-.5l.4-.5a2 2 0 0 0 .3-.4.4.4 0 0 0 0-.4l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.8.4 3.4 3.4 0 0 0-1.1 2.6 6 6 0 0 0 1.3 3.2 13.7 13.7 0 0 0 5.2 4.6c.7.3 1.3.5 1.7.6a4.2 4.2 0 0 0 1.9.1 3.2 3.2 0 0 0 2-1.5 2.5 2.5 0 0 0 .2-1.4c-.1-.1-.3-.2-.6-.4Z" />
      </svg>
    </a>
  );
}

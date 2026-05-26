import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-[#0c0c10] border-t border-white/10 pt-20 pb-10 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <h3 className="font-head text-3xl tracking-widest mb-4 flex items-center gap-2">
              <span className="text-[#d4a857]">MCM</span> STUDIO
            </h3>
            <p className="text-gray-400 text-sm max-w-sm mb-6">
              Delhi's premier studio for Recording, Mixing, Mastering, and Beat Production. Built for sound. Designed for vision.
            </p>
            <div className="flex gap-6 text-sm font-semibold tracking-widest uppercase text-gray-500">
              <a href="https://instagram.com/middleclassmusicians" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" data-sound="hover">Instagram</a>
              <a href="https://wa.me/919315778147" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" data-sound="hover">WhatsApp</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3 font-head text-xl tracking-widest uppercase text-gray-400">
            <Link href="/studio" className="hover:text-white transition-colors w-fit" data-sound="hover">Studio</Link>
            <Link href="/services" className="hover:text-white transition-colors w-fit" data-sound="hover">Services</Link>
            <Link href="/portfolio" className="hover:text-white transition-colors w-fit" data-sound="hover">Portfolio</Link>
            <Link href="/#contact" className="hover:text-white transition-colors w-fit" data-sound="hover">Contact</Link>
          </div>

          {/* Google Map Embed (Exact Original Links Restored) */}
          <div className="flex justify-start md:justify-end lg:col-span-1">
            <div className="w-full max-w-md h-48 rounded-xl overflow-hidden border border-white/10 bg-[#15151c] relative group cursor-pointer" data-sound="click">
              {/* CSS Filter hack perfectly aligns the map with Dark Mode */}
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
                className="absolute inset-0 z-10"
                aria-label="Open in Google Maps"
              >
                <span className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/10 rounded text-[10px] uppercase tracking-widest text-[#d4a857] hover:text-white transition-colors">
                  Open Maps ↗
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="text-xs text-gray-500 border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>© {year} Middle Class Musicians. All rights reserved.</span>
          <span>A venture by Wenon Bont & Bunny Nation Music</span>
        </div>
      </div>
    </footer>
  );
}

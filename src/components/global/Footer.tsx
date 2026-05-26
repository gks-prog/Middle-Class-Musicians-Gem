export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-[#0c0c10] border-t border-white/10 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Brand Info */}
          <div>
            <h3 className="font-head text-3xl tracking-widest mb-4 flex items-center gap-2">
              <span className="text-[#d4a857]">MCM</span> STUDIO
            </h3>
            <p className="text-gray-400 text-sm max-w-sm mb-6">
              Delhi's premier studio for Recording, Mixing, Mastering, and Beat Production. Built for sound. Designed for vision.
            </p>
            <div className="flex gap-6 text-sm font-semibold tracking-widest uppercase text-gray-500">
              <a href="https://instagram.com/middleclassmusicians" className="hover:text-white transition-colors">Instagram</a>
              <a href="https://wa.me/919315778147" className="hover:text-white transition-colors">WhatsApp</a>
            </div>
          </div>

          {/* Google Map Embed */}
          <div className="flex justify-start md:justify-end">
            <div className="w-full max-w-md h-48 rounded-xl overflow-hidden border border-white/10 bg-[#15151c] relative group">
              {/* CSS Filter hack to make the map match Dark Mode */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14008.112278453471!2d77.0494483!3d28.6235911!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d04d0544f8d55%3A0x64e030aebc4927b!2sUttam%20Nagar%2C%20New%20Delhi%2C%20Delhi%20110059!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: "grayscale(100%) invert(92%) contrast(83%)" }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-70 group-hover:opacity-100 transition-opacity duration-300"
              />
              <a href="https://maps.google.com/?q=Uttam+Nagar,+New+Delhi" target="_blank" rel="noreferrer" className="absolute bottom-2 right-2 px-3 py-1 bg-black/80 backdrop-blur border border-white/10 rounded text-[10px] uppercase tracking-widest text-white hover:text-[#d4a857] transition-colors">
                Open Maps ↗
              </a>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>&copy; {year} Middle Class Musicians. All rights reserved.</span>
          <span>A venture by Wenon Bont & Bunny Nation Music</span>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-radial-gradient opacity-20 pointer-events-none" />
      
      <div className="container relative z-10 px-6">
        <div className="inline-block px-4 py-1 border border-white/20 rounded-full text-xs tracking-widest text-gray-400 mb-8 font-head uppercase">
          Delhi · Est. 2019
        </div>
        
        <h1 className="text-6xl md:text-9xl font-head leading-none mb-6">
          <span className="block text-white/90">RECORD.</span>
          <span className="block text-white/90">CREATE.</span>
          <span className="block text-gold">PERFORM.</span>
        </h1>
        
        <p className="text-gray-400 max-w-lg mx-auto text-lg mb-10">
          Delhi's premier studio for recording, mixing, and beat production. An entire industry under one roof.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://wa.me/919315778147" className="px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-wider hover:bg-gold transition-colors">
            Book Now
          </a>
          <a href="/studio" className="px-8 py-4 border border-white/20 text-white rounded-full font-bold uppercase tracking-wider hover:bg-white/10 transition-colors">
            Explore Studio
          </a>
        </div>
      </div>
    </section>
  );
}

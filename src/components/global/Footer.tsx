export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-[#0c0c10] border-t border-white/10 py-16 text-center">
      <div className="container mx-auto px-6">
        <h3 className="font-head text-2xl tracking-widest mb-4">Middle Class Musicians</h3>
        <p className="text-gray-400 text-sm mb-8">
          Built for sound. Designed for vision. Delhi, India.
        </p>
        <div className="text-xs text-gray-500 border-t border-white/10 pt-8">
          &copy; {year} Middle Class Musicians. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import { Bebas_Neue, Montserrat } from "next/font/google";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import AudioEngine from "@/components/global/AudioEngine";
import FloatingCTA from "@/components/global/FloatingCTA";
import Preloader from "@/components/global/Preloader";
import FloatingNotes from "@/components/global/FloatingNotes";

import "./globals.css";

const bebasNeue = Bebas_Neue({ 
  weight: "400", 
  subsets: ["latin"], 
  variable: "--font-head" 
});

const montserrat = Montserrat({ 
  subsets: ["latin"], 
  variable: "--font-body" 
});

export const metadata: Metadata = {
  title: "Middle Class Musicians — Premium Recording Studio",
  description: "Delhi's premier studio for Recording, Mixing, Mastering, and Beat Production.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth bg-[#07070a]">
      <body className={`${bebasNeue.variable} ${montserrat.variable} font-body bg-bgPrimary text-textPrimary antialiased selection:bg-[#d4a857] selection:text-black min-h-screen flex flex-col`}>
        
        {/* The Cinematic Gatekeeper */}
        <Preloader />

        {/* Invisible Client Engines & VFX */}
        <AudioEngine />
        <FloatingNotes />
        
        {/* Global UI Components */}
        <Navbar />
        
        {/* Main Content Area (Expands to push footer down, z-10 keeps it above notes) */}
        <main className="flex-grow relative z-10">
          {children}
        </main>
        
        <FloatingCTA />
        <Footer />
      </body>
    </html>
  );
}

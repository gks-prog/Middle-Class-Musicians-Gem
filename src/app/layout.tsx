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
  title: {
    default: "Middle Class Musicians — Recording Studio in Delhi",
    template: "%s | Middle Class Musicians",
  },
  description: "Delhi's premier studio for Recording, Mixing, Mastering, and Beat Production.",
  keywords: ["recording studio Delhi", "mixing and mastering Delhi", "music production", "beat production", "Middle Class Musicians"],
  openGraph: {
    title: "Middle Class Musicians — Recording Studio in Delhi",
    description: "Recording, mixing, mastering, beat production, and music courses in Delhi.",
    type: "website",
    locale: "en_IN",
    siteName: "Middle Class Musicians",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth bg-[#07070a]">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MusicRecordingStudio",
          name: "Middle Class Musicians",
          description: "Recording, mixing, mastering, beat production, and music courses in Delhi.",
          telephone: "+91 93157 78147",
          areaServed: "Delhi",
          sameAs: ["https://instagram.com/middleclassmusicians"],
          makesOffer: ["Recording", "Mixing", "Mastering", "Beat Production", "Music Courses"].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
        }) }} />
      </head>
      <body className={`${bebasNeue.variable} ${montserrat.variable} font-body bg-bgPrimary text-textPrimary antialiased selection:bg-[#d4a857] selection:text-black min-h-screen flex flex-col`}>
        <a href="#main-content" className="skip-link">Skip to content</a>
        
        {/* The Cinematic Gatekeeper */}
        <Preloader />

        {/* Invisible Client Engines & VFX */}
        <AudioEngine />
        <FloatingNotes />
        
        {/* Global UI Components */}
        <Navbar />
        
        {/* Main Content Area (Expands to push footer down, z-10 keeps it above notes) */}
        <main id="main-content" tabIndex={-1} className="flex-grow relative z-10 outline-none">
          {children}
        </main>
        
        <FloatingCTA />
        <Footer />
      </body>
    </html>
  );
}

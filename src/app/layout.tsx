import type { Metadata } from "next";
import { Bebas_Neue, Montserrat } from "next/font/google";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import AudioEngine from "@/components/global/AudioEngine";
import "@/styles/globals.css";

// Optimize Google Fonts at build time
const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-head" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-body" });

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
    <html lang="en" className="scroll-smooth">
      <body className={`${bebasNeue.variable} ${montserrat.variable} font-body bg-black text-white antialiased`}>
        {/* Invisible client-side engine for haptics and SFX */}
        <AudioEngine />
        
        <Navbar />
        <main className="min-h-screen pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

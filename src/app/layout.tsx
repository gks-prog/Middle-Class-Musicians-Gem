import type { Metadata } from "next";
import { Bebas_Neue, Montserrat } from "next/font/google";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import AudioEngine from "@/components/global/AudioEngine";

// CRITICAL: The direct import of your global styles
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
  title: "Middle Class Musicians — Studio",
  description: "Delhi's premier recording studio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${bebasNeue.variable} ${montserrat.variable} font-body bg-bgPrimary text-textPrimary antialiased selection:bg-gold selection:text-black`}>
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

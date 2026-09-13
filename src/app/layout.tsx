import type { Metadata } from "next";
import { Bebas_Neue, Montserrat } from "next/font/google";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import AudioEngine from "@/components/global/AudioEngine";
import FloatingCTA from "@/components/global/FloatingCTA";
import FloatingNotes from "@/components/global/FloatingNotes";
import StructuredData from "@/components/global/StructuredData";
import { absoluteUrl, siteConfig } from "@/lib/site";

import "./globals.css";

const bebasNeue = Bebas_Neue({ 
  weight: "400", 
  subsets: ["latin"], 
  variable: "--font-head",
  display: "swap",
});

const montserrat = Montserrat({ 
  subsets: ["latin"], 
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Middle Class Musicians | Recording Studio in Delhi",
    template: "%s | MCM Studio",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: { canonical: "/" },
  keywords: [
    "recording studio in Delhi",
    "music studio in Uttam Nagar",
    "vocal recording studio Delhi",
    "mixing and mastering Delhi",
    "beat production Delhi",
    "music production courses Delhi",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Middle Class Musicians | Recording Studio in Delhi",
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Middle Class Musicians | Recording Studio in Delhi",
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "music",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${siteConfig.url}/#studio`,
      name: siteConfig.name,
      alternateName: siteConfig.shortName,
      url: siteConfig.url,
      description: siteConfig.description,
      telephone: siteConfig.phoneE164,
      logo: absoluteUrl("/icon.svg"),
      foundingDate: "2019",
      hasMap: siteConfig.maps,
      knowsAbout: ["Recording", "Music production", "Mixing and mastering", "Custom type beats", "Artist management", "Video production"],
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.address.locality,
        addressLocality: siteConfig.address.city,
        addressRegion: siteConfig.address.region,
        postalCode: siteConfig.address.postalCode,
        addressCountry: siteConfig.address.country,
      },
      areaServed: {
        "@type": "City",
        name: "New Delhi",
      },
      sameAs: [siteConfig.instagram, siteConfig.maps, siteConfig.googleReviews],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Studio services",
        itemListElement: [
          "Vocal Recording",
          "Music Production",
          "Mixing and Mastering",
          "Beat Production",
          "Songwriting",
          "Music Production Courses",
          "Artist Management",
          "Video Production",
        ].map((name) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name, provider: { "@id": `${siteConfig.url}/#studio` }, areaServed: "New Delhi", url: absoluteUrl(name === "Music Production Courses" ? "/courses" : "/services") },
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      inLanguage: "en-IN",
      publisher: { "@id": `${siteConfig.url}/#studio` },
    },
  ];

  return (
    <html lang="en" className="scroll-smooth bg-[#07070a]">
      <body className={`${bebasNeue.variable} ${montserrat.variable} font-body bg-bgPrimary text-textPrimary antialiased selection:bg-[#d4a857] selection:text-black min-h-screen flex flex-col`}>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <StructuredData data={structuredData} />
        <AudioEngine />
        <FloatingNotes />
        <Navbar />
        <main id="main-content" className="flex-grow relative z-10" tabIndex={-1}>
          {children}
        </main>
        <FloatingCTA />
        <Footer />
      </body>
    </html>
  );
}

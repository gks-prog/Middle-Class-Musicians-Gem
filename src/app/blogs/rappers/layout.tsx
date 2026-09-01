import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Recording Guide for Rappers",
  description:
    "Direct answers on vocal recording, session preparation, vocal mixing, and performance confidence for rappers.",
  path: "/blogs/rappers",
});

export default function RappersLayout({ children }: { children: React.ReactNode }) {
  return children;
}

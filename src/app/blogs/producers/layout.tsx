import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Beat Production & Mixing Guide",
  description:
    "Direct answers for music producers on plugin choice, music theory, low-end control, 808 mixing, and acoustic monitoring.",
  path: "/blogs/producers",
});

export default function ProducersLayout({ children }: { children: React.ReactNode }) {
  return children;
}

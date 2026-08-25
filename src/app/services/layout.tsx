import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Recording, Mixing, Mastering & Beat Production",
  description:
    "Vocal recording, mixing and mastering, custom beat production, songwriting, and arrangement support at MCM Studio in New Delhi.",
  path: "/services",
});

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

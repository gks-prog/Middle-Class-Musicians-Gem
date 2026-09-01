import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Music Production Journal & Community",
  description:
    "Practical recording, vocal, mixing, mastering, and beat production guides for rappers and producers, plus the MCM Studio Talk community.",
  path: "/blogs",
});

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

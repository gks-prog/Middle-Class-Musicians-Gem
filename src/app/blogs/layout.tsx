import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Music Production Journal",
  description:
    "Practical recording, vocal, mixing, mastering, and beat production guides for rappers and producers from Middle Class Musicians in Uttam Nagar, New Delhi.",
  path: "/blogs",
});

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

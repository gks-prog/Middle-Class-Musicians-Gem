import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Audio Portfolio — Raw vs Final Mixes",
  description:
    "Hear Raw, no-FX recordings beside fully mixed and mastered versions from Middle Class Musicians studio in Delhi.",
  path: "/portfolio",
});

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children;
}

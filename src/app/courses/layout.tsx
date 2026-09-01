import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Music Production Courses in Delhi",
  description:
    "Explore integrated music production, AI music production, and advanced mixing and mastering courses at MCM Academy in New Delhi.",
  path: "/courses",
});

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

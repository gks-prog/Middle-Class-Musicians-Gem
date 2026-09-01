import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Recording Studio in Uttam Nagar, Delhi",
  description:
    "Explore Middle Class Musicians' recording and production studio in Uttam Nagar, New Delhi, including the room, signal chain, monitoring, and team.",
  path: "/studio",
});

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}

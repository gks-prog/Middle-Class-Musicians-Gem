import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Your Studio Dashboard",
  description: "View your Middle Class Musicians bookings, purchases and account details.",
  path: "/dashboard",
  noIndex: true,
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}

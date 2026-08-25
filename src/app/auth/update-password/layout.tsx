import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Update Password",
  description: "Securely update your Middle Class Musicians account password.",
  path: "/auth/update-password",
  noIndex: true,
});

export default function UpdatePasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}

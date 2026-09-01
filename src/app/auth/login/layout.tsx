import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Phone Login | Client & Community Portal",
  description: "Access the Middle Class Musicians client portal with a secure WhatsApp or SMS verification code.",
  path: "/auth/login",
  noIndex: true,
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Client & Community Login",
  description: "Sign in to the Middle Class Musicians client and community portal.",
  path: "/auth/login",
  noIndex: true,
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

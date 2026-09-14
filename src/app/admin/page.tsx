import { redirect } from "next/navigation";
import { AdminError, getSnapshot, requireAdmin } from "@/lib/cms/server";
import AdminEditor from "@/components/admin/AdminEditor";
export const dynamic = "force-dynamic";
export default async function AdminPage() {
  let snapshot; let email = ""; let issue = ""; let unauthenticated = false;
  try {
    const admin = await requireAdmin();
    email = admin.email;
    snapshot = await getSnapshot(admin.token);
  } catch (error) {
    unauthenticated = error instanceof AdminError && error.status === 401;
    issue = error instanceof AdminError ? error.message : "Admin storage is temporarily unavailable.";
  }
  if (unauthenticated) redirect("/admin/login");
  if (!snapshot) return <div className="mx-auto min-h-screen max-w-xl px-6 py-36"><h1 className="font-head text-4xl">Admin unavailable</h1><p className="mt-5 text-gray-300">{issue}</p><a className="button-secondary mt-8" href="/admin/login">Sign in with another account</a></div>;
  return <AdminEditor initial={snapshot} email={email} />;
}

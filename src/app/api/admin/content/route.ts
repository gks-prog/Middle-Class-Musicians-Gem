import { revalidatePath, revalidateTag } from "next/cache";
import { AdminError, failure, getSnapshot, readJson, requireAdmin, sameOrigin, supabase } from "@/lib/cms/server";
import { validateContent } from "@/lib/cms/validation";
export async function GET() {
  try {
    const { token } = await requireAdmin();
    return Response.json(await getSnapshot(token), { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return failure(error); }
}
export async function PUT(request: Request) {
  try {
    sameOrigin(request);
    const { token } = await requireAdmin();
    const body = await readJson(request);
    if (!Number.isSafeInteger(body?.version) || body.version < 0) throw new AdminError("Invalid content version.", 400);
    let data;
    try { data = validateContent(body.data); } catch (error) { throw new AdminError(error instanceof Error ? error.message : "Invalid content.", 400); }
    const response = await supabase("/rest/v1/rpc/publish_studio_content", { method: "POST", body: JSON.stringify({ new_data: data, expected_version: body.version }) }, token);
    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      if (detail.code === "40001") throw new AdminError("Someone published newer changes. Copy your edits, then reload the latest version before publishing.", 409);
      throw new AdminError("Publishing failed. Your unsaved changes are still in this form.", 503);
    }
    const result = await response.json();
    revalidateTag("studio-content", { expire: 0 });
    revalidatePath("/", "layout");
    return Response.json({ data, version: result }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return failure(error); }
}

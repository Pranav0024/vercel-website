import { NextRequest } from "next/server";
import { requireAdmin, requireSameOrigin } from "@/lib/admin-auth";
import { adminJson, apiError, boundedBytes } from "@/lib/admin-http";
import { saveImage } from "@/lib/catalogue-store";
import { CatalogueError } from "@/lib/catalogue-validation";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request);
    requireAdmin(request);
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.startsWith("multipart/form-data;"))
      throw new CatalogueError("Choose an image upload.", 415);
    const bytes = await boundedBytes(request, 4 * 1024 * 1024 + 65536);
    let data: FormData;
    try {
      data = await new Response(new Uint8Array(bytes), {
        headers: { "Content-Type": contentType },
      }).formData();
    } catch {
      throw new CatalogueError("Invalid image upload.");
    }
    const file = data.get("image");
    if (!(file instanceof File) || file.size > 4 * 1024 * 1024)
      throw new CatalogueError("Upload an image up to 4 MB.");
    return adminJson({
      url: await saveImage(Buffer.from(await file.arrayBuffer())),
    });
  } catch (error) {
    return apiError(error);
  }
}

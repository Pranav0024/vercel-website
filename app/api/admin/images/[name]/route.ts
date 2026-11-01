import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { readImage } from "@/lib/catalogue-store";
import { apiError } from "@/lib/admin-http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  try {
    requireAdmin(request);
    const { name } = await params;
    const bytes = await readImage(name, true);
    const extension = name.split(".").pop();
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type":
          extension === "jpg" ? "image/jpeg" : "image/" + extension,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
      },
    });
  } catch (error) {
    return apiError(error);
  }
}

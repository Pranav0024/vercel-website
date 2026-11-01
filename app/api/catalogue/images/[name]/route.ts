import { readImage } from "@/lib/catalogue-store";
import { apiError } from "@/lib/admin-http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  try {
    const { name } = await params;
    const bytes = await readImage(name);
    const extension = name.split(".").pop();
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type":
          extension === "jpg" ? "image/jpeg" : "image/" + extension,
        "Cache-Control": "public, max-age=0, must-revalidate",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
      },
    });
  } catch (error) {
    return apiError(error);
  }
}

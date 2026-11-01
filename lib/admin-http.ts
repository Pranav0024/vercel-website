import { NextRequest, NextResponse } from "next/server";
import { CatalogueError } from "./catalogue-validation";

export async function boundedBytes(
  request: NextRequest,
  limit: number,
): Promise<Buffer> {
  if (Number(request.headers.get("content-length")) > limit)
    throw new CatalogueError("The request is too large.", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new CatalogueError("A request body is required.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      throw new CatalogueError("The request is too large.", 413);
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}
export async function jsonBody(request: NextRequest) {
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new CatalogueError("Use a JSON request.", 415);
  const bytes = await boundedBytes(request, 1024 * 1024);
  try {
    const value = JSON.parse(bytes.toString("utf8"));
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw new Error();
    return value;
  } catch {
    throw new CatalogueError("Invalid JSON request.");
  }
}
export function adminJson(value: unknown, status = 200) {
  return NextResponse.json(value, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
export function apiError(error: unknown) {
  if (error instanceof CatalogueError)
    return adminJson({ error: error.message, code: error.code }, error.status);
  console.error("Catalogue operation failed.");
  return adminJson(
    { error: "The operation could not be completed. Reload and try again." },
    500,
  );
}

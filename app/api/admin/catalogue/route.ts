import { NextRequest } from "next/server";
import { requireAdmin, requireSameOrigin } from "@/lib/admin-auth";
import { adminJson, apiError, jsonBody } from "@/lib/admin-http";
import {
  adminView,
  readCatalogue,
  saveDraft,
  storageMode,
} from "@/lib/catalogue-store";
import { CatalogueError } from "@/lib/catalogue-validation";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    if (storageMode() === "readonly")
      throw new CatalogueError(
        "Hosted editing needs durable storage. Configure free GitHub storage using ADMIN_SETUP.md.",
        503,
        "setup_required",
      );
    return adminJson(adminView(await readCatalogue(true)));
  } catch (error) {
    return apiError(error);
  }
}
export async function PUT(request: NextRequest) {
  try {
    requireSameOrigin(request);
    requireAdmin(request);
    const body = await jsonBody(request);
    return adminJson(await saveDraft(body.products, body.revision));
  } catch (error) {
    return apiError(error);
  }
}

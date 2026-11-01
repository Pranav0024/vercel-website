import { NextRequest } from "next/server";
import { requireAdmin, requireSameOrigin } from "@/lib/admin-auth";
import { adminJson, apiError, jsonBody } from "@/lib/admin-http";
import { publishCatalogue } from "@/lib/catalogue-store";
import { revalidatePath } from "next/cache";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request);
    requireAdmin(request);
    const body = await jsonBody(request);
    const result = await publishCatalogue(body.revision);
    revalidatePath("/");
    revalidatePath("/shop");
    return adminJson(result);
  } catch (error) {
    return apiError(error);
  }
}

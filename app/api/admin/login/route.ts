import { NextRequest } from "next/server";
import {
  ADMIN_COOKIE,
  attemptLogin,
  createSession,
  requireSameOrigin,
  requesterKey,
  sessionCookie,
} from "@/lib/admin-auth";
import { adminJson, apiError, jsonBody } from "@/lib/admin-http";
import { CatalogueError } from "@/lib/catalogue-validation";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request);
    const body = await jsonBody(request);
    if (typeof body.password !== "string" || body.password.length > 1024)
      throw new CatalogueError("Enter your password.");
    attemptLogin(body.password, requesterKey(request));
    const response = adminJson({ ok: true });
    response.cookies.set(ADMIN_COOKIE, createSession(), sessionCookie);
    return response;
  } catch (error) {
    return apiError(error);
  }
}

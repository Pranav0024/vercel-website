import { NextRequest } from "next/server";
import {
  ADMIN_COOKIE,
  requireSameOrigin,
  sessionCookie,
} from "@/lib/admin-auth";
import { adminJson, apiError } from "@/lib/admin-http";
export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request);
    const response = adminJson({ ok: true });
    response.cookies.set(ADMIN_COOKIE, "", { ...sessionCookie, maxAge: 0 });
    return response;
  } catch (error) {
    return apiError(error);
  }
}

import { NextResponse } from "next/server";
import { readPublicCatalogue } from "@/lib/catalogue-store";
import { apiError } from "@/lib/admin-http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return NextResponse.json(
      { products: await readPublicCatalogue() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return apiError(error);
  }
}

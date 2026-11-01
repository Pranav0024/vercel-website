import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { isIP } from "node:net";
import type { NextRequest } from "next/server";
import { CatalogueError } from "./catalogue-validation";

export const ADMIN_COOKIE = "paniar_admin";
const SESSION_SECONDS = 8 * 60 * 60;
function configuration() {
  const password = process.env.ADMIN_PASSWORD || "";
  const secret = process.env.ADMIN_SESSION_SECRET || "";
  if (password.length < 16 || secret.length < 32)
    throw new CatalogueError(
      "Admin access is not configured. Run npm run admin:setup locally, or set ADMIN_PASSWORD and ADMIN_SESSION_SECRET on your host.",
      503,
      "setup_required",
    );
  return { password, secret };
}
const hash = (value: string) => createHash("sha256").update(value).digest();
function signature(value: string) {
  const { password, secret } = configuration();
  return createHmac("sha256", secret)
    .update(hash(password))
    .update(value)
    .digest("hex");
}
export function checkPassword(value: string): boolean {
  return timingSafeEqual(hash(value), hash(configuration().password));
}
export function createSession(now = Date.now()): string {
  const payload = `${Math.floor(now / 1000) + SESSION_SECONDS}.${randomBytes(24).toString("hex")}`;
  return `${payload}.${signature(payload)}`;
}
export function validSession(
  token: string | undefined,
  now = Date.now(),
): boolean {
  if (!token || token.length > 300) return false;
  const parts = token.split(".");
  if (
    parts.length !== 3 ||
    !/^\d{10}$/.test(parts[0]) ||
    !/^[a-f0-9]{48}$/.test(parts[1]) ||
    !/^[a-f0-9]{64}$/.test(parts[2])
  )
    return false;
  const expires = Number(parts[0]);
  if (
    expires <= Math.floor(now / 1000) ||
    expires > Math.floor(now / 1000) + SESSION_SECONDS
  )
    return false;
  return timingSafeEqual(
    Buffer.from(parts[2], "hex"),
    Buffer.from(signature(`${parts[0]}.${parts[1]}`), "hex"),
  );
}
export function requireAdmin(request: NextRequest) {
  configuration();
  if (!validSession(request.cookies.get(ADMIN_COOKIE)?.value))
    throw new CatalogueError("Please sign in to manage the catalogue.", 401);
}
export function requireSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  let expected = request.nextUrl.origin;
  // Compare the browser-facing host, not Next's internal localhost binding.
  const host = request.headers.get("host");
  if (host) {
    try {
      expected = new URL(
        `${request.nextUrl.protocol || new URL(expected).protocol}//${host}`,
      ).origin;
    } catch {
      throw new CatalogueError("Invalid request host.", 403);
    }
  }
  if (
    origin !== expected ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    throw new CatalogueError(
      "This request must come from your own admin panel.",
      403,
    );
}
export const sessionCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_SECONDS,
};

// Forwarded peer addresses are trusted only when the host replaces client headers.
export function requesterKey(request: NextRequest): string {
  const trusted =
    process.env.VERCEL === "1" || process.env.ADMIN_TRUST_PROXY === "true";
  if (!trusted) {
    if (process.env.NODE_ENV === "production")
      throw new CatalogueError(
        "Configure a trusted proxy address for sign-in rate limiting. See ADMIN_SETUP.md.",
        503,
        "setup_required",
      );
    return "local";
  }
  const address = (
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    ""
  ).trim();
  if (!isIP(address))
    throw new CatalogueError(
      "The host did not provide a trusted client address.",
      503,
      "setup_required",
    );
  return address;
}
// Bounded, per-requester attempt limits. Different requesters do not share a lockout.
const attempts = new Map<string, { failures: number; resetAt: number }>();
export function attemptLogin(
  password: string,
  requester = "local",
  now = Date.now(),
) {
  configuration();
  for (const [key, attempt] of attempts)
    if (attempt.resetAt <= now) attempts.delete(key);
  if (attempts.size >= 1000 && !attempts.has(requester))
    attempts.delete(attempts.keys().next().value!);
  const attempt = attempts.get(requester) || {
    failures: 0,
    resetAt: now + 60000,
  };
  if (attempt.failures >= 8)
    throw new CatalogueError(
      "Too many sign-in attempts. Please try again in a minute.",
      429,
    );
  if (checkPassword(password)) {
    attempts.delete(requester);
    return;
  }
  attempt.failures++;
  attempts.set(requester, attempt);
  throw new CatalogueError("Incorrect password.", 401);
}

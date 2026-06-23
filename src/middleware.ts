import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { SESSION_COOKIE_NAME } from "@/lib/constants";

// Routes that never require authentication.
const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/403",
];

function isPublic(pathname: string) {
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) return true;
  if (pathname.startsWith("/api/auth")) return true;
  if (pathname.startsWith("/api/register")) return true;
  if (pathname.startsWith("/api/forgot-password")) return true;
  return false;
}

function buildCsp(nonce: string) {
  const isDev = process.env.NODE_ENV !== "production";
  return [
    `default-src 'self'`,
    // Next.js requires inline/eval in dev; in production we trust the nonce
    // and let 'strict-dynamic' propagate trust to Next's chunk loader.
    `script-src 'self' 'nonce-${nonce}' ${isDev ? "'unsafe-eval' 'unsafe-inline'" : "'strict-dynamic'"}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https:`,
    `font-src 'self' data:`,
    `connect-src 'self'`,
    `frame-ancestors 'none'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
  ].join("; ");
}

function securityHeaders(res: NextResponse, csp: string) {
  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-DNS-Prefetch-Control", "off");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  return res;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const nonce = crypto.randomUUID();
  const csp = buildCsp(nonce);

  // Next.js extracts the nonce from the CSP set on the *request* headers and
  // applies it to its own <script> tags, enabling 'strict-dynamic' in prod.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const respond = () =>
    securityHeaders(NextResponse.next({ request: { headers: requestHeaders } }), csp);

  if (isPublic(pathname)) {
    return respond();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: SESSION_COOKIE_NAME,
    secureCookie: SESSION_COOKIE_NAME.startsWith("__Secure-"),
  });
  if (!token) {
    if (pathname.startsWith("/api")) {
      return securityHeaders(NextResponse.json({ error: "Unauthorized" }, { status: 401 }), csp);
    }
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);
    return securityHeaders(NextResponse.redirect(url), csp);
  }

  return respond();
}

export const config = {
  matcher: [
    // Run on everything except static assets and the boot/loading splash.
    "/((?!_next/static|_next/image|favicon.ico|boot|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

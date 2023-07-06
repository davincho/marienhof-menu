import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { isProduction } from "./utils/env";

const VALID_DOMAINS = new Map<string, string>([
  ["paulify.vercel.app", "/paul"],
  ["marienify.vercel.app", "/marie"],
]);

export function middleware(request: NextRequest) {
  console.log("MMIMIM");

  if (!isProduction) {
    return;
  }

  if (request.nextUrl.pathname === "/") {
    // Make subdomain redirects manually here, as redirect/rewrite functionality via
    // next.config.js does not work with root URLs 🤷🏽

    const { hostname } = new URL(request.url);

    const redirectUrl = VALID_DOMAINS.get(hostname);

    if (redirectUrl) {
      return NextResponse.rewrite(
        new URL(redirectUrl, "https://iamhungry.vercel.app")
      );
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - favicon.ico (favicon file)
     * - assets (static assets)
     */
    "/",
  ],
};

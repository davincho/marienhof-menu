import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    // Make subdomain redirects manually here, as redirect/rewrite functionality via
    // next.config.js does not work with root URLs 🤷🏽

    const currentUrl = new URL(request.url);

    if (currentUrl.hostname === "paulify.vercel.app") {
      return NextResponse.redirect(new URL("/paul", "iamhungry.vercel.app"));
    }

    if (currentUrl.hostname === "marienify.vercel.app") {
      return NextResponse.redirect(new URL("/marie", "iamhungry.vercel.app"));
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/:path*",
};

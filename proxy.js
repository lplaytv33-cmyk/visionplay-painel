import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  const admin = request.cookies.get("visionplay_admin");
  const revendedor = request.cookies.get("visionplay_revendedor");

  if (pathname.startsWith("/dashboard")) {
    if (!admin) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname.startsWith("/revendedor")) {
    if (!revendedor) {
      return NextResponse.redirect(
        new URL("/login-revendedor", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/revendedor/:path*"],
};

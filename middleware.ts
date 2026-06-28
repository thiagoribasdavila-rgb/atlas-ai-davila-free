import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const isLoginPage = req.nextUrl.pathname.startsWith("/login");

  // sem token → só deixa login
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // com token → bloqueia login
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

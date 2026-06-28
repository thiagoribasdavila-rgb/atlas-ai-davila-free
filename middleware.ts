import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const isLogin = req.nextUrl.pathname.startsWith("/login");

  // sem login → bloqueia tudo menos login
  if (!token && !isLogin) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // logado → impede voltar login
  if (token && isLogin) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};

import { NextRequest, NextResponse } from "next/server"

const PROTECTED_PREFIX = "/admin"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (!pathname.startsWith(PROTECTED_PREFIX)) return NextResponse.next()
  if (pathname.startsWith("/admin/login")) return NextResponse.next()

  const auth = req.cookies.get("admin_auth")?.value
  if (auth === "1") return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = "/admin/login"
  url.searchParams.set("redirect", pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ["/admin/:path*"],
}

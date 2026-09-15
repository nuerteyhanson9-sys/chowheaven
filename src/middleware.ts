import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "chw_session";
const AUTH_SECRET = process.env.AUTH_SECRET;

type SessionPayload = { userId: string; role: string; name: string; email: string };

async function getSession(req: NextRequest): Promise<SessionPayload | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token || !AUTH_SECRET) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(AUTH_SECRET));
    if (!payload.userId || !payload.role) return null;
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await getSession(req);
  const isAdminArea = pathname.startsWith("/admin");
  const isAccountArea = pathname.startsWith("/account");

  if (pathname === "/login" || pathname === "/register") {
    if (session) {
      const target = isAdminArea ? "/admin" : "/account";
      return NextResponse.redirect(new URL(target, req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login?next=/admin", req.url));
    }
    if (session.role !== "ADMIN" && session.role !== "STAFF") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (isAccountArea && !session) {
    return NextResponse.redirect(new URL("/login?next=/account", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/login", "/register"],
};
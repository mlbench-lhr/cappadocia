import { NextResponse, type NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/dashboard", "/admin/dashboard", "/admin/blogs"];
  const authRoutes = [
    "/auth/login",
    "/auth/signup",
    "/auth/forgot-password",
    "/admin/auth/login",
    "/admin/auth/forgot-password",
  ];

  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));
  const isAdmin = pathname.startsWith("/admin");
  const isAuthRoute = authRoutes.includes(pathname);

  // Get token
  let token =
    request.cookies.get("auth_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "").trim();

  let user = null;
  if (token) {
    try {
      user = verifyToken(token);
    } catch {
      user = null;
    }
  }
  
  if (pathname === "/admin") {
    if (!user) {
      return NextResponse.redirect(new URL("/admin/auth/login", request.url));
    }
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }
  // If logged in and visiting auth route → redirect to proper dashboard
  if (user && isAuthRoute) {
    return NextResponse.redirect(
      new URL(
        user.role === "admin" ? "/admin/dashboard" : "/dashboard",
        request.url
      )
    );
  }

  // If not logged in and accessing protected route → redirect to proper login
  if (!user && isProtected) {
    return NextResponse.redirect(
      new URL(isAdmin ? "/admin/auth/login" : "/auth/login", request.url)
    );
  }

  // Role mismatch protection (logged in but accessing wrong area)
  if (user) {
    if (user.role === "user" && isAdmin && !isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (user.role === "admin" && !isAdmin && !isAuthRoute) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  // Refresh cookie if token valid
  if (user && token) {
    const response = NextResponse.next();
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

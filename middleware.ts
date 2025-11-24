import { NextResponse, type NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = [
    "/dashboard",
    "/explore",
    "/explore/detail",
    "/admin/dashboard",
    "/admin/blogs",
    "/vendor/dashboard",
    "/vendor/tours-and-activities",
    "/admin/tours-and-activities",
    "/admin/vendor-applications",
  ];

  const authRoutes = [
    "/auth/login",
    "/auth/signup",
    "/auth/forgot-password",

    "/admin/auth/login",
    "/admin/auth/forgot-password",

    "/vendor/auth/login",
    "/vendor/auth/signup",
  ];

  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));
  const isAdmin = pathname.startsWith("/admin");
  const isVendor = pathname.startsWith("/vendor");
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

  // Redirect /admin
  if (pathname === "/admin") {
    if (!user) {
      return NextResponse.redirect(new URL("/admin/auth/login", request.url));
    }
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Redirect /vendor
  if (pathname === "/vendor") {
    if (!user) {
      return NextResponse.redirect(new URL("/vendor/auth/login", request.url));
    }
    return NextResponse.redirect(new URL("/vendor/dashboard", request.url));
  }

  // If logged in and visiting any auth route
  if (user && isAuthRoute) {
    return NextResponse.redirect(
      new URL(
        user.role === "admin"
          ? "/admin/dashboard"
          : user.role === "vendor"
          ? "/vendor/dashboard"
          : "/explore",
        request.url
      )
    );
  }

  // Not logged in → protected route access
  if (!user && isProtected) {
    return NextResponse.redirect(
      new URL(
        isAdmin
          ? "/admin/auth/login"
          : isVendor
          ? "/vendor/auth/login"
          : "/auth/login",
        request.url
      )
    );
  }

  // Role mismatch
  if (user) {
    // user trying to access admin or vendor
    if (user.role === "user" && (isAdmin || isVendor)) {
      return NextResponse.redirect(new URL("/explore", request.url));
    }

    // vendor trying to access admin
    if (user.role === "vendor" && isAdmin) {
      return NextResponse.redirect(new URL("/vendor/dashboard", request.url));
    }

    // admin trying to access vendor
    if (user.role === "admin" && isVendor) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  // Refresh cookie if valid
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

import { REFRESH_TOKEN } from "@/types/constant";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest, response: NextResponse) {
  const refreshToken = request.cookies.get(REFRESH_TOKEN)?.value;
  const isAdminPage = request.url.includes("/admin");

  if (!refreshToken) {
    return redirectToLogin(isAdminPage, request);
  }
  return NextResponse.next();
}

export const config = {
  // Указываем url для которых будет работать
  matcher: ["/admin/:path*"],
};

const redirectToLogin = (isAdminPage: boolean, request: NextRequest) => {
  return NextResponse.redirect(
    new URL(isAdminPage ? "/404" : "/login", request.url)
  );
};

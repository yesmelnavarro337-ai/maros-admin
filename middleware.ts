import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/api/config";

// IMPORTANTE: esto es únicamente protección de NAVEGACIÓN — evita que el
// navegador cargue visualmente una página administrativa cuando no hay
// ninguna cookie de sesión presente. NO valida si el token es válido,
// si expiró, ni qué rol/permisos tiene el usuario. Esa es y seguirá
// siendo responsabilidad exclusiva del backend ASP.NET Core en cada
// request real (vía [Authorize] y las policies de rol). Un atacante que
// lograra evadir este middleware seguiría sin poder hacer nada, porque
// el backend rechazaría cualquier request sin un JWT válido.
export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has(AUTH_COOKIE_NAME);

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
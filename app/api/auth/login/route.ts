import { NextRequest, NextResponse } from "next/server";
import { API_URL, AUTH_COOKIE_NAME } from "@/lib/api/config";

export async function POST(request: NextRequest) {
  const { email, password, rememberMe } = await request.json();

  const backendResponse = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  const body = await backendResponse.json();

  if (!backendResponse.ok) {
    return NextResponse.json(body, { status: backendResponse.status });
  }

  const { token, expiresAt, userId, name, role } = body;

  const response = NextResponse.json({ userId, name, email, role });

  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // Si "Recordarme" está desactivado, no se fija maxAge → cookie de sesión,
    // se borra al cerrar el navegador. Si está activado, persiste hasta la
    // expiración real del JWT que ya calculó el backend.
    ...(rememberMe ? { expires: new Date(expiresAt) } : {}),
  });

  return response;
}
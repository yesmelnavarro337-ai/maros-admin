import { NextRequest, NextResponse } from "next/server";
import { API_URL, AUTH_COOKIE_NAME } from "@/lib/api/config";

export async function POST(request: NextRequest) {
  try {
    const { email, password, rememberMe } = await request.json();

    const backendUrl = `${API_URL}/api/Auth/login`;
    let backendResponse: Response;

    try {
      backendResponse = await fetch(backendUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      });
    } catch {
      // Fallback a servidor de producción si el servidor local no está disponible
      const fallbackUrl = "https://maros-backend-pjvy.onrender.com/api/Auth/login";
      backendResponse = await fetch(fallbackUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      });
    }

    const body = await backendResponse.json().catch(() => null);

    if (!backendResponse.ok) {
      return NextResponse.json(
        body ?? { message: "Correo o contraseña incorrectos." },
        { status: backendResponse.status }
      );
    }

    const { token, expiresAt, userId, name, role } = body;

    const response = NextResponse.json({ userId, name, email, role });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      ...(rememberMe ? { expires: new Date(expiresAt) } : {}),
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno en inicio de sesión.";
    return NextResponse.json(
      { message: "No se pudo comunicar con el servicio de autenticación.", detail: message },
      { status: 503 }
    );
  }
}
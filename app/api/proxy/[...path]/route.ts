import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_URL, AUTH_COOKIE_NAME } from "@/lib/api/config";
import { isRouteAllowed } from "@/lib/api/allowlist";

async function handler(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const joinedPath = path.join("/");
  const method = request.method;

  if (!isRouteAllowed(method, joinedPath)) {
    return NextResponse.json(
      { status: 404, message: "Ruta no permitida." },
      { status: 404 }
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  const backendUrl = new URL(`/api/${joinedPath}`, API_URL);
  backendUrl.search = request.nextUrl.search;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const hasBody = method !== "GET" && method !== "HEAD";

  const backendResponse = await fetch(backendUrl, {
    method,
    headers,
    body: hasBody ? request.body : undefined,
    // @ts-expect-error - "duplex" es requerido por fetch de Node para bodies en streaming (JSON o multipart/form-data), pero no está en el tipo TS todavía.
    duplex: hasBody ? "half" : undefined,
    cache: "no-store",
  });

  const responseBody = await backendResponse.arrayBuffer();
  const responseHeaders = new Headers();
  const responseContentType = backendResponse.headers.get("content-type");
  if (responseContentType) responseHeaders.set("content-type", responseContentType);

  return new NextResponse(responseBody, {
    status: backendResponse.status,
    headers: responseHeaders,
  });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
};
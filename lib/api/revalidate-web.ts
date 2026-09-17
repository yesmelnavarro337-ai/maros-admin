/**
 * Envía una petición de revalidación a maros-web para purgar la caché de Next.js
 * cuando se realizan cambios administrativos en categorías o productos.
 */
export async function revalidateWeb(options: { tag?: string; path?: string }): Promise<boolean> {
  try {
    const webUrl = process.env.NEXT_PUBLIC_MAROS_WEB_URL || "http://localhost:3001";
    const secret = process.env.NEXT_PUBLIC_REVALIDATION_SECRET || "maros-secret-key";

    // Intentar la petición al puerto principal/configurado
    const res = await fetch(`${webUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-secret": secret,
      },
      body: JSON.stringify(options),
    }).catch(async () => {
      // Fallback a puerto alternativo (3000 <-> 3001) si falla la conexión
      const fallbackUrl = webUrl.includes(":3001") ? "http://localhost:3000" : "http://localhost:3001";
      return fetch(`${fallbackUrl}/api/revalidate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-revalidate-secret": secret,
        },
        body: JSON.stringify(options),
      });
    });

    if (!res.ok) {
      console.warn("No se pudo revalidar la caché en maros-web:", res.statusText);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Excepción al intentar revalidar maros-web:", err);
    return false;
  }
}

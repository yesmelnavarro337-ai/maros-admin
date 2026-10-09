/**
 * Tipos MIME y extensiones aceptadas para carga de imágenes en el ecosistema Maro's Pijamas.
 * Incluye soporte nativo para Apple HEIC/HEIF (.heic, .heif).
 */
export const ACCEPT_IMAGE_TYPES =
  "image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.heic,.heif";

/**
 * Tipos MIME y extensiones aceptadas para carga de videos (compatible con la
 * lista de extensiones del backend MediaController).
 */
export const ACCEPT_VIDEO_TYPES =
  "video/mp4,video/webm,video/quicktime,video/mov,video/m4v,.mp4,.webm,.mov,.MOV,.m4v";

/**
 * Detecta si un archivo subido corresponde a un video según su MIME o extensión.
 */
export function detectMediaType(file: File): "image" | "video" {
  const isVideoMime = file.type.startsWith("video/");
  const isVideoExtension = /\.(mp4|webm|mov|m4v|avi|mkv|quicktime)$/i.test(file.name);
  return isVideoMime || isVideoExtension ? "video" : "image";
}

/**
 * Detecta si una URL de Cloudinary (o externa) apunta a un video. Las URLs de
 * Cloudinary siempre incluyen el resource type en la ruta (`/video/upload/`).
 */
export function isVideoUrl(url: string): boolean {
  const lower = (url || "").toLowerCase();
  return (
    lower.includes("/video/upload/") ||
    /\.(mp4|webm|mov|m4v|avi|mkv)(\?|#|$)/.test(lower)
  );
}

/**
 * Detecta si un archivo corresponde al formato HEIC o HEIF de Apple.
 */
export function isHeicFile(file: File): boolean {
  if (!file) return false;
  const mime = (file.type || "").toLowerCase();
  const name = (file.name || "").toLowerCase();
  return (
    mime === "image/heic" ||
    mime === "image/heif" ||
    mime === "image/heic-sequence" ||
    mime === "image/heif-sequence" ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  );
}

/**
 * Normaliza un archivo HEIC/HEIF convirtiéndolo en JPEG para compatibilidad universal
 * en navegadores (Chrome, Edge, Firefox, Safari) y previsualización inmediata.
 * Si el archivo ya es un formato estándar (JPG, PNG, WebP), se retorna sin modificar.
 */
export async function normalizeImageFile(file: File): Promise<File> {
  if (!isHeicFile(file)) {
    return file;
  }

  try {
    const heic2anyModule = await import("heic2any");
    const heic2any = heic2anyModule.default || heic2anyModule;

    const converted = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.92,
    });

    const blob = Array.isArray(converted) ? converted[0] : converted;
    const originalName = file.name || "image";
    const newName = originalName.replace(/\.hei[cf]$/i, "") + ".jpg";

    return new File([blob], newName, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch (error) {
    console.warn(
      `[HEIC] No se pudo convertir en cliente "${file.name}", se enviará el archivo original al servidor:`,
      error
    );
    return file;
  }
}

/**
 * Normaliza una lista o array de archivos, procesando los HEIC/HEIF de forma transparente.
 */
export async function normalizeImageFiles(files: FileList | File[]): Promise<File[]> {
  const fileArray = Array.from(files);
  return Promise.all(fileArray.map((f) => normalizeImageFile(f)));
}

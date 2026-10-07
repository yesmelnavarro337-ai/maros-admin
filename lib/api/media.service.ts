import { normalizeImageFile } from "@/lib/utils/image-file";

export interface MediaUploadResult {
  url: string;
  publicId: string;
}

export async function uploadImage(file: File, folder: string): Promise<MediaUploadResult> {
  const processedFile = await normalizeImageFile(file);
  const formData = new FormData();
  formData.append("file", processedFile);
  formData.append("folder", folder);

  const response = await fetch("/api/proxy/Media/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? "No se pudo subir la imagen.");
  }

  return response.json();
}
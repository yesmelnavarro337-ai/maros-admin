import type { GalleryImage, GalleryCategory } from "../types";

interface PagedResult<T> {
  items: T[];
}

interface ApiGalleryImage {
  id: string;
  url: string;
  category: string;
  caption: string;
}

const CATEGORY_TO_API: Record<GalleryCategory, string> = {
  "Clientes reales": "ClientesReales",
  Navidad: "Navidad",
  Parejas: "Parejas",
  "Detalles de bordado": "DetallesBordado",
};

const CATEGORY_FROM_API: Record<string, GalleryCategory> = {
  ClientesReales: "Clientes reales",
  Navidad: "Navidad",
  Parejas: "Parejas",
  DetallesBordado: "Detalles de bordado",
};

function adaptImage(i: ApiGalleryImage): GalleryImage {
  return {
    id: i.id,
    url: i.url,
    category: CATEGORY_FROM_API[i.category] ?? "Clientes reales",
    caption: i.caption,
  };
}

export async function getGalleryImages(category?: GalleryCategory): Promise<GalleryImage[]> {
  const params = new URLSearchParams();
  params.set("pageSize", "100");
  if (category) params.set("category", CATEGORY_TO_API[category]);

  const response = await fetch(`/api/proxy/Gallery?${params.toString()}`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("No se pudo cargar la galería.");
  const result: PagedResult<ApiGalleryImage> = await response.json();
  return result.items.map(adaptImage);
}

export async function addGalleryImage(file: File, category: GalleryCategory, caption: string): Promise<GalleryImage> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("category", CATEGORY_TO_API[category]);
  formData.append("caption", caption);

  const response = await fetch("/api/proxy/Gallery", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? "No se pudo subir la imagen.");
  }

  return adaptImage(await response.json());
}

export async function deleteGalleryImage(id: string): Promise<void> {
  const response = await fetch(`/api/proxy/Gallery/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? "No se pudo eliminar la imagen.");
  }
}
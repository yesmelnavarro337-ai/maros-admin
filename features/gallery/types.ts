export const GALLERY_CATEGORIES = ["Clientes reales", "Navidad", "Parejas", "Detalles de bordado"] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export interface GalleryImage {
  id: string;
  url: string;
  category: GalleryCategory;
  caption: string;
}
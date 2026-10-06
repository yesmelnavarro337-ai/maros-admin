import type { GalleryImageItem } from "@/components/shared/image-gallery-uploader";

export type SeasonStatus = "borrador" | "programada" | "activa" | "finalizada";

export interface SeasonColors {
  primary: string;
  accent: string;
  background: string;
}

export interface SeasonImage {
  id: string;
  imageUrl: string;
  order: number;
  isPrimary: boolean;
}

/** Item editable del selector multi-imagen; `id` ausente = imagen nueva. */
export type SeasonImageInput = GalleryImageItem;

export interface Season {
  id: string;
  name: string;
  slug: string;
  startDate: string;
  endDate: string;
  status: SeasonStatus;
  collectionId: string;
  collectionName: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
  bannerImage?: string;
  coverImageUrl?: string;
  colors: SeasonColors;
  ctaText: string;
  ctaLink: string;
  featuredProductIds: string[];
  images: SeasonImage[];
  isActive?: boolean;
  productsCount?: number;
  isVisibleStore?: boolean;
  isFeaturedHome?: boolean;
  allowCustomization?: boolean;
}
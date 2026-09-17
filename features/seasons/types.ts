export type SeasonStatus = "borrador" | "programada" | "activa" | "finalizada";

export interface SeasonColors {
  primary: string;
  accent: string;
  background: string;
}

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
  isActive?: boolean;
  productsCount?: number;
  isVisibleStore?: boolean;
  isFeaturedHome?: boolean;
  allowCustomization?: boolean;
}
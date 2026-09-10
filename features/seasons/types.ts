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
  colors: SeasonColors;
  ctaText: string;
  ctaLink: string;
  featuredProductIds: string[];
}
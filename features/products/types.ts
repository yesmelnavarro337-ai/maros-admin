import type { SeoData } from "@/types/seo";

export type ProductStatus = "activo" | "borrador" | "archivado";
export type ProductDisplayStatus = "Activo" | "Stock bajo" | "Sin stock" | "Borrador" | "Archivado";
export type ProductVisibility = "publico" | "registrados" | "oculto";

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  colorName: string;
  colorHex: string;
  sku: string;
  stock: number;
  image?: string;
  price?: number;
  status?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  description: string;
  basePrice: number;
  status: ProductStatus;
  displayStatus: ProductDisplayStatus;
  sku: string;
  totalStock: number;
  seasonName: string;
  imageUrl?: string;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  variants: ProductVariant[];
  collectionIds: string[];
  featuredHome: boolean;
  allowCustomization: boolean;
  deliveryTime: string;
  weightKg?: number;
  brand?: string;
  isOffer?: boolean;
  freeShipping?: boolean;
  tags?: string[];
  visibility?: ProductVisibility;
  trackInventory?: boolean;
  shippingMethod?: string;
  warrantyPeriod?: string;
  seo: SeoData;
  createdAt: string;
}

export interface ProductMetrics {
  activeProductsCount: number;
  activeProductsVariationPercentage: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface ProductFilters {
  search: string;
  categoryId: string;
  status: string;
  seasonId: string;
  page: number;
  pageSize: number;
}

export interface PagedProductsResult {
  items: Product[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export const DELIVERY_TIME_OPTIONS = [
  "3-5 días hábiles",
  "5-7 días hábiles",
  "7-10 días hábiles",
  "10-15 días hábiles (personalizado)",
] as const;

export const SHIPPING_METHOD_OPTIONS = [
  "Envío Estándar Nacional",
  "Envío Express / Servientrega",
  "Retiro en Tienda / Showroom",
  "Envío Internacional",
] as const;

export const WARRANTY_OPTIONS = [
  "30 días por defectos de fábrica",
  "60 días por defectos de fábrica",
  "90 días por defectos de fábrica",
  "Sin garantía extendida",
] as const;
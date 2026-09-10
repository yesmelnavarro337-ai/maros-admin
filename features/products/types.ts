import type { SeoData } from "@/types/seo";
import type { CollectionId } from "@/features/collections/types";

export type ProductStatus = "activo" | "borrador" | "archivado";

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
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  variants: ProductVariant[];
  collectionIds: string[];
  featuredHome: boolean;
  allowCustomization: boolean;
  deliveryTime: string;
  seo: SeoData;
  createdAt: string;
}

export interface ProductFilters {
  search: string;
  categoryId: string;
  status: ProductStatus | "todos";
}

export const DELIVERY_TIME_OPTIONS = [
  "3-5 días hábiles",
  "5-7 días hábiles",
  "7-10 días hábiles",
  "10-15 días hábiles (personalizado)",
] as const;
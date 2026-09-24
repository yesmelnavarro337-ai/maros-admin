export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  productsCount: number;
  createdAt: string;
  updatedAt?: string | null;
  defaultPrice?: number | null;
  surchargeReason?: string | null;
}
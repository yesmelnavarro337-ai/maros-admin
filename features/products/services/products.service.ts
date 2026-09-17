import { apiFetch } from "@/lib/api/client-fetcher";
import { revalidateWeb } from "@/lib/api/revalidate-web";
import type {
  Product,
  ProductFilters,
  ProductStatus,
  ProductDisplayStatus,
  ProductMetrics,
  PagedProductsResult,
} from "../types";

interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

interface ApiProductVariant {
  id: string;
  size: string;
  colorName: string;
  colorHex: string;
  sku: string;
  stock: number;
  imageUrl?: string | null;
}

interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  description: string;
  basePrice: number;
  status: string;
  featuredHome: boolean;
  allowCustomization: boolean;
  deliveryTime: string;
  seoTitle: string;
  seoDescription: string;
  seoSlug: string;
  seoSocialImageUrl?: string | null;
  seoAltText?: string | null;
  images: string[];
  variants: ApiProductVariant[];
  collectionIds: string[];
  createdAt: string;
  sku?: string;
  totalStock?: number;
  seasonName?: string;
  imageUrl?: string | null;
}

function statusToApi(status: string): string {
  if (status === "activo") return "Activo";
  if (status === "borrador") return "Borrador";
  if (status === "archivado") return "Archivado";
  if (status === "lowStock" || status === "stockBajo") return "LowStock";
  if (status === "outOfStock" || status === "sinStock") return "OutOfStock";
  return status;
}

function statusFromApi(status: string): ProductStatus {
  return (
    { Activo: "activo", Borrador: "borrador", Archivado: "archivado" }[status] as ProductStatus
  ) ?? "activo";
}

function adaptProduct(p: ApiProduct): Product {
  const sizes = Array.from(new Set(p.variants.map((v) => v.size)));
  const colors = Array.from(
    new Map(p.variants.map((v) => [v.colorName, { name: v.colorName, hex: v.colorHex }])).values()
  );

  const totalStock = p.totalStock ?? p.variants.reduce((sum, v) => sum + v.stock, 0);
  const baseStatus = statusFromApi(p.status);

  let displayStatus: ProductDisplayStatus = "Activo";
  if (baseStatus === "borrador") displayStatus = "Borrador";
  else if (baseStatus === "archivado") displayStatus = "Archivado";
  else if (totalStock === 0) displayStatus = "Sin stock";
  else if (totalStock <= 3) displayStatus = "Stock bajo";
  else displayStatus = "Activo";

  const primarySku = p.sku || p.variants[0]?.sku || `MP-${p.id.slice(0, 4).toUpperCase()}`;
  const primaryImageUrl = p.imageUrl || p.images[0] || undefined;
  const seasonName = p.seasonName || "Otoño - Invierno";

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    categoryId: p.categoryId,
    categoryName: p.categoryName || "Pijamas de mujer",
    description: p.description,
    basePrice: p.basePrice,
    status: baseStatus,
    displayStatus,
    sku: primarySku,
    totalStock,
    seasonName,
    imageUrl: primaryImageUrl,
    images: p.images,
    sizes,
    colors,
    variants: p.variants.map((v) => ({
      id: v.id,
      size: v.size,
      colorName: v.colorName,
      colorHex: v.colorHex,
      sku: v.sku,
      stock: v.stock,
      image: v.imageUrl ?? undefined,
    })),
    collectionIds: p.collectionIds,
    featuredHome: p.featuredHome,
    allowCustomization: p.allowCustomization,
    deliveryTime: p.deliveryTime,
    seo: {
      title: p.seoTitle,
      description: p.seoDescription,
      slug: p.seoSlug,
      socialImage: p.seoSocialImageUrl ?? undefined,
      altText: p.seoAltText ?? undefined,
    },
    createdAt: p.createdAt,
  };
}

interface SaveProductPayload {
  name: string;
  categoryId: string;
  description: string;
  basePrice: number;
  status: ProductStatus;
  featuredHome: boolean;
  allowCustomization: boolean;
  deliveryTime: string;
  seo: { title: string; description: string; socialImage?: string; altText?: string };
  images: string[];
  variants: { size: string; colorName: string; colorHex: string; sku: string; stock: number; image?: string }[];
  collectionIds: string[];
}

function buildApiPayload(data: SaveProductPayload) {
  return {
    name: data.name,
    categoryId: data.categoryId || null,
    description: data.description,
    basePrice: data.basePrice,
    status: statusToApi(data.status),
    featuredHome: data.featuredHome,
    allowCustomization: data.allowCustomization,
    deliveryTime: data.deliveryTime,
    seoTitle: data.seo.title,
    seoDescription: data.seo.description,
    seoSocialImageUrl: data.seo.socialImage ?? null,
    seoAltText: data.seo.altText ?? null,
    imageUrls: data.images,
    variants: data.variants.map((v) => ({
      size: v.size,
      colorName: v.colorName,
      colorHex: v.colorHex,
      sku: v.sku,
      stock: v.stock,
      imageUrl: v.image ?? null,
    })),
    collectionIds: data.collectionIds,
  };
}

export async function getProductMetrics(): Promise<ProductMetrics> {
  return apiFetch<ProductMetrics>("Products/metrics");
}

export async function getProductsPaged(filters?: Partial<ProductFilters>): Promise<PagedProductsResult> {
  const params = new URLSearchParams();
  params.set("pageNumber", String(filters?.page ?? 1));
  params.set("pageSize", String(filters?.pageSize ?? 10));

  if (filters?.search) params.set("search", filters.search);
  if (filters?.categoryId && filters.categoryId !== "todas") params.set("categoryId", filters.categoryId);
  if (filters?.status && filters.status !== "todos") params.set("status", statusToApi(filters.status));
  if (filters?.seasonId && filters.seasonId !== "todas") params.set("seasonId", filters.seasonId);

  const result = await apiFetch<PagedResult<ApiProduct>>(`Products?${params.toString()}`);
  return {
    items: result.items.map(adaptProduct),
    totalCount: result.totalCount,
    pageNumber: result.pageNumber,
    pageSize: result.pageSize,
    totalPages: result.totalPages,
  };
}

export async function getProducts(filters?: Partial<ProductFilters>): Promise<Product[]> {
  const paged = await getProductsPaged(filters);
  return paged.items;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const product = await apiFetch<ApiProduct>(`Products/${id}`);
    return adaptProduct(product);
  } catch {
    return undefined;
  }
}

export async function createProduct(data: SaveProductPayload): Promise<Product> {
  const created = await apiFetch<ApiProduct>("Products", {
    method: "POST",
    body: buildApiPayload(data),
  });
  revalidateWeb({ tag: "products" });
  return adaptProduct(created);
}

export async function updateProduct(id: string, data: SaveProductPayload): Promise<Product | undefined> {
  const updated = await apiFetch<ApiProduct>(`Products/${id}`, {
    method: "PUT",
    body: buildApiPayload(data),
  });
  revalidateWeb({ tag: "products" });
  return adaptProduct(updated);
}

export async function deleteProduct(id: string): Promise<void> {
  await apiFetch<void>(`Products/${id}`, { method: "DELETE" });
  revalidateWeb({ tag: "products" });
}

export function toSavePayload(product: Product): SaveProductPayload {
  return {
    name: product.name,
    categoryId: product.categoryId,
    description: product.description,
    basePrice: product.basePrice,
    status: product.status,
    featuredHome: product.featuredHome,
    allowCustomization: product.allowCustomization,
    deliveryTime: product.deliveryTime,
    seo: {
      title: product.seo.title ?? "",
      description: product.seo.description ?? "",
      socialImage: product.seo.socialImage,
      altText: product.seo.altText,
    },
    images: product.images,
    variants: product.variants.map((v) => ({
      size: v.size,
      colorName: v.colorName,
      colorHex: v.colorHex,
      sku: v.sku,
      stock: v.stock,
      image: v.image,
    })),
    collectionIds: product.collectionIds,
  };
}

export async function updateProductStatus(id: string, status: ProductStatus): Promise<Product | undefined> {
  const product = await getProductById(id);
  if (!product) return undefined;
  return updateProduct(id, { ...toSavePayload(product), status });
}
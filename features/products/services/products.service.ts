import { apiFetch } from "@/lib/api/client-fetcher";
import { revalidateWeb } from "@/lib/api/revalidate-web";
import type {
  Product,
  ProductColor,
  ProductFilters,
  ProductStatus,
  ProductDisplayStatus,
  ProductMetrics,
  PagedProductsResult,
  ProductImageItem,
  CategoryPriceEntry,
  ProductCategorySummary,
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
  primaryHex?: string | null;
  secondaryHex?: string | null;
  isCombined?: boolean | null;
  sku: string;
  stock: number;
  price?: number | null;
  imageUrl?: string | null;
  isAvailable?: boolean | null;
  styleName?: string | null;
  materialName?: string | null;
}

interface ApiProductImage {
  id: string;
  url: string;
  order: number;
  colorHex?: string | null;
  colorName?: string | null;
}

interface ApiProductCategory {
  id: string;
  name: string;
  slug: string;
  defaultPrice?: number | null;
  surchargeReason?: string | null;
  price?: number | null;
  productSurchargeReason?: string | null;
}

interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  categoryId?: string | null;
  categoryName: string;
  categoryIds?: string[] | null;
  categories?: ApiProductCategory[] | null;
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
  imageDetails?: ApiProductImage[] | null;
  variants: ApiProductVariant[];
  collectionIds: string[];
  styleIds?: string[] | null;
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

function parseColorInfo(v: ApiProductVariant): {
  primaryHex: string;
  secondaryHex?: string | null;
  isCombined: boolean;
} {
  if (v.isCombined != null) {
    return {
      primaryHex: v.primaryHex || v.colorHex || "#6B6832",
      secondaryHex: v.secondaryHex || null,
      isCombined: Boolean(v.isCombined),
    };
  }

  if (v.colorHex && v.colorHex.includes("|")) {
    const parts = v.colorHex.split("|");
    return {
      primaryHex: parts[0] || "#6B6832",
      secondaryHex: parts[1] || null,
      isCombined: true,
    };
  }

  return {
    primaryHex: v.primaryHex || v.colorHex || "#6B6832",
    secondaryHex: v.secondaryHex || null,
    isCombined: false,
  };
}

function adaptProduct(p: ApiProduct): Product {
  const sizes = Array.from(new Set(p.variants.map((v) => v.size)));
  const colors: ProductColor[] = Array.from(
    new Map(
      p.variants.map((v) => {
        const info = parseColorInfo(v);
        return [
          v.colorName,
          {
            name: v.colorName,
            hex: info.primaryHex,
            primaryHex: info.primaryHex,
            secondaryHex: info.secondaryHex,
            isCombined: info.isCombined,
          },
        ];
      })
    ).values()
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
  const categoryIds = p.categoryIds?.length ? p.categoryIds : p.categoryId ? [p.categoryId] : [];
  
  const categories: ProductCategorySummary[] = p.categories?.length
    ? p.categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        defaultPrice: c.defaultPrice,
        surchargeReason: c.surchargeReason,
        price: c.price,
        productSurchargeReason: c.productSurchargeReason,
      }))
    : p.categoryId
      ? [{ id: p.categoryId, name: p.categoryName || "Pijamas de mujer", slug: "" }]
      : [];

  const categoryName = p.categoryName || categories.map((c) => c.name).join(", ") || "Pijamas de mujer";

  const categoryPrices: CategoryPriceEntry[] = categories.map((c) => ({
    categoryId: c.id,
    price: c.price ?? undefined,
    surchargeReason: c.productSurchargeReason ?? undefined,
  }));

  const imageDetails: ProductImageItem[] = p.imageDetails?.length
    ? p.imageDetails.map((img) => {
        const matched = colors.find(
          (c) =>
            (img.colorName && c.name.toLowerCase() === img.colorName.toLowerCase()) ||
            (img.colorHex &&
              ((c.primaryHex && c.primaryHex.toLowerCase() === img.colorHex.toLowerCase()) ||
                (c.hex && c.hex.toLowerCase() === img.colorHex.toLowerCase())))
        );
        return {
          id: img.id,
          url: img.url,
          order: img.order,
          colorHex: img.colorHex ?? (matched?.primaryHex || undefined),
          colorName: img.colorName ?? (matched?.name || undefined),
          primaryHex: matched?.primaryHex ?? img.colorHex ?? undefined,
          secondaryHex: matched?.secondaryHex ?? undefined,
          isCombined: matched?.isCombined ?? undefined,
        };
      })
    : p.images.map((url, idx) => ({
        url,
        order: idx,
      }));

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    categoryIds,
    categories,
    categoryPrices,
    categoryId: categoryIds[0] ?? "",
    categoryName,
    description: p.description,
    basePrice: p.basePrice,
    status: baseStatus,
    displayStatus,
    sku: primarySku,
    totalStock,
    seasonName,
    imageUrl: primaryImageUrl,
    images: p.images,
    imageDetails,
    sizes,
    colors,
    variants: p.variants.map((v) => {
      const info = parseColorInfo(v);
      return {
        id: v.id,
        size: v.size,
        colorName: v.colorName,
        colorHex: info.primaryHex,
        primaryHex: info.primaryHex,
        secondaryHex: info.secondaryHex,
        isCombined: info.isCombined,
        sku: v.sku,
        stock: v.stock,
        price: v.price ?? undefined,
        image: v.imageUrl ?? undefined,
        styleName: v.styleName ?? null,
        materialName: v.materialName ?? null,
        isAvailable: v.isAvailable ?? true,
      };
    }),
    collectionIds: p.collectionIds,
    styleIds: p.styleIds ?? [],
    styles: [
      ...new Set(
        p.variants
          .map((v) => v.styleName)
          .filter((name): name is string => Boolean(name && name.trim()))
      ),
    ],
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

export interface SaveProductPayload {
  name: string;
  categoryIds: string[];
  categoryPrices?: CategoryPriceEntry[];
  description: string;
  basePrice: number;
  status: ProductStatus;
  featuredHome: boolean;
  allowCustomization: boolean;
  deliveryTime: string;
  seo: { title: string; description: string; socialImage?: string; altText?: string };
  images: string[];
  imageDetails?: ProductImageItem[];
  variants: {
    id?: string | null;
    size: string;
    colorName: string;
    colorHex: string;
    primaryHex?: string;
    secondaryHex?: string | null;
    isCombined?: boolean;
    sku: string;
    stock: number;
    price?: number | null;
    image?: string;
    styleName?: string | null;
    materialName?: string | null;
    isAvailable?: boolean;
  }[];
  collectionIds: string[];
  styleIds?: string[];
}

function isValidGuid(val?: string | null): boolean {
  if (!val || typeof val !== "string") return false;
  const trimmed = val.trim();
  if (!trimmed || trimmed === "00000000-0000-0000-0000-000000000000") return false;
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(trimmed);
}

function buildApiPayload(data: SaveProductPayload) {
  return {
    name: data.name,
    categoryIds: data.categoryIds,
    categoryPrices: data.categoryPrices?.map((cp) => ({
      categoryId: cp.categoryId,
      price: cp.price != null && !isNaN(Number(cp.price)) ? Number(cp.price) : null,
      surchargeReason: cp.surchargeReason || null,
    })),
    description: data.description,
    basePrice: Number(data.basePrice),
    status: statusToApi(data.status),
    featuredHome: data.featuredHome,
    allowCustomization: data.allowCustomization,
    deliveryTime: data.deliveryTime,
    seoTitle: data.seo.title,
    seoDescription: data.seo.description,
    seoSocialImageUrl: data.seo.socialImage ?? null,
    seoAltText: data.seo.altText ?? null,
    imageUrls: data.images,
    images: (data.imageDetails && data.imageDetails.length > 0
      ? data.imageDetails
      : data.images.map((url, idx): ProductImageItem => ({ url, order: idx }))
    ).map((img, idx) => ({
      id: img.id && isValidGuid(img.id) ? img.id : null,
      url: img.url,
      order: img.order ?? idx,
      colorHex: img.colorHex || null,
      colorName: img.colorName || null,
    })),
    variants: data.variants.map((v) => ({
      id: v.id && isValidGuid(v.id) ? v.id : null,
      size: v.size,
      colorName: v.colorName,
      colorHex: v.primaryHex || v.colorHex || "#000000",
      primaryHex: v.primaryHex || v.colorHex || "#000000",
      secondaryHex: v.secondaryHex ?? null,
      isCombined: Boolean(v.isCombined),
      sku: v.sku,
      stock: Number(v.stock),
      price: v.price != null && !isNaN(Number(v.price)) ? Number(v.price) : null,
      imageUrl: v.image ?? null,
      styleName: v.styleName ?? null,
      materialName: v.materialName ?? null,
      isAvailable: v.isAvailable ?? true,
    })),
    collectionIds: data.collectionIds,
    styleIds: (data.styleIds ?? []).filter(isValidGuid),
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
    categoryIds: product.categoryIds,
    categoryPrices: product.categoryPrices,
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
    imageDetails: product.imageDetails,
    variants: product.variants.map((v) => ({
      id: v.id,
      size: v.size,
      colorName: v.colorName,
      colorHex: v.colorHex,
      primaryHex: v.primaryHex || v.colorHex,
      secondaryHex: v.secondaryHex,
      isCombined: v.isCombined,
      sku: v.sku,
      stock: v.stock,
      price: v.price,
      image: v.image,
      styleName: v.styleName ?? null,
      materialName: v.materialName ?? null,
      isAvailable: v.isAvailable ?? true,
    })),
    collectionIds: product.collectionIds,
    styleIds: product.styleIds ?? [],
  };
}

export async function updateProductStatus(id: string, status: ProductStatus): Promise<Product | undefined> {
  const product = await getProductById(id);
  if (!product) return undefined;
  return updateProduct(id, { ...toSavePayload(product), status });
}

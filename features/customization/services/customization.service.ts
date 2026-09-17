import { apiFetch } from "@/lib/api/client-fetcher";
import type { CatalogItem, CatalogKey } from "../types";

export type { CatalogItem, CatalogKey };

export type SpecificCatalogKey = Exclude<CatalogKey, "overview">;

interface ApiCustomizationOption {
  id: string;
  catalogType: string;
  name: string;
  imageUrl?: string | null;
  colorHex?: string | null;
  priceModifier?: number | null;
  active: boolean;
}

const CATALOG_TO_API: Record<SpecificCatalogKey, string> = {
  modelos: "Modelo",
  telas: "Tela",
  colores: "Color",
  estampados: "Estampado",
  bordados: "Bordado",
  tallas: "Talla",
};

const API_TO_CATALOG: Record<string, SpecificCatalogKey> = {
  Modelo: "modelos",
  Tela: "telas",
  Color: "colores",
  Estampado: "estampados",
  Bordado: "bordados",
  Talla: "tallas",
};

export type CustomizationCatalogs = Record<SpecificCatalogKey, CatalogItem[]>;

let cachedCatalogs: CustomizationCatalogs | null = null;
let pendingCatalogs: Promise<CustomizationCatalogs> | null = null;

function adaptItem(o: ApiCustomizationOption): CatalogItem {
  const cat = API_TO_CATALOG[o.catalogType] ?? "modelos";
  return {
    id: o.id,
    catalog: cat,
    name: o.name,
    image: o.imageUrl ?? undefined,
    hex: o.colorHex ?? undefined,
    priceModifier: o.priceModifier ?? undefined,
    active: o.active,
  };
}

function groupCatalogs(options: ApiCustomizationOption[]): CustomizationCatalogs {
  const catalogs: CustomizationCatalogs = {
    modelos: [],
    telas: [],
    colores: [],
    estampados: [],
    bordados: [],
    tallas: [],
  };

  for (const option of options) {
    const catalog = API_TO_CATALOG[option.catalogType];
    if (catalog) catalogs[catalog].push(adaptItem(option));
  }

  return catalogs;
}

export async function getCustomizationCatalogs(force = false): Promise<CustomizationCatalogs> {
  if (!force && cachedCatalogs) return cachedCatalogs;
  if (!force && pendingCatalogs) return pendingCatalogs;

  const request = apiFetch<ApiCustomizationOption[]>("CustomizationOptions").then(groupCatalogs);
  if (!force) pendingCatalogs = request;

  try {
    const catalogs = await request;
    cachedCatalogs = catalogs;
    return catalogs;
  } finally {
    if (pendingCatalogs === request) pendingCatalogs = null;
  }
}

export async function getCatalogItems(catalog: SpecificCatalogKey): Promise<CatalogItem[]> {
  const catalogs = await getCustomizationCatalogs();
  return catalogs[catalog] || [];
}

export async function createCatalogItem(
  data: Omit<CatalogItem, "id">
): Promise<CatalogItem> {
  const created = await apiFetch<ApiCustomizationOption>("CustomizationOptions", {
    method: "POST",
    body: {
      catalogType: CATALOG_TO_API[data.catalog],
      name: data.name,
      imageUrl: data.image ?? null,
      colorHex: data.hex ?? null,
      priceModifier: data.priceModifier ?? null,
    },
  });
  cachedCatalogs = null;
  return adaptItem(created);
}

export async function updateCatalogItem(
  id: string,
  data: Partial<CatalogItem>
): Promise<CatalogItem | undefined> {
  const updated = await apiFetch<ApiCustomizationOption>(`CustomizationOptions/${id}`, {
    method: "PUT",
    body: {
      name: data.name,
      imageUrl: data.image ?? null,
      colorHex: data.hex ?? null,
      priceModifier: data.priceModifier ?? null,
      active: data.active ?? true,
    },
  });
  cachedCatalogs = null;
  return adaptItem(updated);
}

export async function deleteCatalogItem(id: string): Promise<void> {
  await apiFetch<void>(`CustomizationOptions/${id}`, { method: "DELETE" });
  cachedCatalogs = null;
}

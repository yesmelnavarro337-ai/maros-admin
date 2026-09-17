export type CatalogKey =
  | "overview"
  | "modelos"
  | "telas"
  | "colores"
  | "estampados"
  | "bordados"
  | "tallas";

export interface CatalogItem {
  id: string;
  catalog: Exclude<CatalogKey, "overview">;
  name: string;
  image?: string;
  hex?: string;
  priceModifier?: number;
  active?: boolean;
  assignedOptionIds?: string[];
  description?: string;
  category?: string;
}

export interface CatalogConfig {
  key: Exclude<CatalogKey, "overview">;
  label: string;
  singularLabel: string;
  hasImage: boolean;
  hasColor: boolean;
  hasPriceModifier: boolean;
  description: string;
}
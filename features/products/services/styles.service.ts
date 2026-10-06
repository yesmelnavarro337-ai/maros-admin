import { apiFetch } from "@/lib/api/client-fetcher";
import { FIXED_STYLES, INFANTIL_STYLES } from "../utils/price-calculator";

/** Línea de producto del estilo. El backend la expone como string ("Adulto" / "Infantil"). */
export type StyleLine = "Adulto" | "Infantil";

export interface ApiStyle {
  id: string;
  name: string;
  slug: string;
  hexCode?: string | null;
  displayOrder: number;
  line?: StyleLine;
}

export interface StyleOption extends ApiStyle {
  price: number;
}

/**
 * Catálogo de estilos con el precio fijo de maros-admin.
 * Los precios viven en FIXED_STYLES / INFANTIL_STYLES (reglas de negocio del panel);
 * el id, la línea y el estado activo vienen del backend para poder enviar
 * `styleIds` al guardar y filtrar el selector según la categoría del producto.
 */
export async function getStyles(): Promise<StyleOption[]> {
  let apiStyles: ApiStyle[] = [];

  try {
    apiStyles = await apiFetch<ApiStyle[]>("Styles");
  } catch {
    apiStyles = [];
  }

  if (apiStyles.length === 0) return [];

  const priceByName = new Map(
    [...FIXED_STYLES, ...INFANTIL_STYLES].map((s) => [s.name.toLowerCase(), s.price])
  );

  return apiStyles.map((style) => ({
    ...style,
    price: priceByName.get(style.name.toLowerCase()) ?? 0,
  }));
}

/** Resuelve los nombres de estilo seleccionados a los ids persistidos en la BD. */
export function styleNamesToIds(styleNames: string[], catalog: StyleOption[]): string[] {
  const byName = new Map(catalog.map((s) => [s.name.trim().toLowerCase(), s.id]));
  const ids: string[] = [];

  for (const name of styleNames) {
    const id = byName.get(name.trim().toLowerCase());
    if (id && !ids.includes(id)) ids.push(id);
  }

  return ids;
}
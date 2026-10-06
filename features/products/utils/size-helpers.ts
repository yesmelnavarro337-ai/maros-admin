import {
  isInfantilCategory,
  resolveInfantilStyle,
  type SizeLineMode,
} from "./price-calculator";

/* ─────────────────────────── Catálogos de tallas por línea ─────────────────────────── */

/**
 * Tallas de la línea de adultos (los 9 modelos estándar).
 * XL, XXL y 2XL son "talla > L" y reciben el recargo de +$10.000 COP.
 */
export const ADULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "2XL"] as const;

/**
 * Tallas de la línea infantil.
 * El rango Juvenil (10, 12, 14, 16) recibe el recargo de +$10.000 COP sobre el
 * precio base del estilo.
 */
export const INFANT_SIZES = [
  "0-3M",
  "3-6M",
  "6-12M",
  "12-18M",
  "2T",
  "4",
  "6",
  "8",
  "10",
  "12",
  "14",
  "16",
] as const;

/** Catálogo unificado: se usa cuando el producto tiene categorías de ambas líneas. */
export const MIXED_SIZES = [...ADULT_SIZES, ...INFANT_SIZES] as const;

export type SizeLine = SizeLineMode;

/** Normaliza una talla para comparar sin depender de espacios ni mayúsculas. */
export function normalizeSizeKey(size?: string | null): string {
  return (size ?? "").trim().toUpperCase().replace(/\s+/g, "");
}

/**
 * Indica si un nombre de estilo pertenece a la línea infantil.
 * Acepta el sufijo canónico "(Infantil)" de la entidad Style y los alias
 * heredados sin sufijo ("Pantalón y camisa manga corta", "Short y camisa manga
 * corta"). Los estilos de adulto, que llevan "(Mujer)" / "(Hombre)", nunca
 * se clasifican como infantiles aunque compartan la misma firma base.
 */
export function isInfantilStyleName(styleName?: string | null): boolean {
  return resolveInfantilStyle(styleName) !== null;
}

/**
 * Resuelve la línea de producto. La categoría manda: el modo define la línea.
 * En "mixed" ambas líneas quedan habilitadas a la vez (categorías de adulto e
 * infantil seleccionadas simultáneamente).
 */
export function resolveSizeLine(
  _styleName?: string | null,
  mode: SizeLineMode = "adulto"
): SizeLine {
  return mode;
}

/**
 * Catálogo de tallas permitidas para el modo de línea indicado.
 * @param styleName estilo seleccionado (se conserva por compatibilidad; la línea la define el modo)
 * @param mode "infantil" | "adulto" | "mixed" según las categorías seleccionadas
 */
export function getAvailableSizesByStyle(
  styleName: string | null,
  mode: SizeLineMode
): readonly string[] {
  const line = resolveSizeLine(styleName, mode);
  if (line === "mixed") return MIXED_SIZES;
  return line === "infantil" ? INFANT_SIZES : ADULT_SIZES;
}

/** Conjunto normalizado de tallas permitidas, para comparaciones rápidas. */
export function getAllowedSizeSet(
  styleName: string | null,
  mode: SizeLineMode
): Set<string> {
  return new Set(getAvailableSizesByStyle(styleName, mode).map(normalizeSizeKey));
}

/**
 * Conserva únicamente las tallas seleccionadas que siguen siendo válidas para
 * la línea actual. Así, al cambiar de línea se descartan tallas como "XL" en
 * un producto infantil, y se regenera la matriz sin combinaciones inválidas.
 * En modo "mixed" todas las tallas de ambos catálogos son válidas.
 */
export function keepAllowedSizes(
  sizes: string[],
  styleName: string | null,
  mode: SizeLineMode
): string[] {
  const allowed = getAllowedSizeSet(styleName, mode);
  return sizes.filter((s) => allowed.has(normalizeSizeKey(s)));
}

/**
 * Conserva las tallas del producto que son válidas para el estilo elegido.
 * Se usa en maros-web: el producto puede tener tallas fuera de catálogo (datos
 * heredados), y esas se mantienen para no dejar el producto sin opciones.
 */
export function filterSizesForStyle(
  productSizes: string[],
  styleName: string | null,
  mode: SizeLineMode
): string[] {
  const allowed = getAllowedSizeSet(styleName, mode);
  const catalog = new Set<string>(MIXED_SIZES.map(normalizeSizeKey));

  return productSizes.filter((size) => {
    const key = normalizeSizeKey(size);
    // Talla fuera de ambos catálogos: dato heredado, se conserva.
    if (!catalog.has(key)) return true;
    return allowed.has(key);
  });
}

export { isInfantilCategory };
export type { SizeLineMode };

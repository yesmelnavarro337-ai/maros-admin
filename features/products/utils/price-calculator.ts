"use client";

/**
 * Reglas de Precios Fijos Maro's Pijamas
 * 
 * LISTA CERRADA DE ESTILOS FIJOS Y SUS PRECIOS BASE:
 * 1. Short - Camisa manga corta (Mujer) -> $85.000 COP
 * 2. Short - Camisa manga corta (Hombre) -> $95.000 COP
 * 3. Batas -> $85.000 COP
 * 4. Pantalón - Camisa manga corta (Mujer) -> $115.000 COP
 * 5. Pantalón - Camisa manga corta (Hombre) -> $120.000 COP
 * 6. Pantalón - Camisa manga larga (Mujer) -> $135.000 COP
 * 7. Pantalón - Camisa manga larga (Hombre) -> $140.000 COP
 * 8. Short - Camiseta (Hombre / Mujer) -> $70.000 COP
 * 9. Pantalón - Camiseta (Hombre / Mujer) -> $85.000 COP
 */

export interface FixedStyleOption {
  name: string;
  price: number;
}

export const FIXED_STYLES: FixedStyleOption[] = [
  { name: "Short - Camisa manga corta (Mujer)", price: 85000 },
  { name: "Short - Camisa manga corta (Hombre)", price: 95000 },
  { name: "Batas", price: 85000 },
  { name: "Pantalón - Camisa manga corta (Mujer)", price: 115000 },
  { name: "Pantalón - Camisa manga corta (Hombre)", price: 120000 },
  { name: "Pantalón - Camisa manga larga (Mujer)", price: 135000 },
  { name: "Pantalón - Camisa manga larga (Hombre)", price: 140000 },
  { name: "Short - Camiseta (Hombre / Mujer)", price: 70000 },
  { name: "Pantalón - Camiseta (Hombre / Mujer)", price: 85000 },
];

export const PROMO_DISCOUNT_PERCENT = 0.05;

/* ─────────────────────────── Línea "Pijamas de Niños" ─────────────────────────── */

/** Recargo COP que se aplica a las tallas juvenile (10 a 16). */
export const INFANTIL_YOUTH_SURCHARGE = 10000;

/**
 * Tokens que identifican una prenda infantil. Se comparan sobre el texto normalizado
 * sin tildes, por lo que "Niños y Bebes", "ninos-y-bebes" o "Infantil" coinciden.
 */
const INFANTIL_CATEGORY_TOKENS = ["nino", "infantil", "bebe", "kids", "child"];

/** Rango Pequeños: se aplica el precio base del estilo. */
export const INFANTIL_SMALL_SIZES = [
  "0-3M",
  "3-6M",
  "6-12M",
  "12-18M",
  "2T",
  "4",
  "6",
  "8",
] as const;

/** Rango Juvenil: se aplica el precio base del estilo + recargo. */
export const INFANTIL_YOUTH_SIZES = ["10", "12", "14", "16"] as const;

/**
 * Precios base de la línea infantil por estilo (rango Pequeños).
 * Las tallas 10 a 16 se obtienen sumando INFANTIL_YOUTH_SURCHARGE:
 * Pantalón corta 75.000 -> 85.000 | Short corta 65.000 -> 75.000 | Pantalón larga 90.000 -> 100.000
 *
 * Los nombres deben coincidir EXACTAMENTE con los sembrados en la entidad Style
 * (migración AddInfantilStyles), porque el panel resuelve nombre -> id para enviar
 * styleIds al backend. El sufijo "(Infantil)" sustituye al sufijo de género de los
 * estilos de adulto y permite que el selector filtre por línea.
 */
export const INFANTIL_STYLES: FixedStyleOption[] = [
  { name: "Pantalón - Camisa manga corta (Infantil)", price: 75000 },
  { name: "Short - Camisa manga corta (Infantil)", price: 65000 },
  { name: "Pantalón - Camisa manga larga (Infantil)", price: 90000 },
];

/** Normaliza texto para comparaciones (minúsculas, sin tildes, espacios colapsados). */
function normalizeText(value?: string | null): string {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Normaliza una talla: mayúsculas y sin espacios ("2 T" -> "2T", "0-3 m" -> "0-3M"). */
export function normalizeSizeKey(size?: string | null): string {
  return (size ?? "").trim().toUpperCase().replace(/\s+/g, "");
}

/** Indica si las categorías seleccionadas pertenecen a la línea infantil. */
export function isInfantilCategory(categoryNames?: string | string[] | null): boolean {
  if (!categoryNames) return false;
  const text = Array.isArray(categoryNames) ? categoryNames.join(" ") : categoryNames;
  const normalized = normalizeText(text);
  return INFANTIL_CATEGORY_TOKENS.some((token) => normalized.includes(token));
}

/** Indica si las categorías seleccionadas pertenecen a la línea de adulto. */
export function isAdultCategory(categoryNames?: string | string[] | null): boolean {
  if (!categoryNames) return false;
  return !isInfantilCategory(categoryNames);
}

/** Determina el modo de tallas/estilos según las categorías seleccionadas. */
export type SizeLineMode = "infantil" | "adulto" | "mixed";

export function getSizeLineMode(categoryNames?: string | string[] | null): SizeLineMode {
  if (!categoryNames) return "adulto";
  const names = Array.isArray(categoryNames) ? categoryNames : [categoryNames];
  const hasInfantil = names.some((n) => isInfantilCategory(n));
  const hasAdulto = names.some((n) => isAdultCategory(n));
  if (hasInfantil && hasAdulto) return "mixed";
  if (hasInfantil) return "infantil";
  return "adulto";
}

export type InfantilSizeTier = "Pequenos" | "Juvenil";

/**
 * Clasifica una talla dentro de la línea infantil.
 * Devuelve null para tallas de adulto o tallas no reconocidas.
 */
export function getInfantilSizeTier(size?: string | null): InfantilSizeTier | null {
  const key = normalizeSizeKey(size);
  if (!key) return null;

  if ((INFANTIL_YOUTH_SIZES as readonly string[]).includes(key)) return "Juvenil";
  if ((INFANTIL_SMALL_SIZES as readonly string[]).includes(key)) return "Pequenos";

  // Tolerancia a variantes de captura: "12A", "14ANOS", "6T", "4A".
  const numeric = /^(\d{1,2})(?:M|T|A|ANOS)?$/.exec(key);
  if (numeric) {
    const value = Number(numeric[1]);
    if (value >= 10) return "Juvenil";
    if (value >= 2) return "Pequenos";
  }
  return null;
}

/** True cuando la talla pertenece al rango Juvenil (10 a 16). */
export function isInfantilYouthSize(size?: string | null): boolean {
  return getInfantilSizeTier(size) === "Juvenil";
}

/**
 * Firma de un estilo: minúsculas, sin tildes, sin sufijos entre paréntesis y sin
 * separadores ni conectores. Permite comparar "Short - Camisa manga corta
 * (Infantil)" con el alias heredado "Short y camisa manga corta".
 */
function styleSignature(value?: string | null): string {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    // Los conectores de los alias heredados ("Pantalón y Camisa...") no forman
    // parte del nombre del estilo canónico.
    .replace(/\s+(?:y|de|del|con|para|la|el|los|las)\s+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Los 9 estilos de adulto se distinguen por el sufijo de género "(Mujer)" / "(Hombre)". */
function hasAdultGenderMarker(value?: string | null): boolean {
  const text = normalizeText(value);
  return text.includes("mujer") || text.includes("hombre");
}

/**
 * Resuelve el estilo infantil canónico a partir del nombre, aceptando también los
 * alias heredados sin sufijo "(Infantil)" (p. ej. "Short y camisa manga corta").
 * Un marcador de género adulto siempre gana, porque los 9 modelos oficiales
 * llevan "(Mujer)" / "(Hombre)" y comparten firma base con los infantiles.
 */
export function resolveInfantilStyle(styleName?: string | null): FixedStyleOption | null {
  const key = normalizeText(styleName);
  if (!key) return null;
  // Un marcador de género adulto siempre gana: los 9 modelos oficiales llevan
  // "(Mujer)" / "(Hombre)" y comparten firma base con los estilos infantiles.
  if (hasAdultGenderMarker(styleName)) return null;
  if (key.includes("infantil")) {
    const exact = INFANTIL_STYLES.find((s) => normalizeText(s.name) === key);
    if (exact) return exact;
  }
  const signature = styleSignature(styleName);
  if (!signature) return null;
  return INFANTIL_STYLES.find((s) => styleSignature(s.name) === signature) ?? null;
}

/**
 * Precio base infantil de un estilo (rango Pequeños) o null si el estilo
 * no pertenece a la línea infantil. Acepta los nombres canónicos con sufijo
 * "(Infantil)" y los alias heredados sin sufijo.
 */
export function getInfantilBasePrice(styleName?: string | null): number | null {
  return resolveInfantilStyle(styleName)?.price ?? null;
}

/**
 * Recargo aplicable a una talla: juvenile infantil (+10.000) o talla > L (+10.000).
 * Las tallas adulthood conservan el comportamiento previo basado en isLargeSize.
 */
export function getSizeSurcharge(size?: string | null, isInfantil = false): number {
  if (isInfantil && isInfantilYouthSize(size)) return INFANTIL_YOUTH_SURCHARGE;
  return isLargeSize(size) ? 10000 : 0;
}

/** Precio base de una variante ya ajustado por el recargo de su rango de talla. */
export function calculateVariantBasePrice(
  basePrice: number,
  size?: string | null,
  isInfantil = false
): number {
  if (!basePrice || basePrice <= 0) return 0;
  return basePrice + getSizeSurcharge(size, isInfantil);
}

/** Determina si la promoción del 5% está activa según la fecha actual (04 Oct al 09 Nov). */
export function isPromoActive(currentDate = new Date()): boolean {
  const year = currentDate.getFullYear();
  // Mes 9 = Octubre (0-indexed)
  const startDate = new Date(year, 9, 4, 0, 0, 0);
  // Mes 10 = Noviembre (0-indexed)
  const endDate = new Date(year, 10, 9, 23, 59, 59);

  return currentDate >= startDate && currentDate <= endDate;
}

const PLUS_SIZES = new Set(["XL", "2XL", "XXL", "3XL", "XXXL", "4XL", "XXXXL", "5XL"]);

/** Determina si una talla es superior a L (> L). */
export function isLargeSize(size?: string | null): boolean {
  if (!size) return false;
  const s = size.trim().toUpperCase();
  return PLUS_SIZES.has(s) || (s.length >= 2 && s.includes("XL"));
}

/** Busca el precio exacto de un estilo en la lista fija. */
export function getFixedStylePrice(styleName?: string | null): number | null {
  if (!styleName) return null;
  const norm = styleName.trim().toLowerCase();
  const found = FIXED_STYLES.find((s) => s.name.toLowerCase() === norm);
  return found ? found.price : null;
}

/**
 * Calcula el precio base automático según los Estilos seleccionados y/o Categoría.
 */
export function calculateAutomaticBasePrice(
  categoryNames: string[] = [],
  styles: string[] = []
): number {
  const catText = categoryNames.join(" ").toLowerCase();
  const styleText = styles.join(" ").toLowerCase();
  const combinedText = `${catText} ${styleText}`;

  // 0. Línea infantil: si alguno de los estilos pertenece al catálogo infantil
  //    (canónico o alias), manda su precio base. Los estilos de adulto llevan
  //    "(Mujer)" / "(Hombre)" y nunca se resuelven aquí.
  for (const st of styles) {
    const infantilPrice = getInfantilBasePrice(st);
    if (infantilPrice !== null) return infantilPrice;
  }

  // 1. Probar coincidencia directa en lista fija de estilos
  for (const st of styles) {
    const directPrice = getFixedStylePrice(st);
    if (directPrice !== null) return directPrice;
  }

  const isHombre = combinedText.includes("hombre");

  // Reglas por palabras clave de Estilo
  if (styleText.includes("camiseta")) {
    if (styleText.includes("short")) return 70000;
    if (styleText.includes("pantalon") || styleText.includes("pantalón")) return 85000;
  }

  if (styleText.includes("pantalón") || styleText.includes("pantalon")) {
    if (styleText.includes("larga")) {
      return isHombre ? 140000 : 135000;
    }
    return isHombre ? 120000 : 115000;
  }

  if (styleText.includes("short")) {
    return isHombre ? 95000 : 85000;
  }

  // Reglas por Categoría
  if (catText.includes("short")) {
    return isHombre ? 95000 : 85000;
  }

  if (catText.includes("bata")) {
    return 85000;
  }

  if (catText.includes("pantalon") || catText.includes("pantalón")) {
    return isHombre ? 120000 : 115000;
  }

  if (isHombre) {
    return 120000;
  }

  if (catText.includes("mujer")) {
    return 115000;
  }

  return 115000;
}

/**
 * Retorna detalles del precio calculado incluyendo 5% de descuento, recargo por talla y bordado.
 */
export function calculatePriceDetails(
  basePrice: number,
  size?: string | null,
  hasEmbroidery = false
) {
  const isPlusSize = isLargeSize(size);
  const sizeSurcharge = isPlusSize ? 10000 : 0;
  const embroiderySurcharge = hasEmbroidery ? 7000 : 0;

  const promoActive = isPromoActive();
  const discountAmount = promoActive ? Math.round(basePrice * PROMO_DISCOUNT_PERCENT) : 0;
  const baseAfterDiscount = basePrice - discountAmount;
  
  const finalPrice = baseAfterDiscount + sizeSurcharge + embroiderySurcharge;

  return {
    basePrice,
    isPlusSize,
    sizeSurcharge,
    embroiderySurcharge,
    promoActive,
    discountAmount,
    baseAfterDiscount,
    finalPrice,
  };
}

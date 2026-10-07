/**
 * Motor de SKUs de alta escala. Formato determinista y ultracompacto:
 *
 *   [CAT]-[PROD_HASH]-[ESTILO]-[COL]-[TAL]-[SUFIJO_OPT]
 *
 * Ejemplo: PIJ-STLU-DAM-ROJ-XL  (sufijo "-01" solo ante colisión en el lote)
 *
 * Determinista: mismos datos de entrada producen siempre el mismo SKU, así que
 * regenerar la matriz no renumera variantes existentes.
 */

export interface SkuInput {
  categoryName?: string | null;
  productName?: string | null;
  size?: string | null;
  colorName?: string | null;
  styleName?: string | null;
  materialName?: string | null;
}

/** Normaliza: sin tildes, mayúsculas, solo A-Z0-9. */
function normalizeCode(value?: string | null): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .trim();
}

/** CAT: 3 letras de la primera palabra significativa de la categoría. */
export function categoryCode(categoryName?: string | null): string {
  const words = normalizeCode(categoryName).split(" ").filter(Boolean);
  const first = words[0] ?? "";
  return (first.slice(0, 3) || "GEN").padEnd(3, "X");
}

/** PROD_HASH: acrónimo inteligente de 4 letras a partir del slug/nombre. */
export function productCode(productName?: string | null): string {
  const words = normalizeCode(productName).split(" ").filter(Boolean);
  if (words.length === 0) return "PROD";
  if (words.length >= 4) return words.slice(0, 4).map((w) => w[0]).join("");
  if (words.length === 3) return `${words[0][0]}${words[1][0]}${words[2].slice(0, 2)}`;
  if (words.length === 2) return `${words[0].slice(0, 2)}${words[1].slice(0, 2)}`;
  return words[0].slice(0, 4).padEnd(4, "X");
}

/** ESTILO: línea de la prenda. DAM / CAB / INF / UNI. */
export function lineCode(styleName?: string | null): string {
  const text = normalizeCode(styleName);
  if (text.includes("INFANTIL") || text.includes("NINO") || text.includes("BEBE")) return "INF";
  if (text.includes("HOMBRE")) return "CAB";
  if (text.includes("MUJER")) return "DAM";
  return "UNI";
}

/** COL: 2 letras de la 1ª palabra + inicial de la 2ª ("Amarillo Estampado" → AMP). */
export function colorCode(colorName?: string | null): string {
  const words = normalizeCode(colorName).split(" ").filter(Boolean);
  if (words.length === 0) return "VAR";
  if (words.length === 1) return words[0].slice(0, 3).padEnd(3, "X");
  return `${words[0].slice(0, 2)}${words[1][0]}`;
}

/** TAL: talla directa normalizada, sin guiones ni espacios ("0-3M" → "03M"). */
export function sizeCode(size?: string | null): string {
  const code = normalizeCode(size).replace(/\s+/g, "");
  return code || "DEF";
}

/** Construye el SKU base determinista (sin sufijo anticolisión). */
export function buildSku(input: SkuInput): string {
  return [
    categoryCode(input.categoryName),
    productCode(input.productName),
    lineCode(input.styleName),
    colorCode(input.colorName),
    sizeCode(input.size),
  ].join("-");
}

/**
 * Asignador incremental de SKUs anticolisión: la primera ocurrencia de cada
 * combinación queda sin sufijo; los duplicados reciben correlativo de 2
 * dígitos (-01, -02…). Las claves ya presentes en `reservedSkus` (p. ej. SKUs
 * manuales o existentes en BD) también se evitan. El estado interno es O(1)
 * por asignación, así que se puede usar por chunks en lotes de cualquier tamaño.
 */
export function createSkuBatchAllocator(reservedSkus?: ReadonlySet<string>) {
  const used = new Set<string>(reservedSkus ?? []);
  const counters = new Map<string, number>();

  return (item: SkuInput): string => {
    const base = buildSku(item);
    if (!used.has(base)) {
      used.add(base);
      counters.set(base, 0);
      return base;
    }

    let suffix = (counters.get(base) ?? 0) + 1;
    let candidate = `${base}-${String(suffix).padStart(2, "0")}`;
    while (used.has(candidate)) {
      suffix += 1;
      candidate = `${base}-${String(suffix).padStart(2, "0")}`;
    }
    counters.set(base, suffix);
    used.add(candidate);
    return candidate;
  };
}

/** Genera SKUs para un lote completo en O(N) usando el asignador incremental. */
export function generateSkusBatch<T extends SkuInput>(
  items: T[],
  reservedSkus?: ReadonlySet<string>
): string[] {
  const allocate = createSkuBatchAllocator(reservedSkus);
  return items.map((item) => allocate(item));
}

/**
 * Firma legacy conservada para los puntos que generan un SKU suelto (botón
 * "autogenerar" por fila, SKU base del producto). Ahora es determinista.
 */
export function generateUniqueSku(
  size?: string,
  colorName?: string,
  styleName?: string | null,
  materialName?: string | null,
  prefix = "MP"
): string {
  return buildSku({
    categoryName: prefix,
    productName: materialName || styleName || prefix,
    size,
    colorName,
    styleName,
    materialName,
  });
}

/**
 * Procesa una lista en bloques cediendo el hilo principal entre bloques, para
 * que la UI nunca se congele con matrices de cientos de variantes.
 */
export async function processInChunks<T, R>(
  items: T[],
  chunkSize: number,
  fn: (item: T, index: number) => R
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  for (let start = 0; start < items.length; start += chunkSize) {
    const end = Math.min(start + chunkSize, items.length);
    for (let i = start; i < end; i++) {
      results[i] = fn(items[i], i);
    }
    if (end < items.length) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }
  return results;
}

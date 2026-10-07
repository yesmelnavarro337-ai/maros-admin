"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { ProductColor, ProductVariant } from "../types";
import { DEFAULT_VARIANT_STOCK } from "../types";
import { buildSku, createSkuBatchAllocator, processInChunks } from "../utils/sku-generator";
import { getSizeSurcharge } from "../utils/price-calculator";
import { isInfantilStyleName, type SizeLineMode } from "../utils/size-helpers";

export interface SkuContext {
  categoryName?: string;
  productName?: string;
}

function regenerateVariants(
  sizes: string[],
  colors: ProductColor[],
  styles: string[],
  materials: string[],
  existing: ProductVariant[],
  basePrice: number = 0,
  sizeLineMode: SizeLineMode = "adulto",
  skuContext: SkuContext = {}
): ProductVariant[] {
  const styleList = styles.length > 0 ? styles : [undefined];
  const materialList = materials.length > 0 ? materials : [undefined];

  return sizes.flatMap((size) =>
    colors.flatMap((color) =>
      styleList.flatMap((styleName) =>
        materialList.map((materialName) => {
          const found = existing.find(
            (v) =>
              v.size === size &&
              v.colorName === color.name &&
              (v.styleName ?? undefined) === styleName &&
              (v.materialName ?? undefined) === materialName
          );
          const primaryHex = color.primaryHex || color.hex || "#000000";
          const secondaryHex = color.secondaryHex || null;
          const isCombined = Boolean(color.isCombined);
          // Recargo por rango de talla: juvenil infantil (10-16) o talla > L.
          // En modo mixed, el recargo se aplica según el tipo de talla (infantil vs adulto)
          const isInfantilSize = sizeLineMode === "infantil" || sizeLineMode === "mixed"
            ? isInfantilStyleName(styleName)
            : false;
          const surcharge = getSizeSurcharge(size, isInfantilSize);
          const sizedPrice = surcharge > 0 && basePrice > 0 ? basePrice + surcharge : undefined;

          if (found) {
            return {
              ...found,
              colorHex: primaryHex,
              primaryHex,
              secondaryHex,
              isCombined,
              styleName: styleName ?? found.styleName ?? null,
              materialName: materialName ?? found.materialName ?? null,
              price: found.price ?? sizedPrice,
            };
          }

          return {
            id: `${size}-${color.name}-${styleName || "std"}-${materialName || "std"}-${Math.random().toString(36).slice(2, 7)}`,
            size,
            colorName: color.name,
            colorHex: primaryHex,
            styleName: styleName ?? null,
            materialName: materialName ?? null,
            primaryHex,
            secondaryHex,
            isCombined,
            sku: buildSku({
              categoryName: skuContext.categoryName,
              productName: skuContext.productName,
              size,
              colorName: color.name,
              styleName,
              materialName,
            }),
            stock: DEFAULT_VARIANT_STOCK,
            price: sizedPrice,
            image: undefined,
          };
        })
      )
    )
  );
}

export function useVariantMatrix(
  initialSizes: string[],
  initialColors: ProductColor[],
  initialVariants: ProductVariant[],
  initialStyles: string[] = [],
  initialMaterials: string[] = [],
  basePrice: number = 0,
  sizeLineMode: SizeLineMode = "adulto",
  skuContext: SkuContext = {}
) {
  const [sizes, setSizes] = useState<string[]>(initialSizes);
  const [colors, setColors] = useState<ProductColor[]>(() =>
    initialColors.map((c) => ({
      ...c,
      primaryHex: c.primaryHex || c.hex || "#000000",
      secondaryHex: c.secondaryHex || null,
      isCombined: Boolean(c.isCombined),
    }))
  );
  const [styles, setStyles] = useState<string[]>(initialStyles);
  const [materials, setMaterials] = useState<string[]>(initialMaterials);

  /**
   * IDs de variantes cuyo SKU fue editado a mano: una "Regeneración masiva"
   * nunca pisa esos SKUs. Vive en ref para no provocar re-renders.
   */
  const manualSkuIdsRef = useRef<Set<string>>(new Set());
  const skuContextRef = useRef(skuContext);
  const variantsRef = useRef<ProductVariant[]>([]);

  /**
   * Determina si el producto está en modo infantil:
   * - "infantil": siempre true
   * - "adulto": siempre false
   * - "mixed": true si hay estilos infantiles seleccionados, false en caso contrario
   * Esto permite que en modo mixed, si el usuario selecciona un estilo infantil,
   * se apliquen las reglas infantiles a ese estilo.
   */
  const isInfantil =
    sizeLineMode === "infantil" ||
    (sizeLineMode === "mixed" && styles.some((s) => isInfantilStyleName(s)));

  const [variants, setVariants] = useState<ProductVariant[]>(() => {
    const resolvePrice = (price: number | null | undefined, size: string) => {
      if (price != null) return price;
      const isInfantilSize = sizeLineMode === "infantil" || sizeLineMode === "mixed"
        ? isInfantilStyleName(styles[0] ?? "")
        : false;
      const surcharge = getSizeSurcharge(size, isInfantilSize);
      return surcharge > 0 && basePrice > 0 ? basePrice + surcharge : undefined;
    };

    if (initialVariants.length > 0) {
      return initialVariants.map((v) => ({
        ...v,
        primaryHex: v.primaryHex || v.colorHex || "#000000",
        secondaryHex: v.secondaryHex || null,
        isCombined: Boolean(v.isCombined),
        price: resolvePrice(v.price, v.size),
      }));
    }
    return regenerateVariants(
      initialSizes,
      initialColors,
      initialStyles,
      initialMaterials,
      [],
      basePrice,
      sizeLineMode,
      skuContext
    );
  });

  // Espejos mutables del estado: se sincronizan tras cada render y permiten
  // leer el snapshot actual desde callbacks asíncronos sin redeclarar sus
  // dependencias (los refs solo se escriben dentro de effects).
  useEffect(() => {
    skuContextRef.current = skuContext;
    variantsRef.current = variants;
  });

  // Cuando cambia el precio base (o la línea) se reajustan las variantes
  // con recargo por rango de talla, sin pisar precios personalizados a mano.
  useEffect(() => {
    if (basePrice > 0) {
      setVariants((prev) =>
        prev.map((v) => {
          const styleForVariant = v.styleName ?? styles[0] ?? "";
          const isInfantilSize = sizeLineMode === "infantil" || sizeLineMode === "mixed"
            ? isInfantilStyleName(styleForVariant)
            : false;
          const surcharge = getSizeSurcharge(v.size, isInfantilSize);
          if (surcharge > 0) {
            const autoPrice = basePrice + surcharge;
            return {
              ...v,
              price:
                v.price == null || v.price === 0 || v.price === basePrice ? autoPrice : v.price,
            };
          }
          return v;
        })
      );
    }
  }, [basePrice, sizeLineMode, styles, isInfantil]);

  const addSize = useCallback(
    (size: string) => {
      setSizes((prev) => {
        if (prev.includes(size)) return prev;
        const next = [...prev, size];
        setVariants((v) => regenerateVariants(next, colors, styles, materials, v, basePrice, sizeLineMode, skuContextRef.current));
        return next;
      });
    },
    [colors, styles, materials, basePrice, sizeLineMode]
  );

  const removeSize = useCallback(
    (size: string) => {
      setSizes((prev) => {
        const next = prev.filter((s) => s !== size);
        setVariants((v) => regenerateVariants(next, colors, styles, materials, v, basePrice, sizeLineMode, skuContextRef.current));
        return next;
      });
    },
    [colors, styles, materials, basePrice, sizeLineMode]
  );

  /**
   * Reemplaza el listado completo de tallas y regenera la matriz una sola vez.
   * Se usa al cambiar de línea para descartar de golpe las
   * tallas que ya no son válidas, en lugar de encadenar removeSize.
   */
  const replaceSizes = useCallback(
    (next: string[]) => {
      setSizes(() => {
        const deduped = Array.from(new Set(next));
        setVariants((v) => regenerateVariants(deduped, colors, styles, materials, v, basePrice, sizeLineMode, skuContextRef.current));
        return deduped;
      });
    },
    [colors, styles, materials, basePrice, sizeLineMode]
  );

  const addColor = useCallback(
    (color: ProductColor) => {
      setColors((prev) => {
        if (prev.some((c) => c.name === color.name)) return prev;
        const normalizedColor: ProductColor = {
          ...color,
          primaryHex: color.primaryHex || color.hex || "#000000",
          secondaryHex: color.secondaryHex || null,
          isCombined: Boolean(color.isCombined),
        };
        const next = [...prev, normalizedColor];
        setVariants((v) => regenerateVariants(sizes, next, styles, materials, v, basePrice, sizeLineMode, skuContextRef.current));
        return next;
      });
    },
    [sizes, styles, materials, basePrice, sizeLineMode]
  );

  const removeColor = useCallback(
    (colorName: string) => {
      setColors((prev) => {
        const next = prev.filter((c) => c.name !== colorName);
        setVariants((v) => regenerateVariants(sizes, next, styles, materials, v, basePrice, sizeLineMode, skuContextRef.current));
        return next;
      });
    },
    [sizes, styles, materials, basePrice, sizeLineMode]
  );

  const addStyle = useCallback(
    (styleName: string) => {
      setStyles((prev) => {
        if (prev.includes(styleName)) return prev;
        const next = [...prev, styleName];
        setVariants((v) => regenerateVariants(sizes, colors, next, materials, v, basePrice, sizeLineMode, skuContextRef.current));
        return next;
      });
    },
    [sizes, colors, materials, basePrice, sizeLineMode]
  );

  const removeStyle = useCallback(
    (styleName: string) => {
      setStyles((prev) => {
        const next = prev.filter((s) => s !== styleName);
        setVariants((v) => regenerateVariants(sizes, colors, next, materials, v, basePrice, sizeLineMode, skuContextRef.current));
        return next;
      });
    },
    [sizes, colors, materials, basePrice, sizeLineMode]
  );

  const addMaterial = useCallback(
    (materialName: string) => {
      setMaterials((prev) => {
        if (prev.includes(materialName)) return prev;
        const next = [...prev, materialName];
        setVariants((v) => regenerateVariants(sizes, colors, styles, next, v, basePrice, sizeLineMode, skuContextRef.current));
        return next;
      });
    },
    [sizes, colors, styles, basePrice, sizeLineMode]
  );

  const removeMaterial = useCallback(
    (materialName: string) => {
      setMaterials((prev) => {
        const next = prev.filter((m) => m !== materialName);
        setVariants((v) => regenerateVariants(sizes, colors, styles, next, v, basePrice, sizeLineMode, skuContextRef.current));
        return next;
      });
    },
    [sizes, colors, styles, basePrice, sizeLineMode]
  );

  const updateVariant = useCallback(
    (id: string, patch: Partial<ProductVariant>) => {
      // Un SKU tocado a mano queda bloqueado ante regeneraciones masivas.
      if (patch.sku !== undefined) {
        manualSkuIdsRef.current.add(id);
      }
      setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
    },
    []
  );

  /**
   * Aplica stock a todas las variantes o solo a las indicadas (acciones masivas del admin).
   * Sin `variantIds` el alcance es la matriz completa.
   */
  const bulkUpdateStock = useCallback((stock: number, variantIds?: string[]) => {
    const safeStock = Number.isFinite(stock) && stock >= 0 ? Math.trunc(stock) : 0;
    setVariants((prev) =>
      prev.map((v) =>
        !variantIds || variantIds.includes(v.id) ? { ...v, stock: safeStock } : v
      )
    );
  }, []);

  /** Marca como disponibles (o no) todas las variantes o solo las indicadas. */
  const bulkUpdateAvailability = useCallback((isAvailable: boolean, variantIds?: string[]) => {
    setVariants((prev) =>
      prev.map((v) =>
        !variantIds || variantIds.includes(v.id) ? { ...v, isAvailable } : v
      )
    );
  }, []);

  /**
   * Regeneración masiva de SKUs: respeta los editados a mano y procesa el
   * lote en bloques asíncronos (chunking con cese del hilo principal) para no
   * congelar la UI con matrices de +600 variantes.
   */
  const regenerateAllSkus = useCallback(async () => {
    const snapshot = variantsRef.current;

    // Los SKUs manuales se reservan para que el lote no colisione con ellos.
    const reserved = new Set(
      snapshot.filter((v) => manualSkuIdsRef.current.has(v.id)).map((v) => v.sku)
    );
    const regenerable = snapshot.filter((v) => !manualSkuIdsRef.current.has(v.id));
    const allocate = createSkuBatchAllocator(reserved);

    const skus = await processInChunks(regenerable, 200, (v) =>
      allocate({
        categoryName: skuContextRef.current.categoryName,
        productName: skuContextRef.current.productName,
        size: v.size,
        colorName: v.colorName,
        styleName: v.styleName,
        materialName: v.materialName,
      })
    );

    const skuById = new Map(regenerable.map((v, i) => [v.id, skus[i]]));
    setVariants((prev) =>
      prev.map((v) => (skuById.has(v.id) ? { ...v, sku: skuById.get(v.id)! } : v))
    );
  }, []);

  const generateSkuForVariant = useCallback((id: string) => {
    setVariants((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              sku: buildSku({
                categoryName: skuContextRef.current.categoryName,
                productName: skuContextRef.current.productName,
                size: v.size,
                colorName: v.colorName,
                styleName: v.styleName,
                materialName: v.materialName,
              }),
            }
          : v
      )
    );
  }, []);

  return {
    sizes,
    colors,
    styles,
    materials,
    variants,
    isInfantil,
    addSize,
    removeSize,
    replaceSizes,
    addColor,
    removeColor,
    addStyle,
    removeStyle,
    addMaterial,
    removeMaterial,
    updateVariant,
    bulkUpdateStock,
    bulkUpdateAvailability,
    regenerateAllSkus,
    generateSkuForVariant,
  };
}
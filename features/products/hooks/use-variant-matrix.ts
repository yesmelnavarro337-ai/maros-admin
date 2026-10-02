"use client";

import { useState, useCallback } from "react";
import type { ProductColor, ProductVariant } from "../types";
import { generateUniqueSku } from "../utils/sku-generator";

function regenerateVariants(
  sizes: string[],
  colors: ProductColor[],
  existing: ProductVariant[]
): ProductVariant[] {
  return sizes.flatMap((size) =>
    colors.map((color) => {
      const found = existing.find(
        (v) => v.size === size && v.colorName === color.name
      );
      const primaryHex = color.primaryHex || color.hex || "#000000";
      const secondaryHex = color.secondaryHex || null;
      const isCombined = Boolean(color.isCombined);

      return (
        found
          ? {
              ...found,
              colorHex: primaryHex,
              primaryHex,
              secondaryHex,
              isCombined,
            }
          : {
              id: `${size}-${color.name}-${Math.random().toString(36).slice(2, 7)}`,
              size,
              colorName: color.name,
              colorHex: primaryHex,
              primaryHex,
              secondaryHex,
              isCombined,
              sku: generateUniqueSku(size, color.name),
              stock: 0,
              price: undefined,
              image: undefined,
            }
      );
    })
  );
}

export function useVariantMatrix(
  initialSizes: string[],
  initialColors: ProductColor[],
  initialVariants: ProductVariant[]
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
  const [variants, setVariants] = useState<ProductVariant[]>(() =>
    initialVariants.map((v) => ({
      ...v,
      primaryHex: v.primaryHex || v.colorHex || "#000000",
      secondaryHex: v.secondaryHex || null,
      isCombined: Boolean(v.isCombined),
    }))
  );

  const addSize = useCallback(
    (size: string) => {
      setSizes((prev) => {
        if (prev.includes(size)) return prev;
        const next = [...prev, size];
        setVariants((v) => regenerateVariants(next, colors, v));
        return next;
      });
    },
    [colors]
  );

  const removeSize = useCallback(
    (size: string) => {
      setSizes((prev) => {
        const next = prev.filter((s) => s !== size);
        setVariants((v) => regenerateVariants(next, colors, v));
        return next;
      });
    },
    [colors]
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
        setVariants((v) => regenerateVariants(sizes, next, v));
        return next;
      });
    },
    [sizes]
  );

  const removeColor = useCallback(
    (colorName: string) => {
      setColors((prev) => {
        const next = prev.filter((c) => c.name !== colorName);
        setVariants((v) => regenerateVariants(sizes, next, v));
        return next;
      });
    },
    [sizes]
  );

  const updateVariant = useCallback(
    (id: string, patch: Partial<ProductVariant>) => {
      setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
    },
    []
  );

  const regenerateAllSkus = useCallback(() => {
    setVariants((prev) =>
      prev.map((v) => ({
        ...v,
        sku: generateUniqueSku(v.size, v.colorName),
      }))
    );
  }, []);

  const generateSkuForVariant = useCallback((id: string) => {
    setVariants((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, sku: generateUniqueSku(v.size, v.colorName) } : v
      )
    );
  }, []);

  return {
    sizes,
    colors,
    variants,
    addSize,
    removeSize,
    addColor,
    removeColor,
    updateVariant,
    regenerateAllSkus,
    generateSkuForVariant,
  };
}

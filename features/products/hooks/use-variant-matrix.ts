"use client";

import { useState, useCallback } from "react";
import type { ProductColor, ProductVariant } from "../types";

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
      return (
        found ?? {
          id: `${size}-${color.name}-${Math.random().toString(36).slice(2, 7)}`,
          size,
          colorName: color.name,
          colorHex: color.hex,
          sku: `SKU-${size}-${color.name.slice(0, 3).toUpperCase()}`,
          stock: 0,
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
  const [colors, setColors] = useState<ProductColor[]>(initialColors);
  const [variants, setVariants] = useState<ProductVariant[]>(initialVariants);

  const addSize = useCallback((size: string) => {
    setSizes((prev) => {
      if (prev.includes(size)) return prev;
      const next = [...prev, size];
      setVariants((v) => regenerateVariants(next, colors, v));
      return next;
    });
  }, [colors]);

  const removeSize = useCallback((size: string) => {
    setSizes((prev) => {
      const next = prev.filter((s) => s !== size);
      setVariants((v) => regenerateVariants(next, colors, v));
      return next;
    });
  }, [colors]);

  const addColor = useCallback((color: ProductColor) => {
    setColors((prev) => {
      if (prev.some((c) => c.name === color.name)) return prev;
      const next = [...prev, color];
      setVariants((v) => regenerateVariants(sizes, next, v));
      return next;
    });
  }, [sizes]);

  const removeColor = useCallback((colorName: string) => {
    setColors((prev) => {
      const next = prev.filter((c) => c.name !== colorName);
      setVariants((v) => regenerateVariants(sizes, next, v));
      return next;
    });
  }, [sizes]);

  const updateVariant = useCallback(
    (id: string, patch: Partial<ProductVariant>) => {
      setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
    },
    []
  );

  return { sizes, colors, variants, addSize, removeSize, addColor, removeColor, updateVariant };
}
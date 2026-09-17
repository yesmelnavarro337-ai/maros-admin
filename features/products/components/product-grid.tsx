"use client";

import { ProductCard } from "./product-card";
import type { Product } from "../types";

interface ProductGridProps {
  products: Product[];
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
  onQuickView: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductGrid({
  products,
  selectedIds = [],
  onToggleSelect,
  onQuickView,
  onDelete,
}: ProductGridProps) {
  const selectedSet = new Set(selectedIds);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          isSelected={selectedSet.has(p.id)}
          onToggleSelect={() => onToggleSelect?.(p.id)}
          onQuickView={() => onQuickView(p)}
          onDelete={() => onDelete(p)}
        />
      ))}
    </div>
  );
}
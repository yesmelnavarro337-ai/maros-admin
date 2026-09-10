"use client";

import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { getProducts } from "@/features/products/services/products.service";
import type { Product } from "@/features/products/types";

interface ProductPickerProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  filterIds?: string[];
}

export function ProductPicker({ selectedIds, onChange, filterIds }: ProductPickerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(filterIds ? data.filter((p) => filterIds.includes(p.id)) : data);
      setLoading(false);
    });
  }, [filterIds]);

  const toggle = (id: string) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
  };

  if (loading) return <p className="text-sm text-muted-foreground">Cargando productos...</p>;

  if (products.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay productos disponibles{filterIds ? " en la colección seleccionada" : ""}.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1 max-h-80 overflow-y-auto border border-border rounded-md p-2">
      {products.map((product) => (
        <label
          key={product.id}
          className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-secondary cursor-pointer"
        >
          <Checkbox
            checked={selectedIds.includes(product.id)}
            onCheckedChange={() => toggle(product.id)}
          />
          <div className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center shrink-0">
            {product.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.images[0]} alt="" className="w-full h-full object-cover rounded-md" />
            ) : (
              <ImageOff className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </div>
          <span className="text-sm text-foreground truncate">{product.name}</span>
        </label>
      ))}
    </div>
  );
}
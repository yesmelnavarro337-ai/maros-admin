"use client";

import { ImageOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ProductColor, ProductVariant } from "../types";
import { uploadImage } from "@/lib/api/media.service";
import { toast } from "@/lib/toast";

interface VariantMatrixProps {
  sizes: string[];
  colors: ProductColor[];
  variants: ProductVariant[];
  onUpdateVariant: (id: string, patch: Partial<Pick<ProductVariant, "stock" | "sku" | "image">>) => void;
}

export function VariantMatrix({ sizes, colors, variants, onUpdateVariant }: VariantMatrixProps) {
  if (sizes.length === 0 || colors.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Agrega al menos una talla y un color para generar la matriz de variantes.
      </p>
    );
  }

  const findVariant = (size: string, colorName: string) =>
    variants.find((v) => v.size === size && v.colorName === colorName);

async function handleImageUpload(variantId: string, file: File) {
  try {
    const result = await uploadImage(file, "products/variants");
    onUpdateVariant(variantId, { image: result.url });
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "No se pudo subir la imagen.");
  }
}

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left text-sm text-muted-foreground pb-2 pr-4">Talla \ Color</th>
            {colors.map((color) => (
              <th key={color.name} className="text-sm text-muted-foreground pb-2 px-2">
                <div className="flex items-center gap-1.5 justify-center">
                  <span
                    className="h-3 w-3 rounded-full border border-border"
                    style={{ backgroundColor: color.hex }}
                  />
                  {color.name}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sizes.map((size) => (
            <tr key={size} className="border-t border-border">
              <td className="py-3 pr-4 text-sm font-medium text-foreground">{size}</td>
              {colors.map((color) => {
                const variant = findVariant(size, color.name);
                if (!variant) return <td key={color.name} />;
                return (
                  <td key={color.name} className="py-3 px-2">
                    <div className="flex flex-col items-center gap-1.5">
                      <label className="relative h-12 w-12 rounded-md border border-dashed border-border flex items-center justify-center cursor-pointer overflow-hidden hover:border-primary transition-colors">
                        {variant.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={variant.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ImageOff className="h-4 w-4 text-muted-foreground" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(variant.id, file);
                          }}
                        />
                      </label>
                      <Input
                        type="number"
                        min={0}
                        value={variant.stock}
                        onChange={(e) =>
                          onUpdateVariant(variant.id, { stock: Number(e.target.value) })
                        }
                        className="w-16 h-8 text-center text-sm"
                      />
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
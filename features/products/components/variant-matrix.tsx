"use client";

import { ImageOff, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProductColor, ProductVariant } from "../types";
import { DEFAULT_VARIANT_STOCK } from "../types";
import { uploadImage } from "@/lib/api/media.service";
import { toast } from "@/lib/toast";
import { getColorPreviewStyle } from "../utils/color-helper";

interface VariantMatrixProps {
  sizes: string[];
  colors: ProductColor[];
  variants: ProductVariant[];
  onUpdateVariant: (id: string, patch: Partial<Pick<ProductVariant, "stock" | "sku" | "price" | "image">>) => void;
  onBulkUpdateStock?: (stock: number, variantIds?: string[]) => void;
}

export function VariantMatrix({
  sizes,
  colors,
  variants,
  onUpdateVariant,
  onBulkUpdateStock,
}: VariantMatrixProps) {
  if (sizes.length === 0 || colors.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Agrega al menos una talla y un color para generar la matriz de variantes.
      </p>
    );
  }

  const findVariant = (size: string, colorName: string) =>
    variants.find((v) => v.size === size && v.colorName === colorName);

  const gridVariants = sizes.flatMap((size) =>
    colors
      .map((color) => findVariant(size, color.name))
      .filter((v): v is ProductVariant => Boolean(v))
  );

  function handleBulkStock() {
    onBulkUpdateStock?.(DEFAULT_VARIANT_STOCK, gridVariants.map((v) => v.id));
    toast.success(`Stock de ${DEFAULT_VARIANT_STOCK} unidades aplicado a las variantes de la matriz.`);
  }

  async function handleImageUpload(variantId: string, file: File) {
    try {
      const result = await uploadImage(file, "products/variants");
      onUpdateVariant(variantId, { image: result.url });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo subir la imagen.");
    }
  }

  return (
    <div className="space-y-3">
      {onBulkUpdateStock && (
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBulkStock}
            className="border-[#EBE9DF] text-[#555829] hover:bg-[#FAF9F5] text-xs h-8 px-2.5 gap-1.5 font-medium"
          >
            <PackageCheck className="h-3.5 w-3.5 text-[#555829]" />
            Stock masivo ({DEFAULT_VARIANT_STOCK})
          </Button>
        </div>
      )}
      <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left text-sm text-muted-foreground pb-2 pr-4">Talla \ Color</th>
            {colors.map((color) => (
              <th key={color.name} className="text-sm text-muted-foreground pb-2 px-2">
                <div className="flex items-center gap-1.5 justify-center">
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-border shrink-0 shadow-2xs"
                    style={getColorPreviewStyle(color)}
                  />
                  <span>{color.name}</span>
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
    </div>
  );
}

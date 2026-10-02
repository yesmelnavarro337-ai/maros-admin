import { z } from "zod";

export const productColorSchema = z.object({
  name: z.string().min(1, "El nombre del color es requerido"),
  primaryHex: z.string().min(1, "El color principal es requerido"),
  secondaryHex: z.string().optional().nullable(),
  isCombined: z.boolean().default(false),
  hex: z.string().optional(),
});

export const productVariantSchema = z.object({
  id: z.string().optional().nullable(),
  size: z.string().min(1, "La talla es requerida"),
  colorName: z.string().min(1, "El color es requerido"),
  colorHex: z.string().optional().nullable(),
  primaryHex: z.string().min(1, "El color principal es requerido").optional(),
  secondaryHex: z.string().optional().nullable(),
  isCombined: z.boolean().optional().default(false),
  sku: z.string().min(1, "El SKU es requerido"),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo"),
  price: z.coerce.number().positive("El precio de variante debe ser mayor a 0").optional().nullable(),
  image: z.string().optional().nullable(),
});

const categoryPriceSchema = z.object({
  categoryId: z.string(),
  price: z.coerce.number().positive("El precio debe ser mayor a 0").optional().nullable(),
  surchargeReason: z.string().optional().nullable(),
});

export const productSchema = z
  .object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    categoryIds: z.array(z.string()).min(1, "Selecciona al menos una categoría"),
    categoryPrices: z.array(categoryPriceSchema).optional(),
    description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
    basePrice: z.coerce.number().positive("El precio base debe ser mayor a 0"),
    status: z.enum(["activo", "borrador", "archivado"]),
    variants: z.array(productVariantSchema).optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().max(500, "La descripción SEO no puede superar los 500 caracteres").optional(),
  });

// Tipo de ENTRADA: lo que el usuario escribe en el input
export type ProductFormInput = z.input<typeof productSchema>;

// Tipo de SALIDA: lo que Zod produce después de validar/coercionar
export type ProductFormValues = z.output<typeof productSchema>;

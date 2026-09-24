import { z } from "zod";

const productVariantSchema = z.object({
  size: z.string().min(1, "La talla es requerida"),
  colorName: z.string().min(1, "El color es requerido"),
  colorHex: z.string().min(1, "El color es requerido"),
  sku: z.string().min(1, "El SKU es requerido"),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo"),
  price: z.coerce.number().positive("El precio de variante debe ser mayor a 0").optional().nullable(),
  image: z.string().optional().nullable(),
});

export const productSchema = z
  .object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    categoryIds: z.array(z.string()).min(1, "Selecciona al menos una categoría"),
    description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
    basePrice: z.coerce.number(),
    status: z.enum(["activo", "borrador", "archivado"]),
    variants: z.array(productVariantSchema).optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.categoryIds.length > 0 && (!data.basePrice || data.basePrice <= 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["basePrice"],
        message: "El precio debe ser mayor a 0 tras seleccionar una categoría",
      });
    }
  });

// Tipo de ENTRADA: lo que el usuario escribe en el input
export type ProductFormInput = z.input<typeof productSchema>;

// Tipo de SALIDA: lo que Zod produce después de validar/coercionar
export type ProductFormValues = z.output<typeof productSchema>;

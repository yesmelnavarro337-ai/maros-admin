import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  categoryId: z.string().min(1, "Selecciona una categoría"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  basePrice: z.coerce.number().positive("El precio debe ser mayor a 0"),
  status: z.enum(["activo", "borrador", "archivado"]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

// Tipo de ENTRADA: lo que el usuario escribe en el input (basePrice llega como string)
export type ProductFormInput = z.input<typeof productSchema>;

// Tipo de SALIDA: lo que Zod produce después de validar/coercionar (basePrice ya es number)
export type ProductFormValues = z.output<typeof productSchema>;
import { z } from "zod";

export const seasonSchema = z
  .object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),

    collectionId: z.string().min(1, "Selecciona una colección"),

    startDate: z.string().min(1, "Selecciona la fecha de inicio"),

    endDate: z.string().min(1, "Selecciona la fecha de fin"),

    heroTitle: z.string().min(3, "El título es obligatorio"),

    heroSubtitle: z.string().min(3, "El subtítulo es obligatorio"),

    ctaText: z.string().min(1, "El texto del botón es obligatorio"),

    ctaLink: z.string().min(1, "El enlace del botón es obligatorio"),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "La fecha de fin debe ser posterior a la de inicio",
    path: ["endDate"],
  });

export type SeasonFormValues = z.infer<typeof seasonSchema>;
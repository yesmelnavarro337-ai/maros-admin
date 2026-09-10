import type { AppearanceSettings } from "../types";

export const mockAppearanceSettings: AppearanceSettings = {
  sections: [
    { id: "hero", label: "Hero principal", enabled: true, order: 1 },
    { id: "active-season", label: "Colección / Temporada activa", enabled: true, order: 2 },
    { id: "featured-products", label: "Productos destacados", enabled: true, order: 3 },
    { id: "testimonials", label: "Testimonios", enabled: true, order: 4 },
    { id: "blog", label: "Últimos artículos del blog", enabled: false, order: 5 },
    { id: "newsletter", label: "Suscripción por correo", enabled: false, order: 6 },
  ],
};
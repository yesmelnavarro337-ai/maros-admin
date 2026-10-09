export const PAGE_KEYS = ["collections", "blog", "gallery", "about", "historia"] as const;

export type PageKey = (typeof PAGE_KEYS)[number];

export const PAGE_LABELS: Record<PageKey, string> = {
  collections: "Colecciones",
  blog: "Blog",
  gallery: "Galería",
  about: "Nosotros",
  historia: "Historia (Nosotros)",
};

export const DEFAULT_TEXT_COLOR = "#F9F6F0";
export const DEFAULT_OVERLAY_OPACITY = 40;

const DEFAULT_CONTENT: Record<PageKey, { title: string; subtitle: string }> = {
  collections: {
    title: "Nuestras Colecciones",
    subtitle: "Ediciones especiales diseñadas con amor y confort para cada temporada.",
  },
  blog: {
    title: "Blog",
    subtitle: "Consejos, inspiración y todo sobre pijamas personalizadas.",
  },
  gallery: {
    title: "Galería",
    subtitle: "Momentos especiales con Maro's Pijamas.",
  },
  about: {
    title: "Más de 6 años creando pijamas únicas",
    subtitle:
      "Maro's Pijamas nació con un sueño simple: crear prendas únicas, cómodas y hechas con amor para los momentos más especiales de tu vida.",
  },
  historia: {
    title: "Un sueño hecho a mano",
    subtitle: "De un sueño familiar, a una gran comunidad.",
  },
};

export interface HeaderMedia {
  url: string;
  mediaType: "image" | "video";
  order: number;
}

export interface PageHeaderData {
  pageKey: PageKey;
  title: string;
  subtitle: string;
  backgroundImage?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  textColor: string;
  overlayOpacity: number;
  media: HeaderMedia[];
}

export function defaultPageHeader(pageKey: PageKey): PageHeaderData {
  return {
    pageKey,
    title: DEFAULT_CONTENT[pageKey].title,
    subtitle: DEFAULT_CONTENT[pageKey].subtitle,
    textColor: DEFAULT_TEXT_COLOR,
    overlayOpacity: DEFAULT_OVERLAY_OPACITY,
    media: [],
  };
}
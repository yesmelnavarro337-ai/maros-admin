export const HOME_SECTION_KEYS = [
  "personalize",
  "featured-collection",
  "brand-promise",
] as const;

export type HomeSectionKey = (typeof HOME_SECTION_KEYS)[number];

export const HOME_SECTION_LABELS: Record<HomeSectionKey, string> = {
  personalize: "Personaliza tu pijama",
  "featured-collection": "Colección destacada",
  "brand-promise": "Nuestra promesa",
};

export const HOME_SECTION_DESCRIPTIONS: Record<HomeSectionKey, string> = {
  personalize:
    "Sección con la imagen del proceso de diseño y los 4 pasos del personalizador.",
  "featured-collection":
    "Textos e imágenes de la campaña. Los productos vienen de la colección activa; lo que dejes vacío usa el texto actual de la tienda.",
  "brand-promise":
    "Bloque editorial con foto, textos y las etiquetas de valores de marca.",
};

export const TAG_ICON_OPTIONS = [
  { value: "tag", label: "Etiqueta" },
  { value: "scissors", label: "Tijeras" },
  { value: "gem", label: "Gema" },
  { value: "shield-check", label: "Escudo" },
  { value: "package-check", label: "Paquete" },
] as const;

export interface HomeSectionImageDraft {
  url: string;
  alt: string;
}

export interface HomeSectionTagDraft {
  label: string;
  icon: string;
}

export interface HomeSectionDraft {
  enabled: boolean;
  sectionTitle: string;
  sectionSubtitle: string;
  eyebrow: string;
  bodyText: string;
  ctaText: string;
  ctaLink: string;
  mainImageUrl: string;
  mainImageAlt: string;
  secondaryImages: HomeSectionImageDraft[];
  tags: HomeSectionTagDraft[];
}

/** Si la fila aún no existe en el backend, el admin igual puede editarla y crearla. */
export function emptyHomeSectionDraft(): HomeSectionDraft {
  return {
    enabled: true,
    sectionTitle: "",
    sectionSubtitle: "",
    eyebrow: "",
    bodyText: "",
    ctaText: "",
    ctaLink: "",
    mainImageUrl: "",
    mainImageAlt: "",
    secondaryImages: [],
    tags: [],
  };
}

export function defaultHomeSectionDrafts(): Record<HomeSectionKey, HomeSectionDraft> {
  const drafts = {} as Record<HomeSectionKey, HomeSectionDraft>;

  for (const key of HOME_SECTION_KEYS) {
    drafts[key] = emptyHomeSectionDraft();
  }

  drafts.personalize.ctaText = "Diseñar mi pijama";
  drafts.personalize.ctaLink = "/personaliza";

  drafts["featured-collection"].eyebrow = "CAMPAÑA DESTACADA";
  drafts["featured-collection"].ctaText = "Ver colección";

  drafts["brand-promise"].eyebrow = "NUESTRA PROMESA";
  drafts["brand-promise"].tags = [
    { label: "Telas premium", icon: "tag" },
    { label: "Hecho a mano", icon: "scissors" },
    { label: "Diseños únicos", icon: "gem" },
    { label: "Calidad garantizada", icon: "shield-check" },
    { label: "Pago al recibir", icon: "package-check" },
  ];

  return drafts;
}
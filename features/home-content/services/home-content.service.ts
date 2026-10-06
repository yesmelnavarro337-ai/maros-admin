import { apiFetch } from "@/lib/api/client-fetcher";
import {
  defaultHomeSectionDrafts,
  HOME_SECTION_KEYS,
  type HomeSectionDraft,
  type HomeSectionKey,
} from "../types";

interface ApiHomeSectionImage {
  /** Nullable por la misma razón que `ApiHomeSectionTag.label`. */
  url?: string | null;
  alt?: string | null;
}

interface ApiHomeSectionTag {
  /**
   * Nullable aunque el backend lo declare [Required]: el dato viene de JSON
   * persistido y puede traer null si la fila se escribió antes de esa validación.
   */
  label?: string | null;
  icon?: string | null;
}

interface ApiHomeSectionContent {
  sectionKey: string;
  enabled: boolean;
  sectionTitle?: string | null;
  sectionSubtitle?: string | null;
  eyebrow?: string | null;
  bodyText?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  mainImageUrl?: string | null;
  mainImageAlt?: string | null;
  cardImageUrl?: string | null;
  secondaryImages?: ApiHomeSectionImage[] | null;
  tags?: ApiHomeSectionTag[] | null;
}

function adaptSection(raw: ApiHomeSectionContent): HomeSectionDraft {
  return {
    enabled: raw.enabled,
    sectionTitle: raw.sectionTitle ?? "",
    sectionSubtitle: raw.sectionSubtitle ?? "",
    eyebrow: raw.eyebrow ?? "",
    bodyText: raw.bodyText ?? "",
    ctaText: raw.ctaText ?? "",
    ctaLink: raw.ctaLink ?? "",
    mainImageUrl: raw.mainImageUrl ?? "",
    mainImageAlt: raw.mainImageAlt ?? "",
    cardImageUrl: raw.cardImageUrl ?? "",
    secondaryImages: (raw.secondaryImages ?? []).map((img) => ({
      url: img.url ?? "",
      alt: img.alt ?? "",
    })),
    tags: (raw.tags ?? []).map((tag) => ({
      label: tag.label ?? "",
      // Radix Select rechaza value="" igual que null, así que un icono vacío
      // también cae a la opción por defecto.
      icon: tag.icon?.trim() || "tag",
    })),
  };
}

/**
 * Devuelve un draft por cada sección conocida. Las secciones sin fila en el
 * backend se completan con defaults para que siempre haya algo editable en pantalla.
 */
export async function getHomeSectionContent(): Promise<Record<HomeSectionKey, HomeSectionDraft>> {
  const sections = await apiFetch<ApiHomeSectionContent[]>("home-content");

  const drafts = defaultHomeSectionDrafts();
  for (const raw of sections) {
    const key = raw.sectionKey as HomeSectionKey;
    if (HOME_SECTION_KEYS.includes(key)) {
      drafts[key] = adaptSection(raw);
    }
  }
  return drafts;
}

/** PUT con reemplazo completo: el backend valida la SectionKey y hace upsert. */
export async function updateHomeSectionContent(
  sectionKey: HomeSectionKey,
  draft: HomeSectionDraft
): Promise<HomeSectionDraft> {
  const updated = await apiFetch<ApiHomeSectionContent>(
    `home-content/${sectionKey}`,
    {
      method: "PUT",
      body: {
        enabled: draft.enabled,
        sectionTitle: draft.sectionTitle || null,
        sectionSubtitle: draft.sectionSubtitle || null,
        eyebrow: draft.eyebrow || null,
        bodyText: draft.bodyText || null,
        ctaText: draft.ctaText || null,
        ctaLink: draft.ctaLink || null,
        mainImageUrl: draft.mainImageUrl || null,
        mainImageAlt: draft.mainImageAlt || null,
        cardImageUrl: draft.cardImageUrl || null,
        secondaryImages: draft.secondaryImages
          .filter((img) => img.url.trim())
          .map((img) => ({ url: img.url.trim(), alt: img.alt.trim() || null })),
        tags: draft.tags
          .filter((tag) => tag.label.trim())
          .map((tag) => ({ label: tag.label.trim(), icon: tag.icon || null })),
      },
    }
  );

  return adaptSection(updated);
}
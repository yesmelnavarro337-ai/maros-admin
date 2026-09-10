import { apiFetch } from "@/lib/api/client-fetcher";
import type { Season, SeasonStatus, SeasonColors } from "../types";

interface ApiSeason {
  id: string;
  name: string;
  slug: string;
  startDate: string;
  endDate: string;
  status: string;
  collectionId: string;
  collectionName: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl?: string | null;
  bannerImageUrl?: string | null;
  colors: { primary: string; accent: string; background: string };
  ctaText: string;
  ctaLink: string;
  featuredProductIds: string[];
}

function statusFromApi(status: string): SeasonStatus {
  return (
    { Borrador: "borrador", Programada: "programada", Activa: "activa", Finalizada: "finalizada" }[status] as SeasonStatus
  ) ?? "borrador";
}

function toDateInputValue(iso: string): string {
  return iso.slice(0, 10); // "2026-12-01T00:00:00" -> "2026-12-01"
}

function adaptSeason(s: ApiSeason): Season {
  return {
    id: s.id,
    name: s.name,
    slug: s.slug,
    startDate: toDateInputValue(s.startDate),
    endDate: toDateInputValue(s.endDate),
    status: statusFromApi(s.status),
    collectionId: s.collectionId,
    collectionName: s.collectionName,
    heroTitle: s.heroTitle,
    heroSubtitle: s.heroSubtitle,
    heroImage: s.heroImageUrl ?? undefined,
    bannerImage: s.bannerImageUrl ?? undefined,
    colors: s.colors,
    ctaText: s.ctaText,
    ctaLink: s.ctaLink,
    featuredProductIds: s.featuredProductIds,
  };
}

interface SeasonPayload {
  name: string;
  collectionId: string;
  startDate: string;
  endDate: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
  bannerImage?: string;
  colors: SeasonColors;
  ctaText: string;
  ctaLink: string;
  featuredProductIds: string[];
}

function buildApiPayload(data: SeasonPayload) {
  return {
    name: data.name,
    collectionId: data.collectionId,
    startDate: data.startDate,
    endDate: data.endDate,
    heroTitle: data.heroTitle,
    heroSubtitle: data.heroSubtitle,
    heroImageUrl: data.heroImage ?? null,
    bannerImageUrl: data.bannerImage ?? null,
    colors: data.colors,
    ctaText: data.ctaText,
    ctaLink: data.ctaLink,
    featuredProductIds: data.featuredProductIds,
  };
}

export async function getSeasons(): Promise<Season[]> {
  const seasons = await apiFetch<ApiSeason[]>("Seasons");
  return seasons.map(adaptSeason);
}

export async function getSeasonById(id: string): Promise<Season | undefined> {
  try {
    const season = await apiFetch<ApiSeason>(`Seasons/${id}`);
    return adaptSeason(season);
  } catch {
    return undefined;
  }
}

export async function createSeason(data: SeasonPayload): Promise<Season> {
  const created = await apiFetch<ApiSeason>("Seasons", {
    method: "POST",
    body: buildApiPayload(data),
  });
  return adaptSeason(created);
}

// Actualización PARCIAL desde la UI (ej. SeasonRow solo edita hero/banner/color).
// El backend exige el objeto completo, así que se trae el estado actual y se
// hace merge antes de enviar — mismo patrón que Collections.
export async function updateSeason(id: string, data: Partial<SeasonPayload>): Promise<Season | undefined> {
  const current = await getSeasonById(id);
  if (!current) return undefined;

  const merged: SeasonPayload = {
    name: data.name ?? current.name,
    collectionId: data.collectionId ?? current.collectionId,
    startDate: data.startDate ?? current.startDate,
    endDate: data.endDate ?? current.endDate,
    heroTitle: data.heroTitle ?? current.heroTitle,
    heroSubtitle: data.heroSubtitle ?? current.heroSubtitle,
    heroImage: data.heroImage !== undefined ? data.heroImage : current.heroImage,
    bannerImage: data.bannerImage !== undefined ? data.bannerImage : current.bannerImage,
    colors: data.colors ?? current.colors,
    ctaText: data.ctaText ?? current.ctaText,
    ctaLink: data.ctaLink ?? current.ctaLink,
    featuredProductIds: data.featuredProductIds ?? current.featuredProductIds,
  };

  const updated = await apiFetch<ApiSeason>(`Seasons/${id}`, {
    method: "PUT",
    body: buildApiPayload(merged),
  });
  return adaptSeason(updated);
}

export async function deleteSeason(id: string): Promise<void> {
  await apiFetch<void>(`Seasons/${id}`, { method: "DELETE" });
}

// Regla exclusiva: el backend desactiva automáticamente cualquier otra
// temporada "Activa" al activar esta. Devuelve la lista completa actualizada
// para que la UI refresque todos los estados de golpe (igual que el mock).
export async function activateSeason(id: string): Promise<Season[]> {
  await apiFetch<ApiSeason>(`Seasons/${id}/activate`, { method: "POST" });
  return getSeasons();
}
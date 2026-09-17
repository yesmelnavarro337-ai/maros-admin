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
  isActive?: boolean;
  coverImageUrl?: string | null;
  productsCount?: number;
}

function statusFromApi(status: string): SeasonStatus {
  if (!status) return "borrador";
  const s = status.toLowerCase();
  if (s === "activa") return "activa";
  if (s === "programada") return "programada";
  if (s === "finalizada") return "finalizada";
  return "borrador";
}

function statusToApi(status: SeasonStatus): string {
  if (status === "activa") return "Activa";
  if (status === "programada") return "Programada";
  if (status === "finalizada") return "Finalizada";
  return "Borrador";
}

function toDateInputValue(iso?: string): string {
  if (!iso) return new Date().toISOString().slice(0, 10);
  return iso.slice(0, 10);
}

function adaptSeason(s: ApiSeason): Season {
  const status = statusFromApi(s.status);
  const coverImage = s.bannerImageUrl ?? s.heroImageUrl ?? undefined;
  return {
    id: s.id,
    name: s.name ?? "",
    slug: s.slug ?? "",
    startDate: toDateInputValue(s.startDate),
    endDate: toDateInputValue(s.endDate),
    status,
    collectionId: s.collectionId ?? "",
    collectionName: s.collectionName ?? "Sin colección",
    heroTitle: s.heroTitle ?? "",
    heroSubtitle: s.heroSubtitle ?? "",
    heroImage: s.heroImageUrl ?? undefined,
    bannerImage: s.bannerImageUrl ?? undefined,
    coverImageUrl: s.coverImageUrl ?? coverImage,
    colors: s.colors ?? { primary: "#555A2B", accent: "#E6DBB8", background: "#FAF9F5" },
    ctaText: s.ctaText ?? "",
    ctaLink: s.ctaLink ?? "",
    featuredProductIds: (s.featuredProductIds ?? []).filter((pid): pid is string => Boolean(pid)),
    isActive: s.isActive ?? (status === "activa"),
    productsCount: s.productsCount ?? (s.featuredProductIds ? s.featuredProductIds.length : 0),
    isVisibleStore: true,
    isFeaturedHome: true,
    allowCustomization: false,
  };
}

export interface SeasonPayload {
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
  status?: SeasonStatus;
  isVisibleStore?: boolean;
  isFeaturedHome?: boolean;
  allowCustomization?: boolean;
}

function buildApiPayload(data: SeasonPayload) {
  return {
    name: data.name ?? "",
    collectionId: data.collectionId,
    startDate: data.startDate,
    endDate: data.endDate,
    heroTitle: data.heroTitle ?? "",
    heroSubtitle: data.heroSubtitle ?? "",
    heroImageUrl: data.heroImage ?? null,
    bannerImageUrl: data.bannerImage ?? null,
    colors: data.colors ?? { primary: "#555A2B", accent: "#E6DBB8", background: "#FAF9F5" },
    ctaText: data.ctaText ?? "",
    ctaLink: data.ctaLink ?? "",
    featuredProductIds: (data.featuredProductIds ?? []).filter((pid): pid is string => Boolean(pid)),
  };
}

export async function getSeasons(): Promise<Season[]> {
  const seasons = await apiFetch<ApiSeason[]>("Seasons");
  return (seasons || []).map(adaptSeason);
}

export async function getSeasonById(id: string): Promise<Season | undefined> {
  if (!id) return undefined;
  try {
    const season = await apiFetch<ApiSeason>(`Seasons/${id}`);
    return season ? adaptSeason(season) : undefined;
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

export async function updateSeason(id: string, data: Partial<SeasonPayload>): Promise<Season | undefined> {
  if (!id) return undefined;
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
    status: data.status ?? current.status,
  };

  const updated = await apiFetch<ApiSeason>(`Seasons/${id}`, {
    method: "PUT",
    body: buildApiPayload(merged),
  });

  // If user selected status 'activa', trigger activate endpoint as well
  if (data.status === "activa" && current.status !== "activa") {
    return activateSeason(id).then((list) => list.find((s) => s.id === id) ?? adaptSeason(updated));
  }

  return adaptSeason(updated);
}

export async function deleteSeason(id: string): Promise<void> {
  if (!id) return;
  await apiFetch<void>(`Seasons/${id}`, { method: "DELETE" });
}

export async function activateSeason(id: string): Promise<Season[]> {
  if (!id) return getSeasons();
  await apiFetch<ApiSeason>(`Seasons/${id}/activate`, { method: "POST" });
  return getSeasons();
}
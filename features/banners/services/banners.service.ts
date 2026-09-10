import { apiFetch } from "@/lib/api/client-fetcher";
import type { Banner } from "../types";

interface ApiBanner {
  id: string;
  title: string;
  imageUrl?: string | null;
  linkUrl: string;
  position: string;
  active: boolean;
  startDate?: string | null;
  endDate?: string | null;
  seasonId?: string | null;
  seasonName?: string | null;
  collectionId?: string | null;
  collectionName?: string | null;
}

function adaptBanner(b: ApiBanner): Banner {
  return {
    id: b.id,
    title: b.title,
    image: b.imageUrl ?? undefined,
    linkUrl: b.linkUrl,
    position: b.position,
    active: b.active,
    startDate: b.startDate ? b.startDate.slice(0, 10) : undefined,
    endDate: b.endDate ? b.endDate.slice(0, 10) : undefined,
    seasonId: b.seasonId ?? undefined,
    seasonName: b.seasonName ?? undefined,
    collectionId: b.collectionId ?? undefined,
    collectionName: b.collectionName ?? undefined,
  };
}

export interface BannerPayload {
  title: string;
  image?: string;
  linkUrl: string;
  position: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
  seasonId?: string;
  collectionId?: string;
}

function buildApiPayload(data: BannerPayload) {
  return {
    title: data.title,
    imageUrl: data.image ?? null,
    linkUrl: data.linkUrl,
    position: data.position,
    active: data.active,
    startDate: data.startDate || null,
    endDate: data.endDate || null,
    seasonId: data.seasonId || null,
    collectionId: data.collectionId || null,
  };
}

export async function getBanners(): Promise<Banner[]> {
  const banners = await apiFetch<ApiBanner[]>("Banners");
  return banners.map(adaptBanner);
}

export async function createBanner(data: BannerPayload): Promise<Banner> {
  const created = await apiFetch<ApiBanner>("Banners", {
    method: "POST",
    body: buildApiPayload(data),
  });
  return adaptBanner(created);
}

export async function updateBanner(id: string, data: BannerPayload): Promise<Banner | undefined> {
  const updated = await apiFetch<ApiBanner>(`Banners/${id}`, {
    method: "PUT",
    body: buildApiPayload(data),
  });
  return adaptBanner(updated);
}

export async function deleteBanner(id: string): Promise<void> {
  await apiFetch<void>(`Banners/${id}`, { method: "DELETE" });
}
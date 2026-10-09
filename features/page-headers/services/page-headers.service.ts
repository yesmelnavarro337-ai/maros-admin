import { apiFetch } from "@/lib/api/client-fetcher";
import { DEFAULT_TEXT_COLOR, type HeaderMedia, type PageHeaderData, type PageKey } from "../types";

interface ApiHeaderMedia {
  url: string;
  mediaType: string;
  order: number;
}

interface ApiPageHeader {
  pageKey: string;
  title: string;
  subtitle: string;
  backgroundImageUrl?: string | null;
  primaryButtonText?: string | null;
  primaryButtonLink?: string | null;
  secondaryButtonText?: string | null;
  secondaryButtonLink?: string | null;
  textColor: string;
  overlayOpacity: number;
  media?: ApiHeaderMedia[] | null;
}

function adaptMedia(media?: ApiHeaderMedia[] | null): HeaderMedia[] {
  if (!media?.length) return [];
  return media
    .filter((m) => m.url)
    .sort((a, b) => a.order - b.order)
    .map((m, index) => ({
      url: m.url,
      mediaType: m.mediaType === "video" ? ("video" as const) : ("image" as const),
      order: index,
    }));
}

function buildMediaPayload(media: HeaderMedia[]): HeaderMedia[] {
  return media
    .filter((m) => m.url)
    .map((m, index) => ({
      url: m.url,
      mediaType: m.mediaType === "video" ? ("video" as const) : ("image" as const),
      order: index,
    }));
}

function adaptPageHeader(h: ApiPageHeader): PageHeaderData {
  return {
    pageKey: h.pageKey as PageKey,
    title: h.title,
    subtitle: h.subtitle,
    backgroundImage: h.backgroundImageUrl ?? undefined,
    primaryButtonText: h.primaryButtonText ?? undefined,
    primaryButtonLink: h.primaryButtonLink ?? undefined,
    secondaryButtonText: h.secondaryButtonText ?? undefined,
    secondaryButtonLink: h.secondaryButtonLink ?? undefined,
    textColor: h.textColor,
    overlayOpacity: h.overlayOpacity,
    media: adaptMedia(h.media),
  };
}

export async function getPageHeaders(): Promise<PageHeaderData[]> {
  const headers = await apiFetch<ApiPageHeader[]>("admin/page-headers");
  return headers.map(adaptPageHeader);
}

export async function updatePageHeader(pageKey: PageKey, data: PageHeaderData): Promise<PageHeaderData> {
  const updated = await apiFetch<ApiPageHeader>(`admin/page-headers/${pageKey}`, {
    method: "PUT",
    body: {
      title: data.title,
      subtitle: data.subtitle,
      backgroundImageUrl: data.backgroundImage ?? null,
      primaryButtonText: data.primaryButtonText || null,
      primaryButtonLink: data.primaryButtonLink || null,
      secondaryButtonText: data.secondaryButtonText || null,
      secondaryButtonLink: data.secondaryButtonLink || null,
      textColor: data.textColor || DEFAULT_TEXT_COLOR,
      overlayOpacity: data.overlayOpacity,
      media: buildMediaPayload(data.media ?? []),
    },
  });
  return adaptPageHeader(updated);
}
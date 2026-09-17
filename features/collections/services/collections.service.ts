import { apiFetch } from "@/lib/api/client-fetcher";
import type { Collection } from "../types";

interface ApiCollection {
  id: string;
  name: string;
  description: string;
  coverImageUrl?: string | null;
  accentHex: string;
  isDefault: boolean;
  productIds: string[];
  seasonName?: string | null;
  isActive?: boolean;
  productsCount?: number;
  updatedAt?: string | null;
  createdAt?: string;
}

function adaptCollection(c: ApiCollection): Collection {
  return {
    id: c.id,
    name: c.name ?? "",
    description: c.description ?? "",
    coverImage: c.coverImageUrl ?? undefined,
    accentHex: c.accentHex ?? "#555A2B",
    isDefault: !!c.isDefault,
    productIds: (c.productIds ?? []).filter((pid): pid is string => Boolean(pid)),
    seasonName: c.seasonName ?? (c.name?.toLowerCase().includes("general") ? "Permanente" : "Especial"),
    isActive: c.isActive ?? (c.isDefault || Boolean(c.name?.toLowerCase().includes("general"))),
    productsCount: c.productsCount ?? (c.productIds ? c.productIds.length : 0),
    updatedAt: c.updatedAt ?? undefined,
    createdAt: c.createdAt,
  };
}

export async function getCollections(): Promise<Collection[]> {
  const collections = await apiFetch<ApiCollection[]>("Collections");
  return (collections || []).map(adaptCollection);
}

export async function getCollectionById(id: string): Promise<Collection | undefined> {
  if (!id) return undefined;
  try {
    const collection = await apiFetch<ApiCollection>(`Collections/${id}`);
    return collection ? adaptCollection(collection) : undefined;
  } catch {
    return undefined;
  }
}

export async function createCollection(data: {
  name: string;
  description?: string;
  coverImage?: string;
  accentHex?: string;
}): Promise<Collection> {
  const created = await apiFetch<ApiCollection>("Collections", {
    method: "POST",
    body: {
      name: data.name ?? "",
      description: data.description ?? "",
      coverImageUrl: data.coverImage ?? null,
      accentHex: data.accentHex ?? "#555A2B",
    },
  });
  return adaptCollection(created);
}

export async function updateCollection(
  id: string,
  data: Partial<Pick<Collection, "name" | "description" | "coverImage" | "productIds" | "accentHex">>
): Promise<Collection | undefined> {
  if (!id) return undefined;
  const current = await getCollectionById(id);
  if (!current) return undefined;

  const merged = { ...current, ...data };

  const updated = await apiFetch<ApiCollection>(`Collections/${id}`, {
    method: "PUT",
    body: {
      name: merged.name ?? "",
      description: merged.description ?? "",
      coverImageUrl: merged.coverImage ?? null,
      accentHex: merged.accentHex ?? "#555A2B",
      productIds: (merged.productIds ?? []).filter((pid): pid is string => Boolean(pid)),
    },
  });
  return adaptCollection(updated);
}

export async function setDefaultCollection(id: string): Promise<Collection> {
  if (!id) throw new Error("ID de colección inválido");
  const updated = await apiFetch<ApiCollection>(`Collections/${id}/set-default`, {
    method: "POST",
  });
  return adaptCollection(updated);
}

export async function deleteCollection(id: string): Promise<void> {
  if (!id) return;
  await apiFetch<void>(`Collections/${id}`, { method: "DELETE" });
}
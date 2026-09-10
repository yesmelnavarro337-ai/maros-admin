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
}

function adaptCollection(c: ApiCollection): Collection {
  return {
    id: c.id,
    name: c.name,
    description: c.description,
    coverImage: c.coverImageUrl ?? undefined,
    accentHex: c.accentHex,
    isDefault: c.isDefault,
    productIds: c.productIds,
  };
}

export async function getCollections(): Promise<Collection[]> {
  const collections = await apiFetch<ApiCollection[]>("Collections");
  return collections.map(adaptCollection);
}

export async function getCollectionById(id: string): Promise<Collection | undefined> {
  try {
    const collection = await apiFetch<ApiCollection>(`Collections/${id}`);
    return adaptCollection(collection);
  } catch {
    return undefined;
  }
}

export async function createCollection(data: {
  name: string;
  description: string;
  coverImage?: string;
  accentHex: string;
}): Promise<Collection> {
  const created = await apiFetch<ApiCollection>("Collections", {
    method: "POST",
    body: {
      name: data.name,
      description: data.description,
      coverImageUrl: data.coverImage ?? null,
      accentHex: data.accentHex,
    },
  });
  return adaptCollection(created);
}

export async function updateCollection(
  id: string,
  data: Partial<Pick<Collection, "name" | "description" | "coverImage" | "productIds" | "accentHex">>
): Promise<Collection | undefined> {
  // El backend espera el objeto completo en PUT — traemos el estado actual
  // para no perder campos que el formulario de esta pantalla no edita.
  const current = await getCollectionById(id);
  if (!current) return undefined;

  const merged = { ...current, ...data };

  const updated = await apiFetch<ApiCollection>(`Collections/${id}`, {
    method: "PUT",
    body: {
      name: merged.name,
      description: merged.description,
      coverImageUrl: merged.coverImage ?? null,
      accentHex: merged.accentHex,
      productIds: merged.productIds,
    },
  });
  return adaptCollection(updated);
}

export async function setDefaultCollection(id: string): Promise<Collection> {
  const updated = await apiFetch<ApiCollection>(`Collections/${id}/set-default`, {
    method: "POST",
  });
  return adaptCollection(updated);
}

export async function deleteCollection(id: string): Promise<void> {
  await apiFetch<void>(`Collections/${id}`, { method: "DELETE" });
}
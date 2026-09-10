import { serverApiFetch } from "@/lib/api/server-client";
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

export async function getCollectionsServer(): Promise<Collection[]> {
  const collections = await serverApiFetch<ApiCollection[]>("Collections");
  return collections.map(adaptCollection);
}
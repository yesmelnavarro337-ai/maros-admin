import { apiFetch } from "@/lib/api/client-fetcher";
import { revalidateWeb } from "@/lib/api/revalidate-web";
import type { Category } from "../types";

export interface CategorySavePayload {
  name: string;
  slug?: string;
  description?: string | null;
  imageUrl?: string | null;
  isActive?: boolean;
}

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("Categories");
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  try {
    return await apiFetch<Category>(`Categories/${id}`);
  } catch {
    const all = await getCategories();
    return all.find((c) => c.id === id);
  }
}

export async function createCategory(payload: CategorySavePayload): Promise<Category> {
  const created = await apiFetch<Category>("Categories", {
    method: "POST",
    body: payload,
  });
  revalidateWeb({ tag: "categories" });
  return created;
}

export async function updateCategory(id: string, payload: CategorySavePayload): Promise<Category> {
  const updated = await apiFetch<Category>(`Categories/${id}`, {
    method: "PUT",
    body: payload,
  });
  revalidateWeb({ tag: "categories" });
  return updated;
}

export async function deleteCategory(id: string): Promise<void> {
  await apiFetch<void>(`Categories/${id}`, { method: "DELETE" });
  revalidateWeb({ tag: "categories" });
}
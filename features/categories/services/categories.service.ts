import { apiFetch } from "@/lib/api/client-fetcher";
import type { Category } from "../types";

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("Categories");
}

export async function createCategory(name: string): Promise<Category> {
  return apiFetch<Category>("Categories", {
    method: "POST",
    body: { name },
  });
}

export async function updateCategory(id: string, name: string): Promise<Category> {
  return apiFetch<Category>(`Categories/${id}`, {
    method: "PUT",
    body: { name },
  });
}

export async function deleteCategory(id: string): Promise<void> {
  await apiFetch<void>(`Categories/${id}`, { method: "DELETE" });
}
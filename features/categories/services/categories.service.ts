import { apiFetch } from "@/lib/api/client-fetcher";
import type { Category } from "../types";

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("Categories");
}
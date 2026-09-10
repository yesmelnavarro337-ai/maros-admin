import { apiFetch } from "@/lib/api/client-fetcher";
import type { ContactMessage } from "../types";

export async function getContactMessages(): Promise<ContactMessage[]> {
  return apiFetch<ContactMessage[]>("ContactMessages");
}

export async function toggleMessageRead(id: string): Promise<ContactMessage> {
  return apiFetch<ContactMessage>(`ContactMessages/${id}/read`, { method: "PUT" });
}

export async function deleteContactMessage(id: string): Promise<void> {
  await apiFetch<void>(`ContactMessages/${id}`, { method: "DELETE" });
}
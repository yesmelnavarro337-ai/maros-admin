import { apiFetch } from "@/lib/api/client-fetcher";
import type { FaqItem, FaqStatus } from "../types";

interface ApiFaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  status: string;
}

const STATUS_FROM_API: Record<string, FaqStatus> = {
  Publicada: "publicada",
  Borrador: "borrador",
};

const STATUS_TO_API: Record<FaqStatus, string> = {
  publicada: "Publicada",
  borrador: "Borrador",
};

function adaptFaq(f: ApiFaqItem): FaqItem {
  return {
    id: f.id,
    question: f.question,
    answer: f.answer,
    category: f.category,
    order: f.order,
    status: STATUS_FROM_API[f.status] ?? "borrador",
  };
}

export async function getFaqItems(): Promise<FaqItem[]> {
  const items = await apiFetch<ApiFaqItem[]>("Faq");
  return items.map(adaptFaq);
}

export async function createFaqItem(data: { question: string; answer: string; category: string; status: FaqStatus }): Promise<FaqItem> {
  const created = await apiFetch<ApiFaqItem>("Faq", {
    method: "POST",
    body: {
      question: data.question,
      answer: data.answer,
      category: data.category,
      status: STATUS_TO_API[data.status],
    },
  });
  return adaptFaq(created);
}

export async function updateFaqItem(id: string, data: { question: string; answer: string; category: string; status: FaqStatus }): Promise<FaqItem | undefined> {
  const updated = await apiFetch<ApiFaqItem>(`Faq/${id}`, {
    method: "PUT",
    body: {
      question: data.question,
      answer: data.answer,
      category: data.category,
      status: STATUS_TO_API[data.status],
    },
  });
  return adaptFaq(updated);
}

export async function deleteFaqItem(id: string): Promise<void> {
  await apiFetch<void>(`Faq/${id}`, { method: "DELETE" });
}

export async function reorderFaqItem(id: string, direction: "up" | "down"): Promise<void> {
  await apiFetch<void>(`Faq/${id}/reorder?direction=${direction}`, { method: "PUT" });
}
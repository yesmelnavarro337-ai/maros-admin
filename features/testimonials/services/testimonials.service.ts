import { apiFetch } from "@/lib/api/client-fetcher";
import type { Testimonial, TestimonialStatus } from "../types";

interface ApiTestimonial {
  id: string;
  clientName: string;
  rating: number;
  quote: string;
  status: string;
}

const STATUS_FROM_API: Record<string, TestimonialStatus> = {
  Publicado: "publicado",
  Oculto: "oculto",
};

const STATUS_TO_API: Record<TestimonialStatus, string> = {
  publicado: "Publicado",
  oculto: "Oculto",
};

function adaptTestimonial(t: ApiTestimonial): Testimonial {
  return {
    id: t.id,
    clientName: t.clientName,
    rating: t.rating,
    quote: t.quote,
    status: STATUS_FROM_API[t.status] ?? "publicado",
  };
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const testimonials = await apiFetch<ApiTestimonial[]>("Testimonials");
  return testimonials.map(adaptTestimonial);
}

export async function createTestimonial(data: { clientName: string; rating: number; quote: string }): Promise<Testimonial> {
  const created = await apiFetch<ApiTestimonial>("Testimonials", {
    method: "POST",
    body: data,
  });
  return adaptTestimonial(created);
}

export async function toggleTestimonialVisibility(id: string, currentStatus: TestimonialStatus): Promise<Testimonial | undefined> {
  const newStatus: TestimonialStatus = currentStatus === "publicado" ? "oculto" : "publicado";
  const updated = await apiFetch<ApiTestimonial>(`Testimonials/${id}/status`, {
    method: "PUT",
    body: { status: STATUS_TO_API[newStatus] },
  });
  return adaptTestimonial(updated);
}

export async function deleteTestimonial(id: string): Promise<void> {
  await apiFetch<void>(`Testimonials/${id}`, { method: "DELETE" });
}
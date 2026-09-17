import { apiFetch } from "@/lib/api/client-fetcher";
import type {
  Testimonial,
  TestimonialStatus,
  TestimonialFilters,
  PagedTestimonials,
  CreateTestimonialInput,
  UpdateTestimonialInput,
} from "../types";

interface ApiTestimonial {
  id: string;
  clientName: string;
  city?: string;
  rating: number;
  quote: string;
  avatarUrl?: string;
  status: string;
  publishDate: string;
  createdAt: string;
}

interface ApiPagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

const STATUS_FROM_API: Record<string, TestimonialStatus> = {
  Publicado: "publicado",
  Pendiente: "pendiente",
  Oculto: "pendiente",
};

const STATUS_TO_API: Record<TestimonialStatus, string> = {
  publicado: "Publicado",
  pendiente: "Pendiente",
};

function adaptTestimonial(t: ApiTestimonial): Testimonial {
  return {
    id: t.id,
    clientName: t.clientName,
    city: t.city ?? undefined,
    rating: t.rating,
    quote: t.quote,
    avatarUrl: t.avatarUrl ?? undefined,
    status: STATUS_FROM_API[t.status] ?? "pendiente",
    publishDate: t.publishDate,
    createdAt: t.createdAt,
  };
}

export async function getTestimonials(filters: TestimonialFilters = {}): Promise<PagedTestimonials> {
  const params = new URLSearchParams();
  if (filters.search) params.append("search", filters.search);
  if (filters.status && filters.status !== "todos") params.append("status", STATUS_TO_API[filters.status as TestimonialStatus] ?? filters.status);
  if (filters.page) params.append("pageNumber", filters.page.toString());
  if (filters.pageSize) params.append("pageSize", filters.pageSize.toString());

  const queryString = params.toString();
  const endpoint = queryString ? `Testimonials?${queryString}` : "Testimonials";

  const result = await apiFetch<ApiPagedResult<ApiTestimonial>>(endpoint);

  return {
    items: result.items.map(adaptTestimonial),
    pageNumber: result.pageNumber,
    pageSize: result.pageSize,
    totalCount: result.totalCount,
    totalPages: result.totalPages,
    hasPreviousPage: result.hasPreviousPage,
    hasNextPage: result.hasNextPage,
  };
}

export async function createTestimonial(input: CreateTestimonialInput): Promise<Testimonial> {
  const payload = {
    clientName: input.clientName,
    city: input.city || null,
    rating: input.rating,
    quote: input.quote,
    avatarUrl: input.avatarUrl || null,
    status: STATUS_TO_API[input.status] ?? "Publicado",
    publishDate: input.publishDate,
  };

  const created = await apiFetch<ApiTestimonial>("Testimonials", {
    method: "POST",
    body: payload,
  });

  return adaptTestimonial(created);
}

export async function updateTestimonial(id: string, input: UpdateTestimonialInput): Promise<Testimonial> {
  const payload = {
    clientName: input.clientName,
    city: input.city || null,
    rating: input.rating,
    quote: input.quote,
    avatarUrl: input.avatarUrl || null,
    status: STATUS_TO_API[input.status] ?? "Publicado",
    publishDate: input.publishDate,
  };

  const updated = await apiFetch<ApiTestimonial>(`Testimonials/${id}`, {
    method: "PUT",
    body: payload,
  });

  return adaptTestimonial(updated);
}

export async function deleteTestimonial(id: string): Promise<void> {
  await apiFetch<void>(`Testimonials/${id}`, { method: "DELETE" });
}
import { apiFetch } from "@/lib/api/client-fetcher";
import type { BlogPost, BlogStatus } from "../types";

interface PagedResult<T> {
  items: T[];
}

interface ApiBlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  coverImageUrl?: string | null;
  content: string;
  status: string;
  publishDate: string;
}

const STATUS_FROM_API: Record<string, BlogStatus> = {
  Publicado: "publicado",
  Programado: "programado",
  Borrador: "borrador",
};

const STATUS_TO_API: Record<BlogStatus, string> = {
  publicado: "Publicado",
  programado: "Programado",
  borrador: "Borrador",
};

function adaptPost(p: ApiBlogPost): BlogPost {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category,
    coverImage: p.coverImageUrl ?? undefined,
    content: p.content,
    status: STATUS_FROM_API[p.status] ?? "borrador",
    publishDate: p.publishDate.slice(0, 10),
  };
}

interface BlogPostPayload {
  title: string;
  category: string;
  coverImage?: string;
  content: string;
  status: BlogStatus;
  publishDate: string;
}

function buildApiPayload(data: BlogPostPayload) {
  return {
    title: data.title,
    category: data.category,
    coverImageUrl: data.coverImage ?? null,
    content: data.content,
    status: STATUS_TO_API[data.status],
    publishDate: data.publishDate,
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const result = await apiFetch<PagedResult<ApiBlogPost>>("Blog?pageSize=100");
  return result.items.map(adaptPost);
}

export async function createBlogPost(data: BlogPostPayload): Promise<BlogPost> {
  const created = await apiFetch<ApiBlogPost>("Blog", {
    method: "POST",
    body: buildApiPayload(data),
  });
  return adaptPost(created);
}

export async function updateBlogPost(id: string, data: BlogPostPayload): Promise<BlogPost | undefined> {
  const updated = await apiFetch<ApiBlogPost>(`Blog/${id}`, {
    method: "PUT",
    body: buildApiPayload(data),
  });
  return adaptPost(updated);
}

export async function deleteBlogPost(id: string): Promise<void> {
  await apiFetch<void>(`Blog/${id}`, { method: "DELETE" });
}
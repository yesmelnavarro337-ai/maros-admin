import { apiFetch } from "@/lib/api/client-fetcher";
import type { BlogPost, BlogStatus, PagedBlogPosts, BlogPostPayload } from "../types";

interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber?: number;
  pageSize?: number;
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
    publishDate: p.publishDate?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
  };
}

function buildApiPayload(data: BlogPostPayload) {
  return {
    title: data.title,
    category: data.category,
    coverImageUrl: data.coverImage ?? null,
    content: data.content,
    status: STATUS_TO_API[data.status] ?? "Borrador",
    publishDate: data.publishDate,
  };
}

export async function getBlogPostsPaged(filters?: {
  search?: string;
  status?: string;
  category?: string;
  pageNumber?: number;
  pageSize?: number;
}): Promise<PagedBlogPosts> {
  const params = new URLSearchParams();
  const pageNumber = filters?.pageNumber ?? 1;
  const pageSize = filters?.pageSize ?? 10;

  params.set("pageNumber", pageNumber.toString());
  params.set("pageSize", pageSize.toString());

  if (filters?.search && filters.search.trim()) params.set("search", filters.search.trim());
  if (filters?.status && filters.status !== "todos") params.set("status", STATUS_TO_API[filters.status as BlogStatus] ?? filters.status);
  if (filters?.category && filters.category !== "todas") params.set("category", filters.category);

  const result = await apiFetch<PagedResult<ApiBlogPost>>(`BlogPosts?${params.toString()}`);
  const items = (result.items || []).map(adaptPost);
  const totalCount = result.totalCount ?? items.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return { items, pageNumber, pageSize, totalCount, totalPages };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const res = await getBlogPostsPaged({ pageSize: 100 });
  return res.items;
}

export async function getBlogPostById(id: string): Promise<BlogPost | undefined> {
  try {
    const post = await apiFetch<ApiBlogPost>(`BlogPosts/${id}`);
    return adaptPost(post);
  } catch {
    return undefined;
  }
}

export async function createBlogPost(data: BlogPostPayload): Promise<BlogPost> {
  const created = await apiFetch<ApiBlogPost>("BlogPosts", {
    method: "POST",
    body: buildApiPayload(data),
  });
  return adaptPost(created);
}

export async function updateBlogPost(id: string, data: BlogPostPayload): Promise<BlogPost> {
  const updated = await apiFetch<ApiBlogPost>(`BlogPosts/${id}`, {
    method: "PUT",
    body: buildApiPayload(data),
  });
  return adaptPost(updated);
}

export async function deleteBlogPost(id: string): Promise<void> {
  await apiFetch<void>(`BlogPosts/${id}`, { method: "DELETE" });
}
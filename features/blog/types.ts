export type BlogStatus = "publicado" | "programado" | "borrador";

export const BLOG_CATEGORIES = [
  "Moda y Tendencias",
  "Cuidado y Estilo",
  "Consejos",
  "Tendencias",
  "Salud",
] as const;

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  coverImage?: string;
  content: string;
  status: BlogStatus;
  publishDate: string;
}

export interface PagedBlogPosts {
  items: BlogPost[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface BlogPostPayload {
  title: string;
  category: string;
  coverImage?: string;
  content: string;
  status: BlogStatus;
  publishDate: string;
}
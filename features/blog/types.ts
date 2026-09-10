export type BlogStatus = "publicado" | "programado" | "borrador";

export const BLOG_CATEGORIES = ["Consejos", "Cuidado", "Moda", "Tendencias", "Salud"] as const;

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
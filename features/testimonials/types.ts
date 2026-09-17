export type TestimonialStatus = "publicado" | "pendiente";

export interface Testimonial {
  id: string;
  clientName: string;
  city?: string;
  rating: number;
  quote: string;
  avatarUrl?: string;
  status: TestimonialStatus;
  publishDate: string;
  createdAt: string;
}

export interface TestimonialFilters {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface PagedTestimonials {
  items: Testimonial[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CreateTestimonialInput {
  clientName: string;
  city?: string;
  rating: number;
  quote: string;
  avatarUrl?: string;
  status: TestimonialStatus;
  publishDate: string;
}

export interface UpdateTestimonialInput {
  clientName: string;
  city?: string;
  rating: number;
  quote: string;
  avatarUrl?: string;
  status: TestimonialStatus;
  publishDate: string;
}
export type TestimonialStatus = "publicado" | "oculto";

export interface Testimonial {
  id: string;
  clientName: string;
  rating: number;
  quote: string;
  status: TestimonialStatus;
}
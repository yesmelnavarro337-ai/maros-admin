import type { QuotationStatus } from "@/features/quotations/types";

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  createdAt: string;
}

export interface ClientQuotationSummary {
  id: string;
  status: QuotationStatus;
  createdAt: string;
  productNames: string[];
}

export interface ClientWithQuotations extends Client {
  quotations: ClientQuotationSummary[];
}
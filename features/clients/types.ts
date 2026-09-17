import type { QuotationStatus } from "@/features/quotations/types";

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  createdAt: string;
  isActive: boolean;
  totalQuotations: number;
  lastActivityAt?: string;
}

export interface ClientQuotationSummary {
  id: string;
  folio: string;
  status: QuotationStatus;
  createdAt: string;
  productNames: string[];
  customizationBadges: string[];
  totalAmount: number;
}

export interface ClientActivityLog {
  id: string;
  type: "message" | "quotation_sent" | "quotation_approved" | "registered";
  title: string;
  description: string;
  timestamp: string;
}

export interface ClientWithQuotations extends Client {
  totalMessages: number;
  quotations: ClientQuotationSummary[];
  activityLogs: ClientActivityLog[];
}

export interface PagedClients {
  items: Client[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ClientFormData {
  name: string;
  phone: string;
  email?: string;
  city: string;
}
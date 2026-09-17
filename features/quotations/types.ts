export type QuotationStatus =
  | "nueva"
  | "en_revision"
  | "contactada"
  | "cotizada"
  | "aceptada"
  | "rechazada"
  | "archivada";

export interface QuotationOption {
  optionId: string;
  catalogType: string;
  name: string;
}

export interface QuotationItem {
  id?: string;
  productId?: string;
  productName: string;
  productImage?: string;
  modelo?: string;
  size?: string;
  color?: string;
  tela?: string;
  estampado?: string;
  bordado?: string;
  embroideryText?: string;
  selectedOptions?: QuotationOption[];
  estimatedUnitPrice: number;
  quantity: number;
}

export interface Quotation {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone: string;
  clientCity: string;
  items: QuotationItem[];
  referenceImages: string[];
  status: QuotationStatus;
  notes: string;
  createdAt: string;
  updatedAt?: string;
  channel?: string;
}

export interface PagedQuotations {
  items: Quotation[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export const QUOTATION_STATUSES: { value: QuotationStatus; label: string }[] = [
  { value: "nueva", label: "Nueva" },
  { value: "en_revision", label: "En revisión" },
  { value: "contactada", label: "Contactada" },
  { value: "cotizada", label: "Cotizada" },
  { value: "aceptada", label: "Aceptada" },
  { value: "rechazada", label: "Rechazada" },
  { value: "archivada", label: "Archivada" },
];

export type QuotationStatus =
  | "nueva"
  | "en_revision"
  | "contactada"
  | "cotizada"
  | "aceptada"
  | "rechazada"
  | "archivada";

export interface QuotationItem {
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
  estimatedUnitPrice: number;
  quantity: number;
}

export interface Quotation {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientCity: string;
  items: QuotationItem[];
  referenceImages: string[];
  status: QuotationStatus;
  notes: string;
  createdAt: string;
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

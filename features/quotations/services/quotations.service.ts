import { apiFetch } from "@/lib/api/client-fetcher";
import type { Quotation, QuotationItem, QuotationStatus } from "../types";

interface PagedResult<T> {
  items: T[];
  totalCount: number;
}

interface ApiQuotationOption {
  id: string;
  catalogType: string;
  name: string;
}

interface ApiQuotationItem {
  id: string;
  productId?: string | null;
  productName: string;
  size: string;
  quantity: number;
  selectedOptions: ApiQuotationOption[];
  embroideryText?: string | null;
}

interface ApiQuotation {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  status: string;
  notes: string;
  items: ApiQuotationItem[];
  referenceImages: string[];
  createdAt: string;
}

export const STATUS_FROM_API: Record<string, QuotationStatus> = {
  Nueva: "nueva",
  EnRevision: "en_revision",
  Contactada: "contactada",
  Cotizada: "cotizada",
  Aceptada: "aceptada",
  Rechazada: "rechazada",
  Archivada: "archivada",
};

const STATUS_TO_API: Record<QuotationStatus, string> = {
  nueva: "Nueva",
  en_revision: "EnRevision",
  contactada: "Contactada",
  cotizada: "Cotizada",
  aceptada: "Aceptada",
  rechazada: "Rechazada",
  archivada: "Archivada",
};

const OPTION_TYPE_TO_FIELD: Record<string, keyof QuotationItem> = {
  Modelo: "modelo",
  Tela: "tela",
  Color: "color",
  Estampado: "estampado",
  Bordado: "bordado",
};

function adaptItem(i: ApiQuotationItem): QuotationItem {
  const item: QuotationItem = {
    productId: i.productId ?? undefined,
    productName: i.productName,
    size: i.size,
    quantity: i.quantity,
    embroideryText: i.embroideryText ?? undefined,
  };

  for (const option of i.selectedOptions) {
    const field = OPTION_TYPE_TO_FIELD[option.catalogType];
    if (field) (item[field] as string) = option.name;
  }

  return item;
}

function adaptQuotation(q: ApiQuotation): Quotation {
  return {
    id: q.id,
    clientId: q.customerId,
    clientName: q.customerName,
    clientPhone: q.customerPhone,
    clientCity: q.customerCity,
    items: q.items.map(adaptItem),
    referenceImages: q.referenceImages,
    status: STATUS_FROM_API[q.status] ?? "nueva",
    notes: q.notes,
    createdAt: q.createdAt,
  };
}

export async function getQuotations(filters?: { status?: QuotationStatus | "todos"; search?: string }): Promise<Quotation[]> {
  const params = new URLSearchParams();
  params.set("pageSize", "100");
  if (filters?.status && filters.status !== "todos") {
    params.set("status", STATUS_TO_API[filters.status]);
  }
  if (filters?.search) params.set("search", filters.search);

  const result = await apiFetch<PagedResult<ApiQuotation>>(`Quotations?${params.toString()}`);
  return result.items.map(adaptQuotation);
}

export async function getQuotationById(id: string): Promise<Quotation | undefined> {
  try {
    const quotation = await apiFetch<ApiQuotation>(`Quotations/${id}`);
    return adaptQuotation(quotation);
  } catch {
    return undefined;
  }
}

export async function updateQuotationStatus(
  id: string,
  status: QuotationStatus
): Promise<Quotation | undefined> {
  const updated = await apiFetch<ApiQuotation>(`Quotations/${id}/status`, {
    method: "PUT",
    body: { status: STATUS_TO_API[status] },
  });
  return adaptQuotation(updated);
}

interface WhatsAppMessage {
  phoneNumber: string;
  message: string;
  link: string;
}

export async function getWhatsAppLink(quotationId: string): Promise<WhatsAppMessage> {
  return apiFetch<WhatsAppMessage>(`Quotations/${quotationId}/whatsapp`);
}

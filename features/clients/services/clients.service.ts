import { apiFetch } from "@/lib/api/client-fetcher";
import { STATUS_FROM_API } from "@/features/quotations/services/quotations.service";
import type {
  Client,
  ClientWithQuotations,
  PagedClients,
  ClientFormData,
  ClientActivityLog,
  ClientQuotationSummary,
} from "../types";

interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber?: number;
  pageSize?: number;
}

interface ApiCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  city: string;
  createdAt: string;
  isActive?: boolean;
  totalQuotations?: number;
  lastActivityAt?: string | null;
}

interface ApiCustomerQuotationSummary {
  id: string;
  folio?: string;
  status: string;
  createdAt: string;
  productNames: string[];
  customizationBadges?: string[];
  totalAmount?: number;
}

interface ApiCustomerActivityLog {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
}

interface ApiCustomerWithQuotations extends ApiCustomer {
  totalMessages?: number;
  quotations: ApiCustomerQuotationSummary[];
  activityLogs: ApiCustomerActivityLog[];
}

function adaptClient(c: ApiCustomer): Client {
  return {
    id: c.id,
    name: c.name,
    phone: c.phone,
    email: c.email ?? undefined,
    city: c.city,
    createdAt: c.createdAt,
    isActive: c.isActive ?? true,
    totalQuotations: c.totalQuotations ?? 0,
    lastActivityAt: c.lastActivityAt ?? c.createdAt,
  };
}

export async function getClientsPaged(filters?: {
  search?: string;
  status?: string;
  city?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  pageNumber?: number;
  pageSize?: number;
}): Promise<PagedClients> {
  const params = new URLSearchParams();
  const pageNumber = filters?.pageNumber ?? 1;
  const pageSize = filters?.pageSize ?? 10;

  params.set("pageNumber", pageNumber.toString());
  params.set("pageSize", pageSize.toString());

  if (filters?.search && filters.search.trim()) params.set("search", filters.search.trim());
  if (filters?.status && filters.status !== "todos") params.set("status", filters.status);
  if (filters?.city && filters.city !== "todas") params.set("city", filters.city);
  if (filters?.fromDate) params.set("fromDate", filters.fromDate);
  if (filters?.toDate) params.set("toDate", filters.toDate);
  if (filters?.sortBy) params.set("sortBy", filters.sortBy);

  const result = await apiFetch<PagedResult<ApiCustomer>>(`Customers?${params.toString()}`);
  const items = (result.items || []).map(adaptClient);
  const totalCount = result.totalCount ?? items.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return {
    items,
    pageNumber,
    pageSize,
    totalCount,
    totalPages,
  };
}

export async function getClients(search?: string): Promise<Client[]> {
  const res = await getClientsPaged({ search, pageSize: 100 });
  return res.items;
}

export async function getClientById(id: string): Promise<ClientWithQuotations | undefined> {
  try {
    const data = await apiFetch<ApiCustomerWithQuotations>(`Customers/${id}`);

    const quotations: ClientQuotationSummary[] = (data.quotations || []).map((q) => ({
      id: q.id,
      folio: q.folio || `COT-${q.id.slice(0, 8).toUpperCase()}`,
      status: STATUS_FROM_API[q.status] ?? "nueva",
      createdAt: q.createdAt,
      productNames: q.productNames || [],
      customizationBadges: q.customizationBadges || ["Estándar"],
      totalAmount: q.totalAmount ?? 0,
    }));

    const activityLogs: ClientActivityLog[] = (data.activityLogs || []).map((log) => ({
      id: log.id,
      type: (log.type as ClientActivityLog["type"]) || "message",
      title: log.title,
      description: log.description,
      timestamp: log.timestamp,
    }));

    return {
      ...adaptClient(data),
      totalMessages: data.totalMessages ?? 0,
      quotations,
      activityLogs,
    };
  } catch {
    return undefined;
  }
}

export async function createClient(data: ClientFormData): Promise<Client> {
  const created = await apiFetch<ApiCustomer>("Customers", {
    method: "POST",
    body: data,
  });
  return adaptClient(created);
}

export async function updateClient(id: string, data: ClientFormData): Promise<Client> {
  const updated = await apiFetch<ApiCustomer>(`Customers/${id}`, {
    method: "PUT",
    body: data,
  });
  return adaptClient(updated);
}

export async function getCitiesList(): Promise<string[]> {
  try {
    return await apiFetch<string[]>("Customers/cities");
  } catch {
    return ["Valledupar", "Bogotá", "Medellín", "Cali", "Barranquilla"];
  }
}

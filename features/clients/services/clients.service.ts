import { apiFetch } from "@/lib/api/client-fetcher";
import { STATUS_FROM_API } from "@/features/quotations/services/quotations.service";
import type { Client, ClientWithQuotations } from "../types";

interface PagedResult<T> {
  items: T[];
}

interface ApiCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  city: string;
  createdAt: string;
}

interface ApiCustomerQuotationSummary {
  id: string;
  status: string;
  createdAt: string;
  productNames: string[];
}

interface ApiCustomerWithQuotations extends ApiCustomer {
  quotations: ApiCustomerQuotationSummary[];
}

function adaptClient(c: ApiCustomer): Client {
  return {
    id: c.id,
    name: c.name,
    phone: c.phone,
    email: c.email ?? undefined,
    city: c.city,
    createdAt: c.createdAt,
  };
}

export async function getClients(search?: string): Promise<Client[]> {
  const params = new URLSearchParams({ pageSize: "100" });
  if (search) params.set("search", search);

  const result = await apiFetch<PagedResult<ApiCustomer>>(`Customers?${params.toString()}`);
  return result.items.map(adaptClient);
}

export async function getClientWithQuotations(id: string): Promise<ClientWithQuotations | undefined> {
  try {
    const data = await apiFetch<ApiCustomerWithQuotations>(`Customers/${id}`);
    return {
      ...adaptClient(data),
      quotations: data.quotations.map((q) => ({
        id: q.id,
        status: STATUS_FROM_API[q.status] ?? "nueva",
        createdAt: q.createdAt,
        productNames: q.productNames,
      })),
    };
  } catch {
    return undefined;
  }
}

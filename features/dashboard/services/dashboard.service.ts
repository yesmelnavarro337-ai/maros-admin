import { apiFetch } from "@/lib/api/client-fetcher";
import type { QuotationTrendPoint } from "../types";

export async function getQuotationTrend(period: string = "7d"): Promise<QuotationTrendPoint[]> {
  return apiFetch<QuotationTrendPoint[]>(`Dashboard/trend?period=${period}`);
}
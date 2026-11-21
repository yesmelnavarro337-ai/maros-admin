import { apiFetch } from "@/lib/api/client-fetcher";
import type { DashboardSummary, QuotationTrendPoint } from "../types";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return apiFetch<DashboardSummary>("Dashboard");
}

export async function getQuotationTrend(period: string = "7d"): Promise<QuotationTrendPoint[]> {
  return apiFetch<QuotationTrendPoint[]>(`Dashboard/trend?period=${period}`);
}
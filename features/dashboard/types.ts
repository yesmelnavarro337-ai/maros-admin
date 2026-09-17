import type { LucideIcon } from "lucide-react";

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
}

export interface QuotationStatusCount {
  status: string;
  label: string;
  count: number;
}

export interface RecentQuotationRow {
  id: string;
  clientName: string;
  productSummary: string;
  status: string;
  date: string;
}

export interface KpiMetric {
  value: number;
  previousValue: number;
  percentageChange: number;
  trendText: string;
}

export interface DashboardKpis {
  totalQuotations: KpiMetric;
  totalCustomers: KpiMetric;
  totalProducts: KpiMetric;
  activeCollections: KpiMetric;
}

export interface QuotationTrendPoint {
  day: string;
  date: string;
  total: number;
}

export interface QuotationStatusBreakdown {
  status: string;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export interface RecentQuotation {
  id: string;
  code: string;
  customerName: string;
  createdAt: string;
  formattedDate: string;
  totalAmount: number;
  formattedTotal: string;
  status: string;
  productSummary: string;
}

export interface LowStockProduct {
  id: string;
  name: string;
  totalStock: number;
  thumbnailUrl?: string;
}

export interface ActiveSeasonInfo {
  name: string;
  collectionName: string;
  collectionId: string;
  startDate: string;
  endDate: string;
}

export interface DashboardSummary {
  kpis: DashboardKpis;
  quotationTrend: QuotationTrendPoint[];
  statusBreakdown: QuotationStatusBreakdown[];
  recentQuotations: RecentQuotation[];
  lowStockProducts: LowStockProduct[];
  activeSeason: ActiveSeasonInfo | null;
}
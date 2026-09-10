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

export interface LowStockProduct {
  id: string;
  name: string;
  totalStock: number;
  thumbnailUrl?: string;
}

export interface RecentQuotationRow {
  id: string;
  clientName: string;
  productSummary: string;
  status: string;
  date: string;
}

export interface ActiveSeasonInfo {
  name: string;
  collection: string;
  collectionId: string;
  startDate: string;
  endDate: string;
}

export interface DashboardData {
  stats: DashboardStat[];
  quotationsByStatus: QuotationStatusCount[];
  acceptanceRate: number;
  lowStockProducts: LowStockProduct[];
  recentQuotations: RecentQuotationRow[];
  activeSeason: ActiveSeasonInfo | null;
}
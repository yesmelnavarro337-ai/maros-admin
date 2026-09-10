import { ClipboardList, Users, ShoppingBag, FileText } from "lucide-react";
import { serverApiFetch } from "@/lib/api/server-client";
import type {
  DashboardData,
  DashboardStat,
  QuotationStatusCount,
  LowStockProduct,
  RecentQuotationRow,
  ActiveSeasonInfo,
} from "../types";

interface PagedResult<T> {
  items: T[];
  totalCount: number;
}

interface ApiQuotationItem {
  productName: string;
}

interface ApiQuotation {
  id: string;
  customerName: string;
  status: string;
  createdAt: string;
  items: ApiQuotationItem[];
}

interface ApiProductVariant {
  stock: number;
}

interface ApiProduct {
  id: string;
  name: string;
  images: string[];
  variants: ApiProductVariant[];
}

interface ApiSeason {
  name: string;
  collectionName: string;
  collectionId: string;
  startDate: string;
  endDate: string;
  status: string;
}

const QUOTATION_STATUSES: { value: string; label: string }[] = [
  { value: "Nueva", label: "Nueva" },
  { value: "EnRevision", label: "En revisión" },
  { value: "Contactada", label: "Contactada" },
  { value: "Cotizada", label: "Cotizada" },
  { value: "Aceptada", label: "Aceptada" },
  { value: "Rechazada", label: "Rechazada" },
  { value: "Archivada", label: "Archivada" },
];

export async function getDashboardData(): Promise<DashboardData> {
  const [statusCounts, customersPage, activeProductsPage, allActiveProducts, recentQuotationsPage, seasons] =
    await Promise.all([
      Promise.all(
        QUOTATION_STATUSES.map((s) =>
          serverApiFetch<PagedResult<unknown>>(`Quotations?status=${s.value}&pageSize=1`)
        )
      ),
      serverApiFetch<PagedResult<unknown>>("Customers?pageSize=1"),
      serverApiFetch<PagedResult<unknown>>("Products?status=Activo&pageSize=1"),
      serverApiFetch<PagedResult<ApiProduct>>("Products?status=Activo&pageSize=100"),
      serverApiFetch<PagedResult<ApiQuotation>>("Quotations?pageSize=5"),
      serverApiFetch<ApiSeason[]>("Seasons"),
    ]);

  const quotationsByStatus: QuotationStatusCount[] = QUOTATION_STATUSES.map((s, i) => ({
    status: s.value,
    label: s.label,
    count: statusCounts[i].totalCount,
  }));

  const totalQuotations = quotationsByStatus.reduce((sum, s) => sum + s.count, 0);
  const nuevasCount = quotationsByStatus.find((s) => s.status === "Nueva")?.count ?? 0;
  const aceptadasCount = quotationsByStatus.find((s) => s.status === "Aceptada")?.count ?? 0;
  const acceptanceRate = totalQuotations > 0 ? Math.round((aceptadasCount / totalQuotations) * 100) : 0;

  const stats: DashboardStat[] = [
    { id: "quotations-new", label: "Cotizaciones nuevas", value: String(nuevasCount), icon: ClipboardList },
    { id: "customers", label: "Clientes registrados", value: String(customersPage.totalCount), icon: Users },
    { id: "products", label: "Productos activos", value: String(activeProductsPage.totalCount), icon: ShoppingBag },
    { id: "quotations-total", label: "Cotizaciones totales", value: String(totalQuotations), icon: FileText },
  ];

  const lowStockProducts: LowStockProduct[] = allActiveProducts.items
    .map((p) => ({
      id: p.id,
      name: p.name,
      totalStock: p.variants.reduce((sum, v) => sum + v.stock, 0),
      thumbnailUrl: p.images[0],
    }))
    .sort((a, b) => a.totalStock - b.totalStock)
    .slice(0, 5);

  const recentQuotations: RecentQuotationRow[] = recentQuotationsPage.items.map((q) => ({
    id: q.id,
    clientName: q.customerName,
    productSummary:
      q.items.length === 0
        ? "Sin productos"
        : q.items.length > 1
          ? `${q.items[0].productName} +${q.items.length - 1} más`
          : q.items[0].productName,
    status: q.status,
    date: q.createdAt,
  }));

  const activeSeasonData = seasons.find((s) => s.status === "Activa");
  const activeSeason: ActiveSeasonInfo | null = activeSeasonData
    ? {
        name: activeSeasonData.name,
        collection: activeSeasonData.collectionName,
        collectionId: activeSeasonData.collectionId,
        startDate: activeSeasonData.startDate,
        endDate: activeSeasonData.endDate,
      }
    : null;

  return { stats, quotationsByStatus, acceptanceRate, lowStockProducts, recentQuotations, activeSeason };
}
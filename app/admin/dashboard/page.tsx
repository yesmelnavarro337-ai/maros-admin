import { getDashboardData } from "@/features/dashboard/services/dashboard.service";
import { serverApiFetch } from "@/lib/api/server-client";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { QuotationsByStatusChart } from "@/features/dashboard/components/quotations-by-status-chart";
import { LowStockProductsCard } from "@/features/dashboard/components/low-stock-products-card";
import { RecentQuotationsTable } from "@/features/dashboard/components/recent-quotations-table";
import { ActiveSeasonCard } from "@/features/dashboard/components/active-season-card";
import { AcceptanceRateCard } from "@/features/dashboard/components/acceptance-rate-card";
import { QuickActions } from "@/features/dashboard/components/quick-actions";
import { ExportReportButton } from "@/features/dashboard/components/export-report-button";

interface SettingsResponse {
  whatsappNumber: string;
  whatsappDefaultMessage: string;
}

export default async function DashboardPage() {
  const [data, settings] = await Promise.all([
    getDashboardData(),
    serverApiFetch<SettingsResponse>("Settings"),
  ]);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Dashboard"
        subtitle="Resumen general de Maro's Pijamas"
        action={
          <ExportReportButton
            stats={data.stats.map((s) => ({ label: s.label, value: s.value }))}
            conversionRate={data.acceptanceRate}
            activeSeasonName={data.activeSeason?.name ?? "Sin temporada activa"}
          />
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {data.stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <QuotationsByStatusChart data={data.quotationsByStatus} />
        <div className="flex flex-col gap-4">
          {data.activeSeason && (
            <ActiveSeasonCard
              name={data.activeSeason.name}
              collection={data.activeSeason.collection}
              collectionId={data.activeSeason.collectionId}
              startDate={data.activeSeason.startDate}
              endDate={data.activeSeason.endDate}
            />
          )}
          <AcceptanceRateCard rate={data.acceptanceRate} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentQuotationsTable quotations={data.recentQuotations} />
        <LowStockProductsCard products={data.lowStockProducts} />
      </div>

      <QuickActions
        whatsappNumber={settings.whatsappNumber}
        whatsappMessage={settings.whatsappDefaultMessage}
      />
    </div>
  );
}
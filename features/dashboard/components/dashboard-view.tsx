"use client";

import { useState } from "react";
import { DashboardHeroBanner } from "./dashboard-hero-banner";
import { DashboardKpiGrid } from "./dashboard-kpi-grid";
import { DashboardLineChart } from "./dashboard-line-chart";
import { DashboardDonutChart } from "./dashboard-donut-chart";
import { DashboardRecentTable } from "./dashboard-recent-table";
import { DashboardRightPanel } from "./dashboard-right-panel";
import { getQuotationTrend } from "../services/dashboard.service";
import type { DashboardSummary, QuotationTrendPoint } from "../types";

interface DashboardViewProps {
  initialSummary?: DashboardSummary | null;
}

export function DashboardView({ initialSummary }: DashboardViewProps) {
  const [period, setPeriod] = useState<string>("7d");
  const [trendData, setTrendData] = useState<QuotationTrendPoint[]>(
    initialSummary?.quotationTrend ?? []
  );
  const [isLoadingTrend, setIsLoadingTrend] = useState<boolean>(false);

  const handlePeriodChange = async (newPeriod: string) => {
    setPeriod(newPeriod);
    setIsLoadingTrend(true);
    try {
      const newTrend = await getQuotationTrend(newPeriod);
      setTrendData(newTrend);
    } catch (error) {
      console.error("Error al obtener la tendencia de cotizaciones:", error);
    } finally {
      setIsLoadingTrend(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Hero Banner */}
      <DashboardHeroBanner userName="YESMEL" />

      {/* 2. Grid de KPIs (4 columnas con métricas reales) */}
      <DashboardKpiGrid kpis={initialSummary?.kpis} />

      {/* 3. Main Dashboard Layout (Grid principal + Panel Derecho) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Contenido Principal (2 Columnas en lg:) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Fila de Gráficas: Línea interactiva + Donut Estados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardLineChart
              data={trendData}
              period={period}
              onPeriodChange={handlePeriodChange}
              isLoading={isLoadingTrend}
            />
            <DashboardDonutChart data={initialSummary?.statusBreakdown} />
          </div>

          {/* Tabla de Últimas Cotizaciones */}
          <DashboardRecentTable rows={initialSummary?.recentQuotations} />
        </div>

        {/* Panel Lateral Derecho (1 Columna en lg:) */}
        <DashboardRightPanel />
      </div>
    </div>
  );
}

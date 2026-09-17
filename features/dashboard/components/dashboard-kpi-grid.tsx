"use client";

import { FileText, Users, Package, Star, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardKpis } from "../types";

interface DashboardKpiGridProps {
  kpis?: DashboardKpis;
}

export function DashboardKpiGrid({ kpis }: DashboardKpiGridProps) {
  const items = [
    {
      title: "Total de cotizaciones",
      value: kpis?.totalQuotations.value ?? 0,
      trend: kpis?.totalQuotations.trendText ?? "0% este mes",
      isPositive: (kpis?.totalQuotations.percentageChange ?? 0) >= 0,
      icon: FileText,
    },
    {
      title: "Clientes registrados",
      value: kpis?.totalCustomers.value ?? 0,
      trend: kpis?.totalCustomers.trendText ?? "0% este mes",
      isPositive: (kpis?.totalCustomers.percentageChange ?? 0) >= 0,
      icon: Users,
    },
    {
      title: "Productos en inventario",
      value: kpis?.totalProducts.value ?? 0,
      trend: kpis?.totalProducts.trendText ?? "0% este mes",
      isPositive: (kpis?.totalProducts.percentageChange ?? 0) >= 0,
      icon: Package,
    },
    {
      title: "Colecciones activas",
      value: kpis?.activeCollections.value ?? 0,
      trend: kpis?.activeCollections.trendText ?? "0% este mes",
      isPositive: (kpis?.activeCollections.percentageChange ?? 0) >= 0,
      icon: Star,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((kpi, idx) => {
        const Icon = kpi.icon;
        const TrendIcon = kpi.isPositive ? TrendingUp : TrendingDown;
        const trendColor = kpi.isPositive ? "text-emerald-600" : "text-rose-600";

        return (
          <Card key={idx} className="border border-border/80 shadow-2xs hover:shadow-xs transition-all">
            <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-lg bg-[#F5F0E6] text-[#7A6C3E] flex items-center justify-center border border-[#EBE3D3]">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div>
                <p className="text-3xl font-semibold text-foreground tracking-tight font-heading">
                  {kpi.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  {kpi.title}
                </p>
              </div>

              <div className={`flex items-center gap-1 text-[11px] font-medium pt-1 ${trendColor}`}>
                <TrendIcon className="h-3 w-3" />
                <span>{kpi.isPositive ? "↑" : "↓"} {kpi.trend}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

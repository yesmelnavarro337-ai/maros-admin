"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { QuotationStatusBreakdown } from "../types";

interface DashboardDonutChartProps {
  data?: QuotationStatusBreakdown[];
}

const defaultStatusBreakdown: QuotationStatusBreakdown[] = [
  { status: "Pendiente", label: "Pendientes", count: 0, percentage: 0, color: "#6A5E39" },
  { status: "En proceso", label: "En proceso", count: 0, percentage: 0, color: "#748CAB" },
  { status: "Respondida", label: "Respondidas", count: 0, percentage: 0, color: "#D4B982" },
  { status: "Cancelada", label: "Canceladas", count: 0, percentage: 0, color: "#F0A6A6" },
];

export function DashboardDonutChart({ data = defaultStatusBreakdown }: DashboardDonutChartProps) {
  const breakdown = data.length > 0 ? data : defaultStatusBreakdown;
  const total = breakdown.reduce((sum, item) => sum + item.count, 0);

  // Recharts requires non-zero counts to draw slices cleanly
  const chartData = total > 0 ? breakdown : breakdown.map((item) => ({ ...item, count: 1 }));

  return (
    <Card className="border border-border/80 shadow-2xs">
      <CardHeader className="pb-2">
        <CardTitle className="font-heading text-lg font-semibold text-foreground">
          Estado de cotizaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Donut Chart with center total */}
          <div className="relative h-[180px] w-[180px] shrink-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-heading text-2xl font-bold text-foreground">{total}</span>
              <span className="text-[11px] text-muted-foreground font-medium">Total</span>
            </div>
          </div>

          {/* Right Legend Breakdown */}
          <div className="flex-1 space-y-2.5 w-full">
            {breakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-foreground">{item.label}</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-foreground font-semibold">{item.count}</span>
                  <span className="text-muted-foreground text-[11px] w-10 text-right">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

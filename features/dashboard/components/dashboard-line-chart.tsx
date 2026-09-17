"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { QuotationTrendPoint } from "../types";

interface DashboardLineChartProps {
  data?: QuotationTrendPoint[];
  period?: string;
  onPeriodChange?: (period: string) => void;
  isLoading?: boolean;
}

export function DashboardLineChart({
  data = [],
  period = "7d",
  onPeriodChange,
  isLoading = false,
}: DashboardLineChartProps) {
  const maxTotal = data.length > 0 ? Math.max(...data.map((d) => d.total)) : 10;
  const yDomainMax = Math.max(maxTotal + 2, 5);

  const getPeriodSubtitle = (p: string) => {
    switch (p) {
      case "30d":
        return "Últimos 30 días";
      case "1y":
      case "thisyear":
        return "Este año";
      default:
        return "Últimos 7 días";
    }
  };

  return (
    <Card className="border border-border/80 shadow-2xs">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="font-heading text-lg font-semibold text-foreground">
            Cotizaciones
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            {getPeriodSubtitle(period)}
          </p>
        </div>

        <Select value={period} onValueChange={(val) => onPeriodChange?.(val)}>
          <SelectTrigger className="w-[140px] h-8 text-xs bg-muted/30">
            <SelectValue placeholder="Periodo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 días</SelectItem>
            <SelectItem value="30d">Últimos 30 días</SelectItem>
            <SelectItem value="1y">Este año</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="h-[220px] w-full relative">
          {isLoading && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-xs flex items-center justify-center z-10">
              <span className="text-xs text-muted-foreground animate-pulse">Cargando datos...</span>
            </div>
          )}
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="quotationsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8C7A4A" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#8C7A4A" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBE5D8" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8A7D63" }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#8A7D63" }}
                domain={[0, yDomainMax]}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#F7F3EB", borderColor: "#E8DFC9", borderRadius: "8px", fontSize: "12px" }}
                formatter={(value) => [`${value ?? 0} cotizaciones`, "Total"]}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#8C7A4A"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#quotationsGradient)"
                dot={{ r: 4, fill: "#8C7A4A", stroke: "#FFFFFF", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#5A4F35" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

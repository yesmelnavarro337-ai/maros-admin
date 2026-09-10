"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { QuotationStatusCount } from "../types";

const STATUS_COLORS: Record<string, string> = {
  Nueva: "var(--accent)",
  EnRevision: "var(--secondary)",
  Contactada: "var(--primary)",
  Cotizada: "var(--primary)",
  Aceptada: "var(--primary)",
  Rechazada: "var(--destructive)",
  Archivada: "var(--muted-foreground)",
};

export function QuotationsByStatusChart({ data }: { data: QuotationStatusCount[] }) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-base font-medium">Cotizaciones por estado</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="label"
              stroke="var(--muted-foreground)"
              fontSize={11}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={50}
            />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "0.5rem",
                fontSize: "0.85rem",
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? "var(--primary)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
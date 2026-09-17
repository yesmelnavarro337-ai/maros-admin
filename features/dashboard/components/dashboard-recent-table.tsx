"use client";

import Link from "next/link";
import { Eye, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RecentQuotation } from "../types";

interface DashboardRecentTableProps {
  rows?: RecentQuotation[];
}

export function DashboardRecentTable({ rows = [] }: DashboardRecentTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pendiente":
        return (
          <Badge variant="outline" className="bg-[#FEF3D6] text-[#A6750C] border-[#FBE6AD] font-medium text-xs px-2.5 py-0.5 rounded-full">
            🔸 Pendiente
          </Badge>
        );
      case "En proceso":
        return (
          <Badge variant="outline" className="bg-[#EBF3FC] text-[#2B6CB0] border-[#C6DCFA] font-medium text-xs px-2.5 py-0.5 rounded-full">
            🔹 En proceso
          </Badge>
        );
      case "Respondida":
        return (
          <Badge variant="outline" className="bg-[#E6F6ED] text-[#1E7E4E] border-[#C3EBD4] font-medium text-xs px-2.5 py-0.5 rounded-full">
            🔹 Respondida
          </Badge>
        );
      case "Cancelada":
        return (
          <Badge variant="outline" className="bg-[#FDE8E8] text-[#C53030] border-[#F9C3C3] font-medium text-xs px-2.5 py-0.5 rounded-full">
            🔸 Cancelada
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground text-xs px-2.5 py-0.5 rounded-full">
            {status}
          </Badge>
        );
    }
  };

  return (
    <Card className="border border-border/80 shadow-2xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="font-heading text-lg font-semibold text-foreground">
          Últimas cotizaciones
        </CardTitle>
        <Link
          href="/admin/cotizaciones"
          className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          Ver todas <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {rows.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No hay cotizaciones recientes registradas.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border/60">
                <TableHead className="w-[100px] text-xs font-semibold text-muted-foreground">#</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground">Cliente</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground">Fecha</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground">Total</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground">Estado</TableHead>
                <TableHead className="text-right text-xs font-semibold text-muted-foreground">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/30 border-b border-border/40">
                  <TableCell className="font-mono text-xs font-semibold text-foreground">{row.code}</TableCell>
                  <TableCell className="text-xs font-medium text-foreground">{row.customerName}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{row.formattedDate}</TableCell>
                  <TableCell className="text-xs font-semibold text-foreground font-mono">{row.formattedTotal}</TableCell>
                  <TableCell>{getStatusBadge(row.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" asChild>
                        <Link href={`/admin/cotizaciones?id=${row.id}`}>
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

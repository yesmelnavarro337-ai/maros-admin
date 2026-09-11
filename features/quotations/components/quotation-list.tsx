"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContentCard } from "@/components/shared/content-card";
import { PageHeader } from "@/components/shared/page-header";
import { getQuotations } from "../services/quotations.service";
import { QuotationTable } from "./quotation-table";
import { QUOTATION_STATUSES } from "../types";
import type { Quotation, QuotationStatus } from "../types";

export function QuotationList() {
  const router = useRouter();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<QuotationStatus | "todos">("todos");

useEffect(() => {
  getQuotations().then((data) => {
    setQuotations(data);
    setLoading(false);
  });
}, []);

  function openDetail(id: string) {
    router.push(`/admin/cotizaciones/${id}`);
  }

  const filtered =
    statusFilter === "todos" ? quotations : quotations.filter((q) => q.status === statusFilter);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Cotizaciones" subtitle="Solicitudes recibidas desde el sitio público" />

      <ContentCard
        noPadding
        toolbar={
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as QuotationStatus | "todos")}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              {QUOTATION_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      >
        {loading ? (
          <div className="p-5">
            <Skeleton className="h-72 w-full rounded-lg" />
          </div>
        ) : (
          <QuotationTable quotations={filtered} onRowClick={(q) => openDetail(q.id)} />
        )}
      </ContentCard>
    </div>
  );
}
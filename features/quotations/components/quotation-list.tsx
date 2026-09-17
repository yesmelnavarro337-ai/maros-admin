"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, ChevronLeft, ChevronRight, RefreshCw, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getQuotationsPaged } from "../services/quotations.service";
import { QuotationTable } from "./quotation-table";
import { QUOTATION_STATUSES } from "../types";
import type { Quotation, QuotationStatus, PagedQuotations } from "../types";

export function QuotationList() {
  const router = useRouter();
  const [data, setData] = useState<PagedQuotations>({
    items: [],
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<QuotationStatus | "todos">("todos");
  const [page, setPage] = useState(1);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const loadQuotations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getQuotationsPaged({
        status: statusFilter,
        search: debouncedSearch,
        pageNumber: page,
        pageSize: 10,
      });
      setData(res);
    } catch {
      setData({ items: [], pageNumber: 1, pageSize: 10, totalCount: 0, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, debouncedSearch, page]);

  useEffect(() => {
    loadQuotations();
  }, [loadQuotations]);

  function openDetail(id: string) {
    router.push(`/admin/cotizaciones/${id}`);
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-10">
      {/* Header with Playfair/Serif font */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground font-serif">
            Cotizaciones
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona las solicitudes de cotización recibidas desde la tienda y WhatsApp.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadQuotations()}
            disabled={loading}
            className="h-9 gap-2 text-xs font-medium"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-4 rounded-xl border border-border/60 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente, email o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background h-10 border-border/80 focus-visible:ring-primary/20 text-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0 hidden sm:inline-block" />
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v as QuotationStatus | "todos");
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px] h-10 bg-background border-border/80 text-sm">
                <SelectValue placeholder="Estado" />
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
          </div>
        </div>
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="bg-card rounded-xl border border-border/60 p-6 space-y-4">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
        </div>
      ) : (
        <div className="space-y-4">
          <QuotationTable quotations={data.items} onRowClick={(q) => openDetail(q.id)} />

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-2">
            <p className="text-xs text-muted-foreground">
              Mostrando <span className="font-semibold text-foreground">{data.items.length}</span> de{" "}
              <span className="font-semibold text-foreground">{data.totalCount}</span> cotizaciones
            </p>

            {data.totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  className="h-8 text-xs gap-1"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Anterior
                </Button>

                <span className="text-xs font-medium px-2 text-foreground">
                  Página {data.pageNumber} de {data.totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  disabled={page === data.totalPages || loading}
                  className="h-8 text-xs gap-1"
                >
                  Siguiente
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
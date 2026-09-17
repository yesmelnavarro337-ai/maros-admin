"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, RefreshCw, Filter, ChevronLeft, ChevronRight } from "lucide-react";
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
import { getClientsPaged, getCitiesList } from "../services/clients.service";
import { ClientTable } from "./client-table";
import { ClientFormModal } from "./client-form-modal";
import type { Client, PagedClients } from "../types";

export function ClientList() {
  const router = useRouter();
  const [data, setData] = useState<PagedClients>({
    items: [],
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [cityFilter, setCityFilter] = useState<string>("todas");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [page, setPage] = useState(1);
  const [cities, setCities] = useState<string[]>(["Valledupar"]);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  useEffect(() => {
    getCitiesList().then(setCities);
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const loadClients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getClientsPaged({
        search: debouncedSearch,
        status: statusFilter,
        city: cityFilter,
        sortBy,
        pageNumber: page,
        pageSize: 10,
      });
      setData(res);
    } catch {
      setData({ items: [], pageNumber: 1, pageSize: 10, totalCount: 0, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, cityFilter, sortBy, page]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  function openDetail(client: Client) {
    router.push(`/admin/clientes/${client.id}`);
  }

  function handleCreateNew() {
    setClientToEdit(null);
    setModalOpen(true);
  }

  function handleEdit(client: Client) {
    setClientToEdit(client);
    setModalOpen(true);
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12">
      {/* Header with Serif typography */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">
            Clientes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Historial de clientes de Maro's Pijamas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadClients()}
            disabled={loading}
            className="h-9 gap-2 text-xs font-medium"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <Button
            size="sm"
            onClick={handleCreateNew}
            className="h-9 gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium shadow-sm text-xs"
          >
            <Plus className="h-4 w-4" />
            + Nuevo cliente
          </Button>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-card p-4 rounded-xl border border-border/60 shadow-xs">
        <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, teléfono, correo o ciudad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background h-10 border-border/80 focus-visible:ring-primary/20 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0 hidden sm:inline-block" />
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full h-10 bg-background border-border/80 text-sm">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="inactive">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select
          value={cityFilter}
          onValueChange={(v) => {
            setCityFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full h-10 bg-background border-border/80 text-sm">
            <SelectValue placeholder="Ciudad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las ciudades</SelectItem>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(v) => {
            setSortBy(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full h-10 bg-background border-border/80 text-sm">
            <SelectValue placeholder="Orden" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Más recientes</SelectItem>
            <SelectItem value="name">Nombre (A-Z)</SelectItem>
            <SelectItem value="date">Fecha de registro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="bg-card rounded-xl border border-border/60 p-6 space-y-4">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
        </div>
      ) : (
        <div className="space-y-4">
          <ClientTable
            clients={data.items}
            onViewDetail={openDetail}
            onEdit={handleEdit}
          />

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-2">
            <p className="text-xs text-muted-foreground">
              Mostrando{" "}
              <span className="font-semibold text-foreground">
                {data.items.length > 0 ? (data.pageNumber - 1) * data.pageSize + 1 : 0} -{" "}
                {Math.min(data.pageNumber * data.pageSize, data.totalCount)}
              </span>{" "}
              de <span className="font-semibold text-foreground">{data.totalCount}</span> clientes
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

                <span className="text-xs font-medium px-2.5 py-1 rounded bg-muted/60 text-foreground border border-border/60">
                  {data.pageNumber} / {data.totalPages}
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

      {/* Create / Edit Modal */}
      <ClientFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        clientToEdit={clientToEdit}
        onSuccess={loadClients}
      />
    </div>
  );
}
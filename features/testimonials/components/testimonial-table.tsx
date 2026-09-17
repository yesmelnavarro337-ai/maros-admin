"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight, Loader2, Quote } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StarRating } from "./star-rating";
import { TestimonialSheet } from "./testimonial-sheet";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../services/testimonials.service";
import type { Testimonial, TestimonialStatus, PagedTestimonials } from "../types";

function getInitials(name: string): string {
  if (!name) return "CL";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
}

export function TestimonialTable() {
  const [data, setData] = useState<PagedTestimonials>({
    items: [],
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [page, setPage] = useState(1);

  // Sheet & Dialog state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTestimonials({
        search: search.trim() || undefined,
        status: statusFilter,
        page,
        pageSize: 10,
      });
      setData(res);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al cargar los testimonios.");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleCreateNew = () => {
    setEditingTestimonial(null);
    setSheetOpen(true);
  };

  const handleEdit = (t: Testimonial) => {
    setEditingTestimonial(t);
    setSheetOpen(true);
  };

  const handleSave = async (formData: {
    clientName: string;
    city?: string;
    rating: number;
    quote: string;
    avatarUrl?: string;
    status: TestimonialStatus;
    publishDate: string;
  }) => {
    if (editingTestimonial) {
      await updateTestimonial(editingTestimonial.id, formData);
      toast.success("Testimonio actualizado correctamente.");
    } else {
      await createTestimonial(formData);
      toast.success("Testimonio creado correctamente.");
    }
    fetchTestimonials();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await deleteTestimonial(deletingId);
      toast.success("Testimonio eliminado correctamente.");
      setDeletingId(null);
      fetchTestimonials();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar testimonio.");
    }
  };

  const fromCount = data.totalCount === 0 ? 0 : (data.pageNumber - 1) * data.pageSize + 1;
  const toCount = Math.min(data.pageNumber * data.pageSize, data.totalCount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading font-serif text-2xl font-bold tracking-tight text-[#34351f]">
            Testimonios
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gestiona los testimonios de clientes
          </p>
        </div>
        <Button
          onClick={handleCreateNew}
          className="bg-[#4a5833] hover:bg-[#3d492a] text-white font-medium rounded-md shadow-xs self-start sm:self-auto gap-2"
        >
          <Plus className="h-4 w-4" />
          Nuevo testimonio
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-card p-4 rounded-xl border border-border">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 items-stretch sm:items-center">
          {/* Search Input with Magnifying Glass */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Buscar testimonios..."
              className="pl-9 bg-white border-[#EBE9DF] focus-visible:ring-[#4a5833]"
            />
          </div>

          {/* Status Filter Dropdown */}
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px] bg-white border-[#EBE9DF] focus:ring-[#4a5833]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="publicado">Publicado</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-[#FAF9F5]">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[220px] font-semibold text-[#34351f]">Cliente</TableHead>
              <TableHead className="font-semibold text-[#34351f]">Comentario</TableHead>
              <TableHead className="w-[140px] font-semibold text-[#34351f]">Calificación</TableHead>
              <TableHead className="w-[120px] font-semibold text-[#34351f]">Fecha</TableHead>
              <TableHead className="w-[130px] font-semibold text-[#34351f]">Estado</TableHead>
              <TableHead className="w-[90px] text-right font-semibold text-[#34351f]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin text-[#4a5833]" />
                    <span className="text-sm">Cargando testimonios...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Quote className="h-8 w-8 text-[#9FA367] opacity-60" />
                    <p className="text-sm font-medium text-[#34351f]">No se encontraron testimonios.</p>
                    <p className="text-xs text-muted-foreground">Intenta ajustar los filtros de búsqueda o agrega uno nuevo.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.items.map((t) => (
                <TableRow key={t.id} className="hover:bg-[#FAF9F5]/60 transition-colors">
                  {/* Cliente */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-[#EBE9DF] shrink-0">
                        {t.avatarUrl && <AvatarImage src={t.avatarUrl} alt={t.clientName} />}
                        <AvatarFallback className="bg-[#9FA367] text-white font-semibold text-xs">
                          {getInitials(t.clientName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#34351f] truncate leading-tight">
                          {t.clientName}
                        </p>
                        {t.city && (
                          <p className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">
                            {t.city}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Comentario */}
                  <TableCell>
                    <p className="text-sm text-[#34351f]/90 line-clamp-2 max-w-md">
                      &quot;{t.quote}&quot;
                    </p>
                  </TableCell>

                  {/* Calificación */}
                  <TableCell>
                    <StarRating value={t.rating} readOnly size="sm" />
                  </TableCell>

                  {/* Fecha */}
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(t.publishDate)}
                  </TableCell>

                  {/* Estado */}
                  <TableCell>
                    {t.status === "publicado" ? (
                      <Badge className="bg-[#4a5833] text-white hover:bg-[#3d492a] border-0 font-medium px-2.5 py-0.5 rounded-md">
                        Publicado
                      </Badge>
                    ) : (
                      <Badge className="bg-[#EBE9DF] text-[#666459] hover:bg-[#e0ded4] border-0 font-medium px-2.5 py-0.5 rounded-md">
                        Pendiente
                      </Badge>
                    )}
                  </TableCell>

                  {/* Acciones */}
                  <TableCell className="text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(t)}
                        title="Editar testimonio"
                        className="h-8 w-8 text-[#34351f] hover:bg-[#F2F2EC]"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingId(t.id)}
                        title="Eliminar testimonio"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Footer / Paginación */}
        {!loading && data.totalCount > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-border bg-[#FAF9F5] text-xs text-muted-foreground">
            <div>
              Mostrando <span className="font-semibold text-[#34351f]">{fromCount}</span> -{" "}
              <span className="font-semibold text-[#34351f]">{toCount}</span> de{" "}
              <span className="font-semibold text-[#34351f]">{data.totalCount}</span> testimonios
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                disabled={!data.hasPreviousPage}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-8 w-8 bg-white border-[#EBE9DF] text-[#34351f] hover:bg-[#F2F2EC]"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={pageNum === data.pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                  className={`h-8 w-8 p-0 text-xs font-medium rounded-md ${
                    pageNum === data.pageNumber
                      ? "bg-[#4a5833] text-white hover:bg-[#3d492a]"
                      : "bg-white border-[#EBE9DF] text-[#34351f] hover:bg-[#F2F2EC]"
                  }`}
                >
                  {pageNum}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                disabled={!data.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
                className="h-8 w-8 bg-white border-[#EBE9DF] text-[#34351f] hover:bg-[#F2F2EC]"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Sheet para Nuevo / Editar */}
      <TestimonialSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        testimonial={editingTestimonial}
        onSave={handleSave}
      />

      {/* Dialog para Eliminar */}
      <ConfirmDialog
        open={Boolean(deletingId)}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title="¿Eliminar testimonio?"
        description="Esta acción eliminará permanentemente el testimonio seleccionado. Esta operación no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        destructive
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

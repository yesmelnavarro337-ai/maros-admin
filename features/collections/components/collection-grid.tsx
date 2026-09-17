"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, FolderKanban, Sparkles, ShoppingBag, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/lib/toast";
import { CollectionCard } from "./collection-card";
import { CollectionPreviewModal } from "./collection-preview-modal";
import { getCollections, deleteCollection } from "../services/collections.service";
import type { Collection } from "../types";

export function CollectionGrid({ initialCollections }: { initialCollections?: Collection[] }) {
  const [collections, setCollections] = useState<Collection[]>(initialCollections ?? []);
  const [loading, setLoading] = useState(!initialCollections);
  const [previewing, setPreviewing] = useState<Collection | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Collection | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [seasonFilter, setSeasonFilter] = useState<string>("todas");
  const [productFilter, setProductFilter] = useState<string>("todos");
  const [sortBy, setSortBy] = useState<string>("recientes");

  const fetchCollections = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCollections();
      setCollections(data);
    } catch {
      toast.error("Error al cargar las colecciones.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialCollections) fetchCollections();
  }, [initialCollections, fetchCollections]);

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteCollection(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" fue eliminada`);
      setDeleteTarget(null);
      fetchCollections();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar la colección.");
    }
  }

  // Calculated Metrics
  const totalCollections = collections.length;
  const activeCollections = collections.filter((c) => c.isActive ?? true).length;
  const totalAssignedProducts = collections.reduce((acc, c) => {
    const count = c.productsCount ?? c.productIds.length;
    return acc + count;
  }, 0);

  // Filtered & Sorted Collections
  const filteredCollections = useMemo(() => {
    return collections
      .filter((c) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = c.name.toLowerCase().includes(q);
          const matchDesc = c.description.toLowerCase().includes(q);
          if (!matchName && !matchDesc) return false;
        }

        // Status filter
        if (statusFilter === "activa" && !(c.isActive ?? true)) return false;
        if (statusFilter === "inactiva" && (c.isActive ?? true)) return false;

        // Season filter
        if (seasonFilter !== "todas") {
          const sName = (c.seasonName || "").toLowerCase();
          if (seasonFilter === "permanente" && !sName.includes("permanente")) return false;
          if (seasonFilter === "especial" && !sName.includes("especial")) return false;
          if (seasonFilter === "navidad" && !sName.includes("navidad")) return false;
        }

        // Products filter
        const pCount = c.productsCount ?? c.productIds.length;
        if (productFilter === "con_productos" && pCount === 0) return false;
        if (productFilter === "sin_productos" && pCount > 0) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "nombre") return a.name.localeCompare(b.name);
        if (sortBy === "productos") {
          const countA = a.productsCount ?? a.productIds.length;
          const countB = b.productsCount ?? b.productIds.length;
          return countB - countA;
        }
        // Default: recientes (by date or order)
        const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return dateB - dateA;
      });
  }, [collections, searchQuery, statusFilter, seasonFilter, productFilter, sortBy]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1C1917]">
            Colecciones
          </h1>
          <p className="text-sm text-[#71717A] mt-1">
            Organiza tus colecciones, temporadas y productos.
          </p>
        </div>

        <Button
          asChild
          className="bg-[#555A2B] hover:bg-[#454A23] text-white shadow-xs font-medium px-4 py-2 rounded-lg self-start sm:self-auto"
        >
          <Link href="/admin/colecciones/nueva">
            <Plus className="h-4 w-4 mr-2" />
            Nueva colección
          </Link>
        </Button>
      </div>

      {/* Metrics Horizontal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total Colecciones */}
        <div className="bg-card border border-border/60 rounded-xl p-4 flex items-center gap-4 shadow-2xs">
          <div className="h-10 w-10 rounded-lg bg-[#FAF9F5] text-[#555A2B] border border-[#EBE8DE] flex items-center justify-center shrink-0">
            <FolderKanban className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold text-[#1C1917]">{totalCollections}</span>
              <span className="text-sm text-[#71717A]">
                {totalCollections === 1 ? "colección" : "colecciones"}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Colecciones Activas */}
        <div className="bg-card border border-border/60 rounded-xl p-4 flex items-center gap-4 shadow-2xs">
          <div className="h-10 w-10 rounded-lg bg-[#FAF9F5] text-[#555A2B] border border-[#EBE8DE] flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold text-[#1C1917]">{activeCollections}</span>
              <span className="inline-flex items-center gap-1 bg-[#E8F5E9] text-[#166534] text-xs font-medium px-2 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                {activeCollections === 1 ? "activa" : "activas"}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Productos Asignados */}
        <div className="bg-card border border-border/60 rounded-xl p-4 flex items-center gap-4 shadow-2xs">
          <div className="h-10 w-10 rounded-lg bg-[#FAF9F5] text-[#555A2B] border border-[#EBE8DE] flex items-center justify-center shrink-0">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold text-[#1C1917]">{totalAssignedProducts}</span>
              <span className="text-sm text-[#71717A]">
                {totalAssignedProducts === 1 ? "producto asignado" : "productos asignados"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-card p-3 rounded-xl border border-border/60 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar colecciones..."
            className="pl-9 bg-[#FAF9F5]/60 border-border/60 focus-visible:bg-background"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {/* Status Dropdown */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px] bg-background border-border/60 text-xs">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Estado: Todos</SelectItem>
              <SelectItem value="activa">Activa</SelectItem>
              <SelectItem value="inactiva">Inactiva</SelectItem>
            </SelectContent>
          </Select>

          {/* Season Dropdown */}
          <Select value={seasonFilter} onValueChange={setSeasonFilter}>
            <SelectTrigger className="w-[130px] bg-background border-border/60 text-xs">
              <SelectValue placeholder="Temporada" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Temporada: Todas</SelectItem>
              <SelectItem value="permanente">Permanente</SelectItem>
              <SelectItem value="especial">Especial</SelectItem>
              <SelectItem value="navidad">Navidad</SelectItem>
            </SelectContent>
          </Select>

          {/* Product Filter Dropdown */}
          <Select value={productFilter} onValueChange={setProductFilter}>
            <SelectTrigger className="w-[130px] bg-background border-border/60 text-xs">
              <SelectValue placeholder="Productos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Productos: Todos</SelectItem>
              <SelectItem value="con_productos">Con productos</SelectItem>
              <SelectItem value="sin_productos">Sin productos</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Selector */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px] bg-background border-border/60 text-xs font-medium text-[#555A2B]">
              <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
              <SelectValue placeholder="Más recientes" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="recientes">Más recientes</SelectItem>
              <SelectItem value="nombre">Nombre (A-Z)</SelectItem>
              <SelectItem value="productos">Más productos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid View (3 Columns) */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3 p-4 border rounded-xl bg-card">
              <Skeleton className="aspect-[16/10] w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      ) : filteredCollections.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-card border border-border/60 rounded-xl">
          <FolderKanban className="h-10 w-10 text-muted-foreground/50 mb-3" />
          <h3 className="font-serif text-lg font-semibold text-[#1C1917]">No se encontraron colecciones</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            {searchQuery || statusFilter !== "todos"
              ? "Prueba cambiando los términos de búsqueda o los filtros aplicados."
              : "No hay colecciones creadas todavía. Haz clic en '+ Nueva colección' para crear la primera."}
          </p>
          {(searchQuery || statusFilter !== "todos" || seasonFilter !== "todas" || productFilter !== "todos") && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("todos");
                setSeasonFilter("todas");
                setProductFilter("todos");
              }}
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections.map((c) => (
            <CollectionCard
              key={c.id}
              collection={c}
              onPreview={() => setPreviewing(c)}
              onDelete={() => setDeleteTarget(c)}
            />
          ))}
        </div>
      )}

      {/* Preview Modal */}
      <CollectionPreviewModal
        collection={previewing}
        onOpenChange={(open) => !open && setPreviewing(null)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar colección"
        description={`¿Seguro que quieres eliminar "${deleteTarget?.name}"? Si esta colección tiene temporadas asociadas, el backend rechazará la eliminación.`}
        confirmText="Eliminar"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
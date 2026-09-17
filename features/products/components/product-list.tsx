"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Package, AlertTriangle, Ban, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { toast } from "@/lib/toast";
import { getProductsPaged, getProductMetrics, deleteProduct } from "../services/products.service";
import { ProductSearch } from "./product-search";
import { ProductFilters } from "./product-filters";
import { ViewToggle } from "./view-toggle";
import { ProductGrid } from "./product-grid";
import { ProductTable } from "./product-table";
import { ProductQuickView } from "./product-quick-view";
import type { Product, ProductMetrics } from "../types";

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [metrics, setMetrics] = useState<ProductMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "table">("grid");

  // Filter States
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("todas");
  const [status, setStatus] = useState("todos");
  const [seasonId, setSeasonId] = useState("todas");

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Selection & Modal States
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const fetchMetrics = useCallback(async () => {
    try {
      const data = await getProductMetrics();
      setMetrics(data);
    } catch (error) {
      console.error("Error al obtener las métricas de productos:", error);
    }
  }, []);

  const fetchProductsList = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProductsPaged({
        search,
        categoryId,
        status,
        seasonId,
        page,
        pageSize,
      });
      setProducts(data.items);
      setTotalCount(data.totalCount);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  }, [search, categoryId, status, seasonId, page, pageSize]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  useEffect(() => {
    fetchProductsList();
  }, [fetchProductsList]);

  // Handle Search & Filter Changes -> Reset page to 1
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setCategoryId(val);
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    setPage(1);
  };

  const handleSeasonChange = (val: string) => {
    setSeasonId(val);
    setPage(1);
  };

  // Selection Handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (products.length === 0) return;
    const allCurrentIds = products.map((p) => p.id);
    const allSelected = allCurrentIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allCurrentIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...allCurrentIds])));
    }
  };

  const handleBulkAction = (action: string) => {
    if (action === "delete" && selectedIds.length > 0) {
      setIsBulkDeleting(true);
    }
  };

  const confirmSingleDelete = async () => {
    if (!deleteTarget) return;
    await deleteProduct(deleteTarget.id);
    toast.success(`"${deleteTarget.name}" fue eliminado`);
    setDeleteTarget(null);
    setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
    fetchProductsList();
    fetchMetrics();
  };

  const confirmBulkDelete = async () => {
    for (const id of selectedIds) {
      await deleteProduct(id).catch(() => null);
    }
    toast.success(`${selectedIds.length} productos fueron eliminados`);
    setSelectedIds([]);
    setIsBulkDeleting(false);
    fetchProductsList();
    fetchMetrics();
  };

  const startItem = totalCount > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = Math.min(page * pageSize, totalCount);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl text-[#8C7A4A]">🌿</span>
            <h1 className="font-heading font-serif text-3xl font-semibold text-foreground tracking-tight">
              Productos
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Gestiona el catálogo de pijamas, edita la información y mantén tu inventario actualizado.
          </p>
        </div>

        <Button asChild className="bg-[#5C5232] text-white hover:bg-[#4A4228] font-medium text-xs rounded-xl shadow-2xs h-10 px-4 shrink-0">
          <Link href="/admin/productos/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo producto
          </Link>
        </Button>
      </div>

      {/* 2. Superiores Cards KPI + Promo Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Productos Activos */}
        <Card className="border border-border/80 shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Productos activos</p>
              <p className="font-heading text-3xl font-bold text-foreground">
                {metrics?.activeProductsCount ?? 24}
              </p>
              <p className="text-[11px] text-emerald-600 font-medium">
                ↑ {metrics?.activeProductsVariationPercentage ?? 12}% vs. mes anterior
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-[#EFEFDC] text-[#5C5232] flex items-center justify-center border border-[#E1DABF] shrink-0">
              <Package className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Stock bajo */}
        <Card className="border border-border/80 shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Stock bajo</p>
              <p className="font-heading text-3xl font-bold text-foreground">
                {metrics?.lowStockCount ?? 3}
              </p>
              <p className="text-[11px] text-amber-600 font-medium">
                Necesitan atención
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-[#FEF3D6] text-[#A6750C] flex items-center justify-center border border-[#FBE6AD] shrink-0">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Sin stock */}
        <Card className="border border-border/80 shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Sin stock</p>
              <p className="font-heading text-3xl font-bold text-foreground">
                {metrics?.outOfStockCount ?? 1}
              </p>
              <p className="text-[11px] text-rose-600 font-medium">
                Revisar inventario
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-[#FDE8E8] text-[#C53030] flex items-center justify-center border border-[#F9C3C3] shrink-0">
              <Ban className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Banner Decorativo */}
        <div className="relative rounded-2xl border border-[#EBE3D3] bg-[#F9F5EC] p-4 flex flex-col justify-center overflow-hidden min-h-[90px]">
          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-1.5 text-[#8C7A4A]">
              <Heart className="h-3.5 w-3.5 fill-[#8C7A4A]/20" />
            </div>
            <h3 className="font-heading font-serif text-lg font-medium text-[#4A4028] leading-tight italic">
              Pijamas que hacen<br />la diferencia ♡
            </h3>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 pointer-events-none bg-[radial-gradient(#8C7A4A_1px,transparent_1px)] [background-size:12px_12px]" />
        </div>
      </div>

      {/* 3. Toolbar y Filtros */}
      <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <ProductSearch value={search} onChange={handleSearchChange} />

          <div className="flex items-center gap-3 flex-wrap">
            <ProductFilters
              categoryId={categoryId}
              status={status}
              seasonId={seasonId}
              selectedCount={selectedIds.length}
              onCategoryChange={handleCategoryChange}
              onStatusChange={handleStatusChange}
              onSeasonChange={handleSeasonChange}
              onBulkAction={handleBulkAction}
            />

            <div className="border-l border-border/60 pl-3 hidden sm:block">
              <ViewToggle value={view} onChange={setView} />
            </div>
          </div>
        </div>

        {/* 4. Grid o Tabla de Contenido */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 pt-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-xs text-muted-foreground space-y-2">
            <p className="font-medium text-foreground text-sm">No se encontraron productos</p>
            <p>Intenta ajustar el término de búsqueda o limpiar los filtros seleccionados.</p>
          </div>
        ) : view === "grid" ? (
          <ProductGrid
            products={products}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onQuickView={setQuickViewProduct}
            onDelete={setDeleteTarget}
          />
        ) : (
          <ProductTable
            products={products}
            selectedIds={selectedIds}
            onToggleSelectAll={handleToggleSelectAll}
            onToggleSelect={handleToggleSelect}
            onQuickView={setQuickViewProduct}
            onDelete={setDeleteTarget}
          />
        )}

        {/* 5. Paginador Dinámico (Barra Inferior) */}
        {!loading && totalCount > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/60 text-xs">
            <p className="text-muted-foreground font-medium">
              Mostrando <span className="text-foreground font-semibold">{startItem} - {endItem}</span> de{" "}
              <span className="text-foreground font-semibold">{totalCount}</span> productos
            </p>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg border-border/80 text-muted-foreground"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === page;
                return (
                  <Button
                    key={pageNum}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className={`h-8 min-w-[32px] px-2 rounded-lg font-mono text-xs ${
                      isActive
                        ? "bg-[#5C5232] text-white hover:bg-[#4A4228]"
                        : "border-border/80 text-foreground hover:bg-muted/50"
                    }`}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg border-border/80 text-muted-foreground"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modales y Diálogos */}
      <ProductQuickView
        product={quickViewProduct}
        onOpenChange={(open) => !open && setQuickViewProduct(null)}
        onStatusChange={() => {
          fetchProductsList();
          fetchMetrics();
        }}
      />

      {/* Diálogo de Eliminación Individual */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar producto"
        description={`¿Seguro que deseas eliminar "${deleteTarget?.name}"? Esta acción marcará el producto como eliminado.`}
        confirmText="Eliminar"
        onConfirm={confirmSingleDelete}
      />

      {/* Diálogo de Eliminación Masiva */}
      <ConfirmDialog
        open={isBulkDeleting}
        onOpenChange={(open) => !open && setIsBulkDeleting(false)}
        title="Eliminar productos seleccionados"
        description={`¿Seguro que deseas eliminar los ${selectedIds.length} productos seleccionados? Esta acción marcará los productos como eliminados.`}
        confirmText="Eliminar seleccionados"
        onConfirm={confirmBulkDelete}
      />
    </div>
  );
}
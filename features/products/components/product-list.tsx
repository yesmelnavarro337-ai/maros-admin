"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ContentCard } from "@/components/shared/content-card";
import { PageHeader } from "@/components/shared/page-header";
import { toast } from "@/lib/toast";
import { getProducts, deleteProduct } from "../services/products.service";
import { ProductSearch } from "./product-search";
import { ProductFilters } from "./product-filters";
import { ViewToggle } from "./view-toggle";
import { ProductGrid } from "./product-grid";
import { ProductTable } from "./product-table";
import { ProductQuickView } from "./product-quick-view";
import type { Product, ProductStatus } from "../types";

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("todas");
  const [status, setStatus] = useState<ProductStatus | "todos">("todos");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const data = await getProducts({ search, categoryId, status });
    setProducts(data);
    setLoading(false);
}, [search, categoryId, status]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function confirmDelete() {
    if (!deleteTarget) return;
    await deleteProduct(deleteTarget.id);
    toast.success(`"${deleteTarget.name}" fue eliminado`);
    setDeleteTarget(null);
    fetchProducts();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Productos"
        subtitle="Gestiona el catálogo de Maro's Pijamas"
        action={
          <Button asChild>
            <Link href="/admin/productos/nuevo">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo producto
            </Link>
          </Button>
        }
      />

      <ContentCard
        noPadding
        toolbar={
          <>
            <div className="flex items-center gap-3 flex-wrap">
              <ProductSearch value={search} onChange={setSearch} />
<ProductFilters
  categoryId={categoryId}
  status={status}
  onCategoryChange={setCategoryId}
  onStatusChange={setStatus}
/>
            </div>
            <ViewToggle value={view} onChange={setView} />
          </>
        }
      >
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            No se encontraron productos con esos filtros.
          </p>
        ) : view === "grid" ? (
          <div className="p-5">
            <ProductGrid products={products} onQuickView={setQuickViewProduct} onDelete={setDeleteTarget} />
          </div>
        ) : (
          <ProductTable products={products} onQuickView={setQuickViewProduct} onDelete={setDeleteTarget} />
        )}
      </ContentCard>

      <ProductQuickView
        product={quickViewProduct}
        onOpenChange={(open) => !open && setQuickViewProduct(null)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar producto"
        description={`¿Seguro que quieres eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
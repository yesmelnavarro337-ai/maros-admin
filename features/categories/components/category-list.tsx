"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Eye, Search, LayoutGrid, LayoutList, Tag, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ContentCard } from "@/components/shared/content-card";
import { PageHeader } from "@/components/shared/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../services/categories.service";
import { getProducts } from "@/features/products/services/products.service";
import type { Category } from "../types";
import type { Product } from "@/features/products/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryDialog } from "./category-dialog";

const PAGE_SIZE = 10;

type ViewMode = "table" | "grid";

function CategoryIcon({ imageUrl, name }: { imageUrl?: string | null; name: string }) {
  if (imageUrl) {
    return (
      <div className="h-9 w-9 rounded-md overflow-hidden border border-border flex-shrink-0">
        <Image src={imageUrl} alt={name} width={36} height={36} className="object-cover h-full w-full" />
      </div>
    );
  }
  return (
    <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center flex-shrink-0 border border-border">
      <Tag className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [page, setPage] = useState(1);
  const router = useRouter();

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar las categorías.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return categories;
    return categories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    );
  }, [categories, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  async function handleSave(name: string) {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, { name });
        toast.success("Categoría actualizada correctamente");
      } else {
        await createCategory({ name });
        toast.success("Categoría creada correctamente");
      }
      router.refresh();
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar.");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      const allProducts = await getProducts();
      const linked = allProducts.filter((p: Product) => p.categoryId === deleteTarget.id);
      if (linked.length > 0) {
        toast.error(
          `No se puede eliminar la categoría "${deleteTarget.name}" porque tiene ${linked.length} producto(s) asignado(s). Desvínculalos primero.`
        );
        setDeleteTarget(null);
        return;
      }
      await deleteCategory(deleteTarget.id);
      toast.success("Categoría eliminada correctamente");
      setDeleteTarget(null);
      router.refresh();
      refresh();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "No se pudo eliminar.";
      toast.error(msg);
      setDeleteTarget(null);
    }
  }

  const start = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, filtered.length);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Categorías"
        subtitle="Organiza los productos del catálogo público."
        action={
          <Button id="btn-nueva-categoria" onClick={() => { setEditingCategory(null); setDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva categoría
          </Button>
        }
      />

      <ContentCard noPadding>
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 px-4 py-3 border-b border-border">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="input-buscar-categoria"
              placeholder="Buscar categoría..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <Button
              id="btn-vista-grid"
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
              title="Vista cuadrícula"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              id="btn-vista-tabla"
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("table")}
              title="Vista tabla"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-4 flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-sm">
            {search ? "No hay categorías que coincidan con la búsqueda." : "Aún no hay categorías. Crea la primera."}
          </div>
        ) : viewMode === "table" ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10" />
                <TableHead>Nombre</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-center">Productos</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell><CategoryIcon imageUrl={cat.imageUrl} name={cat.name} /></TableCell>
                  <TableCell className="font-medium text-foreground">
                    <Link href={`/admin/categorias/${cat.id}`} className="hover:underline hover:text-primary transition-colors">
                      {cat.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">/{cat.slug}</TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                      <Package className="h-3.5 w-3.5" />{cat.productsCount}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={cat.isActive ? "default" : "secondary"}
                      className={cat.isActive ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" : ""}
                    >
                      {cat.isActive ? "Activa" : "Inactiva"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" asChild title="Ver / Editar">
                        <Link href={`/admin/categorias/${cat.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" asChild title="Editar">
                        <Link href={`/admin/categorias/${cat.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteTarget(cat)}
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          // Grid view
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {paginated.map((cat) => (
              <div
                key={cat.id}
                className="group flex flex-col gap-2 rounded-lg border border-border bg-card p-3 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-center h-16 rounded-md bg-muted overflow-hidden">
                  {cat.imageUrl ? (
                    <Image src={cat.imageUrl} alt={cat.name} width={64} height={64} className="object-cover h-full w-full" />
                  ) : (
                    <Tag className="h-7 w-7 text-muted-foreground" />
                  )}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-sm text-foreground line-clamp-1">{cat.name}</span>
                  <span className="text-xs text-muted-foreground font-mono line-clamp-1">/{cat.slug}</span>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <Badge
                    variant={cat.isActive ? "default" : "secondary"}
                    className={`text-xs ${cat.isActive ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" : ""}`}
                  >
                    {cat.isActive ? "Activa" : "Inactiva"}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                    <Package className="h-3 w-3" />{cat.productsCount}
                  </span>
                </div>
                <div className="flex items-center gap-1 pt-1 border-t border-border">
                  <Button size="icon" variant="ghost" className="h-7 w-7 flex-1" asChild title="Ver / Editar">
                    <Link href={`/admin/categorias/${cat.id}`}>
                      <Eye className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 flex-1" asChild title="Editar">
                    <Link href={`/admin/categorias/${cat.id}`}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 flex-1 text-muted-foreground hover:text-destructive"
                    onClick={() => setDeleteTarget(cat)}
                    title="Eliminar"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination footer */}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border text-sm text-muted-foreground">
            <span>Mostrando {start} - {end} de {filtered.length} categorías</span>
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ‹
              </Button>
              <span className="px-2 text-xs font-medium">{page} / {totalPages}</span>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                ›
              </Button>
            </div>
          </div>
        )}
      </ContentCard>

      <CategoryDialog open={dialogOpen} onOpenChange={setDialogOpen} editingCategory={editingCategory} onSave={handleSave} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar categoría"
        description={`¿Seguro que quieres eliminar "${deleteTarget?.name}"?`}
        confirmText="Eliminar"
        onConfirm={confirmDelete}
      />
    
    </div>
  );
}
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Search, CheckSquare, Square, Save, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContentCard } from "@/components/shared/content-card";
import { PageHeader } from "@/components/shared/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CategoryDialog } from "./category-dialog";
import { toast } from "@/lib/toast";

import { revalidateWeb } from "@/lib/api/revalidate-web";
import { getCategoryById, updateCategory } from "../services/categories.service";
import { getProducts, updateProduct, toSavePayload } from "@/features/products/services/products.service";

import type { Category } from "../types";
import type { Product } from "@/features/products/types";

interface CategoryDetailViewProps {
  categoryId: string;
}

export function CategoryDetailView({ categoryId }: CategoryDetailViewProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [assignedSet, setAssignedSet] = useState<Set<string>>(new Set());
  const [initialAssignedSet, setInitialAssignedSet] = useState<Set<string>>(new Set());

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [catData, prodsData] = await Promise.all([
        getCategoryById(categoryId),
        getProducts(),
      ]);

      if (!catData) {
        toast.error("No se encontró la categoría especificada.");
        setLoading(false);
        return;
      }

      setCategory(catData);
      setAllProducts(prodsData);

      const assignedIds = new Set(
        prodsData.filter((p) => p.categoryId === categoryId).map((p) => p.id)
      );
      setAssignedSet(new Set(assignedIds));
      setInitialAssignedSet(new Set(assignedIds));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al cargar la categoría.");
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtrado de productos por nombre o SKU
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return allProducts;
    const query = searchQuery.toLowerCase().trim();
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.variants.some((v) => v.sku.toLowerCase().includes(query))
    );
  }, [allProducts, searchQuery]);

  // Determinar si hay cambios pendientes
  const hasChanges = useMemo(() => {
    if (assignedSet.size !== initialAssignedSet.size) return true;
    for (const id of assignedSet) {
      if (!initialAssignedSet.has(id)) return true;
    }
    return false;
  }, [assignedSet, initialAssignedSet]);

  const allFilteredSelected = useMemo(() => {
    if (filteredProducts.length === 0) return false;
    return filteredProducts.every((p) => assignedSet.has(p.id));
  }, [filteredProducts, assignedSet]);

  const someFilteredSelected = useMemo(() => {
    return filteredProducts.some((p) => assignedSet.has(p.id));
  }, [filteredProducts, assignedSet]);

  function handleToggleProduct(productId: string) {
    setAssignedSet((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  }

  function handleToggleSelectAll() {
    setAssignedSet((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        // Deseleccionar todos los filtrados
        filteredProducts.forEach((p) => next.delete(p.id));
      } else {
        // Seleccionar todos los filtrados
        filteredProducts.forEach((p) => next.add(p.id));
      }
      return next;
    });
  }

  async function handleSaveCategory(newName: string) {
    if (!category) return;
    try {
      await updateCategory(category.id, { name: newName });
      toast.success("Categoría actualizada correctamente");
      fetchData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al actualizar categoría.");
    }
  }

  async function executeSaveAssignments() {
    setConfirmSaveOpen(false);
    setSaving(true);

    try {
      // Identificar cuáles productos deben vincularse y cuáles desvincularse
      const toLink: Product[] = [];
      const toUnlink: Product[] = [];

      allProducts.forEach((p) => {
        const isCurrentlyAssignedInState = assignedSet.has(p.id);
        const wasAssignedInBackend = p.categoryId === categoryId;

        if (isCurrentlyAssignedInState && !wasAssignedInBackend) {
          toLink.push(p);
        } else if (!isCurrentlyAssignedInState && wasAssignedInBackend) {
          toUnlink.push(p);
        }
      });

      // Ejecutar actualizaciones
      const updates = [
        ...toLink.map((p) =>
          updateProduct(p.id, { ...toSavePayload(p), categoryId })
        ),
        ...toUnlink.map((p) =>
          updateProduct(p.id, { ...toSavePayload(p), categoryId: "" })
        ),
      ];

      await Promise.all(updates);
      revalidateWeb({ tag: "products" });
      revalidateWeb({ tag: "categories" });

      toast.success(
        `Asignación guardada: ${toLink.length} vinculados, ${toUnlink.length} desvinculados.`
      );
      fetchData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar asignaciones.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <p className="text-muted-foreground text-lg">No se encontró la categoría.</p>
        <Button asChild variant="outline">
          <Link href="/admin/categorias">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a categorías
          </Link>
        </Button>
      </div>
    );
  }

  const assignedCount = assignedSet.size;

  return (
    <div className="flex flex-col gap-6">
      {/* Header con botón de volver y acciones */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="h-9 w-9 shrink-0">
            <Link href="/admin/categorias" title="Volver a categorías">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-3xl text-foreground">{category.name}</h1>
              <Badge variant="outline" className="font-mono text-xs">
                /{category.slug}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Gestión de detalles y asignación de productos vinculados
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Editar categoría
          </Button>
        </div>
      </div>

      {/* Tarjeta Informativa Resumen */}
      <ContentCard>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-muted-foreground">Nombre de Categoría</span>
            <span className="text-base font-semibold text-foreground">{category.name}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-muted-foreground">Slug / Ruta</span>
            <span className="text-base font-mono text-foreground">/{category.slug}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-muted-foreground">Productos Vinculados</span>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <span className="text-base font-bold text-foreground">
                {assignedCount} {assignedCount === 1 ? "producto" : "productos"}
              </span>
            </div>
          </div>
        </div>
      </ContentCard>

      {/* Sección de Asignación y Desvinculación de Productos */}
      <ContentCard noPadding>
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Vincular / Desvincular Productos
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Selecciona o desmarca productos para ajustar la relación con esta categoría.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={() => setConfirmSaveOpen(true)}
              disabled={!hasChanges || saving}
              className="gap-2"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </div>

        {/* Barra de Filtro y Selección Masiva */}
        <div className="p-4 bg-muted/30 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar producto por nombre o SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? "encontrado" : "encontrados"}
            </span>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleToggleSelectAll}
              disabled={filteredProducts.length === 0}
            >
              {allFilteredSelected ? (
                <>
                  <Square className="h-4 w-4 mr-1.5" />
                  Deseleccionar todos
                </>
              ) : (
                <>
                  <CheckSquare className="h-4 w-4 mr-1.5" />
                  Seleccionar todos
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Tabla de Productos */}
        {filteredProducts.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">
            {searchQuery ? "No hay productos que coincidan con la búsqueda." : "No hay productos disponibles."}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">
                  <Checkbox
                    checked={allFilteredSelected}
                    onCheckedChange={handleToggleSelectAll}
                    aria-label="Seleccionar todos los productos filtrados"
                  />
                </TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Precio Base</TableHead>
                <TableHead>Estado de Categoría Actual</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const isSelected = assignedSet.has(product.id);
                const wasAssignedToThis = product.categoryId === categoryId;

                let categoryStatusText = "Sin categoría";
                let badgeVariant: "default" | "secondary" | "outline" = "outline";

                if (product.categoryId === categoryId) {
                  categoryStatusText = "Asignado a esta categoría";
                  badgeVariant = "default";
                } else if (product.categoryName) {
                  categoryStatusText = `Categoría: ${product.categoryName}`;
                  badgeVariant = "secondary";
                }

                return (
                  <TableRow
                    key={product.id}
                    className={isSelected ? "bg-accent/40" : undefined}
                  >
                    <TableCell className="text-center">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleToggleProduct(product.id)}
                        aria-label={`Seleccionar ${product.name}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      <div className="flex flex-col">
                        <span>{product.name}</span>
                        {product.variants[0]?.sku && (
                          <span className="text-xs font-mono text-muted-foreground">
                            SKU: {product.variants[0].sku}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">
                      ${product.basePrice.toLocaleString("es-CO")} COP
                    </TableCell>
                    <TableCell>
                      <Badge variant={badgeVariant} className="text-xs">
                        {categoryStatusText}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant={isSelected ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => handleToggleProduct(product.id)}
                      >
                        {isSelected ? "Desvincular" : "Vincular"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </ContentCard>

      {/* Diálogo de edición de nombre de categoría */}
      <CategoryDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        editingCategory={category}
        onSave={handleSaveCategory}
      />

      {/* Diálogo de confirmación para guardar cambios de asignación */}
      <ConfirmDialog
        open={confirmSaveOpen}
        onOpenChange={setConfirmSaveOpen}
        title="Confirmar cambios de asignación"
        description="¿Estás seguro de que deseas aplicar los cambios de vinculación y desvinculación de productos para esta categoría?"
        confirmText="Guardar cambios"
        destructive={false}
        onConfirm={executeSaveAssignments}
      />
    </div>
  );
}

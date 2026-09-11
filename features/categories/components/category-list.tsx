"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { toast } from "@/lib/toast";
import { CategoryDialog } from "./category-dialog";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categories.service";
import type { Category } from "../types";

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

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
    let active = true;
    getCategories()
      .then((data) => {
        if (active) setCategories(data);
      })
      .catch((error) => {
        if (active) toast.error(error instanceof Error ? error.message : "No se pudieron cargar las categorías.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleSave(name: string) {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, name);
        toast.success("Categoría actualizada");
      } else {
        await createCategory(name);
        toast.success("Categoría creada");
      }
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar.");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteCategory(deleteTarget.id);
      toast.success("Categoría eliminada");
      setDeleteTarget(null);
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-foreground">Categorías</h1>
          <p className="text-muted-foreground mt-1">Organiza los productos del catálogo público</p>
        </div>
        <Button onClick={() => { setEditingCategory(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva categoría
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full rounded-lg" />)}
        </div>
      ) : categories.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-16">
          Aún no hay categorías. Crea la primera para empezar a organizar tu catálogo.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium text-foreground">{category.name}</TableCell>
                <TableCell className="text-muted-foreground">/{category.slug}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => { setEditingCategory(category); setDialogOpen(true); }}
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteTarget(category)}
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
      )}

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
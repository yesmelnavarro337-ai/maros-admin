"use client";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { toast } from "@/lib/toast";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CatalogItemCard } from "./catalog-item-card";
import { CatalogItemDialog } from "./catalog-item-dialog";
import {
  createCatalogItem,
  updateCatalogItem,
  deleteCatalogItem,
} from "../services/customization.service";
import type { CatalogConfig, CatalogItem } from "../types";

interface CatalogGridProps {
  config: CatalogConfig;
  items: CatalogItem[];
  loading: boolean;
  onChanged: () => Promise<void>;
}

export function CatalogGrid({ config, items, loading, onChanged }: CatalogGridProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);

  function openCreate() {
    setEditingItem(null);
    setDialogOpen(true);
  }

  function openEdit(item: CatalogItem) {
    setEditingItem(item);
    setDialogOpen(true);
  }

async function handleSave(data: { name: string; image?: string; hex?: string; priceModifier?: number }) {
  try {
    if (editingItem) {
      await updateCatalogItem(editingItem.id, data);
      toast.success(`${config.singularLabel} actualizado correctamente`);
    } else {
      await createCatalogItem({ catalog: config.key, ...data });
      toast.success(`${config.singularLabel} creado correctamente`);
    }
    await onChanged();
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "No se pudo guardar.");
  }
}

const [deleteTarget, setDeleteTarget] = useState<CatalogItem | null>(null);

async function handleDelete(id: string) {
  const confirmed = window.confirm(`¿Eliminar este ${config.singularLabel}?`);
  if (confirmed) {
    try {
      await deleteCatalogItem(id);
      toast.success(`${config.singularLabel} eliminado`);
      await onChanged();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar.");
    }
  }
}
async function confirmDelete() {
  if (!deleteTarget) return;
  await deleteCatalogItem(deleteTarget.id);
  toast.success(`"${deleteTarget.name}" fue eliminado`);
  setDeleteTarget(null);
  await onChanged();
}

  return (
    <div className="flex flex-col gap-4 pt-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar {config.singularLabel}
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          Sin {config.label.toLowerCase()} registrados todavía.
        </p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item) => (
            <CatalogItemCard
              key={item.id}
              item={item}
              config={config}
              onEdit={() => openEdit(item)}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </div>
      )}

      
      <CatalogItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        config={config}
        editingItem={editingItem}
        onSave={handleSave}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Eliminar ${config.singularLabel}`}
        description={`¿Seguro que quieres eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        onConfirm={confirmDelete}
      />
    </div>
  );
}

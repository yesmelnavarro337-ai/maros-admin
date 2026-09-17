"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { toast } from "@/lib/toast";
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
  const [deleteTarget, setDeleteTarget] = useState<CatalogItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
      toast.error(error instanceof Error ? error.message : "No se pudo guardar la opción.");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteCatalogItem(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" fue eliminado`);
      setDeleteTarget(null);
      await onChanged();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar.");
    }
  }

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(q));
  }, [items, searchQuery]);

  return (
    <div className="flex flex-col gap-5 pt-2">
      {/* Header Controls & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/60 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Buscar en ${config.label.toLowerCase()}...`}
            className="pl-9 bg-[#FAF9F5]/60 border-border/60 text-xs"
          />
        </div>

        <Button
          onClick={openCreate}
          size="sm"
          className="bg-[#555A2B] hover:bg-[#454A23] text-white text-xs font-medium w-full sm:w-auto shadow-xs"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Agregar {config.singularLabel}
        </Button>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border/60 rounded-xl text-center bg-card">
          <Layers className="h-8 w-8 text-muted-foreground/40 mb-2" />
          <h3 className="font-serif text-base font-semibold text-[#1C1917]">
            Sin {config.label.toLowerCase()} registrados
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            {searchQuery
              ? "No se encontraron coincidencias para tu búsqueda."
              : `Haz clic en 'Agregar ${config.singularLabel}' para agregar el primero a la colección.`}
          </p>
          <Button onClick={openCreate} size="sm" variant="outline" className="mt-4 text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" />
            Agregar {config.singularLabel}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <CatalogItemCard
              key={item.id}
              item={item}
              config={config}
              onEdit={() => openEdit(item)}
              onDelete={() => setDeleteTarget(item)}
            />
          ))}
        </div>
      )}

      {/* Edit/Create Dialog */}
      <CatalogItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        config={config}
        editingItem={editingItem}
        onSave={handleSave}
      />

      {/* Confirm Delete Dialog */}
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

"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, ChevronUp, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { toast } from "@/lib/toast";
import { FaqStatusBadge } from "./faq-status-badge";
import { FaqDialog } from "./faq-dialog";
import {
  getFaqItems,
  createFaqItem,
  updateFaqItem,
  deleteFaqItem,
  reorderFaqItem,
} from "../services/faq.service";
import type { FaqItem, FaqStatus } from "../types";

export function FaqList() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FaqItem | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFaqItems();
      setItems(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar las preguntas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  async function handleSave(data: { question: string; answer: string; category: string; status: FaqStatus }) {
    try {
      if (editingItem) {
        await updateFaqItem(editingItem.id, data);
        toast.success("Pregunta actualizada");
      } else {
        await createFaqItem(data);
        toast.success("Pregunta creada");
      }
      fetchItems();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar.");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteFaqItem(deleteTarget.id);
      toast.success("Eliminado correctamente");
      setItems((current) => current.filter((item) => item.id !== deleteTarget.id));
      if (expandedId === deleteTarget.id) setExpandedId(null);
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar.");
    }
  }

  async function handleReorder(id: string, direction: "up" | "down") {
    try {
      await reorderFaqItem(id, direction);
      fetchItems();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo reordenar.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-foreground">Preguntas Frecuentes</h1>
          <p className="text-muted-foreground mt-1">Gestiona las preguntas frecuentes del sitio público</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva pregunta
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item, index) => (
            <div key={item.id} className="rounded-lg border border-border bg-card">
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer"
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs text-muted-foreground shrink-0">{item.category}</span>
                  <p className="text-sm text-foreground truncate">{item.question}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <FaqStatusBadge status={item.status} />
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleReorder(item.id, "up")} disabled={index === 0}>
                    <ChevronUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleReorder(item.id, "down")} disabled={index === items.length - 1}>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditingItem(item); setDialogOpen(true); }}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setDeleteTarget(item)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              {expandedId === item.id && (
                <div className="px-4 pb-3 text-sm text-muted-foreground border-t border-border pt-3">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <FaqDialog open={dialogOpen} onOpenChange={setDialogOpen} editingItem={editingItem} onSave={handleSave} />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar pregunta"
        description={`¿Seguro que quieres eliminar "${deleteTarget?.question}"?`}
        confirmText="Eliminar"
        onConfirm={confirmDelete}
      />
    </div>
  );
}

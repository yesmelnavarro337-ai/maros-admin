"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { PageHeader } from "@/components/shared/page-header";
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

  const fetchCollections = useCallback(async () => {
    setLoading(true);
    const data = await getCollections();
    setCollections(data);
    setLoading(false);
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

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Colecciones"
        subtitle="Gestiona las colecciones y sus productos asignados"
        action={
          <Button asChild>
            <Link href="/admin/colecciones/nueva">
              <Plus className="h-4 w-4 mr-2" />
              Nueva colección
            </Link>
          </Button>
        }
      />

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[16/9] rounded-lg" />
          ))}
        </div>
      ) : collections.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">
          Sin colecciones todavía. Crea la primera.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {collections.map((c) => (
            <CollectionCard
              key={c.id}
              collection={c}
              onPreview={() => setPreviewing(c)}
              onDelete={() => setDeleteTarget(c)}
            />
          ))}
        </div>
      )}

      <CollectionPreviewModal
        collection={previewing}
        onOpenChange={(open) => !open && setPreviewing(null)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar colección"
        description={`¿Seguro que quieres eliminar "${deleteTarget?.name}"? Si tiene temporadas asociadas, el backend rechazará la eliminación.`}
        confirmText="Eliminar"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
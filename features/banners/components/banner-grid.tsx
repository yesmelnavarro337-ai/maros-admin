"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { toast } from "@/lib/toast";
import { BannerCard } from "./banner-card";
import { BannerDialog } from "./banner-dialog";
import { getBanners, createBanner, updateBanner, deleteBanner } from "../services/banners.service";
import type { Banner } from "../types";

export function BannerGrid() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBanners();
      setBanners(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar los banners.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  async function handleSave(data: {
    title: string;
    image?: string;
    linkUrl: string;
    position: string;
    startDate?: string;
    endDate?: string;
    seasonId?: string;
    collectionId?: string;
  }) {
    try {
      if (editingBanner) {
        await updateBanner(editingBanner.id, { ...data, active: editingBanner.active });
        toast.success("Banner actualizado");
      } else {
        await createBanner({ ...data, active: true });
        toast.success("Banner creado");
      }
      fetchBanners();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar el banner.");
    }
  }

  async function handleToggleActive(banner: Banner, active: boolean) {
    try {
      await updateBanner(banner.id, {
        title: banner.title,
        image: banner.image,
        linkUrl: banner.linkUrl,
        position: banner.position,
        active,
        startDate: banner.startDate,
        endDate: banner.endDate,
        seasonId: banner.seasonId,
        collectionId: banner.collectionId,
      });
      toast.success(active ? "Banner activado" : "Banner desactivado");
      fetchBanners();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar.");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteBanner(deleteTarget.id);
      toast.success("Banner eliminado");
      setDeleteTarget(null);
      fetchBanners();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-foreground">Banners</h1>
          <p className="text-muted-foreground mt-1">Administra los banners promocionales del sitio</p>
        </div>
        <Button onClick={() => { setEditingBanner(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo banner
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-lg" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {banners.map((b) => (
            <BannerCard
              key={b.id}
              banner={b}
              onEdit={() => { setEditingBanner(b); setDialogOpen(true); }}
              onDelete={() => setDeleteTarget(b)}
              onToggleActive={(active) => handleToggleActive(b, active)}
            />
          ))}
        </div>
      )}

      <BannerDialog open={dialogOpen} onOpenChange={setDialogOpen} editingBanner={editingBanner} onSave={handleSave} />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar banner"
        description={`¿Seguro que quieres eliminar "${deleteTarget?.title}"?`}
        confirmText="Eliminar"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
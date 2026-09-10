"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, ImageOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { toast } from "@/lib/toast";
import { GalleryCategoryTabs } from "./gallery-category-tabs";
import { GalleryUploadDialog } from "./gallery-upload-dialog";
import { getGalleryImages, addGalleryImage, deleteGalleryImage } from "../services/gallery.service";
import type { GalleryImage, GalleryCategory } from "../types";

export function GalleryGrid() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<GalleryCategory | "todas">("todas");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getGalleryImages(categoryFilter === "todas" ? undefined : categoryFilter);
      setImages(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo cargar la galería.");
    } finally {
      setLoading(false);
    }
  }, [categoryFilter]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  async function handleSave(file: File, category: GalleryCategory, caption: string) {
    try {
      await addGalleryImage(file, category, caption);
      toast.success("Imagen agregada a la galería");
      fetchImages();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo subir la imagen.");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteGalleryImage(deleteTarget.id);
      toast.success("Imagen eliminada");
      setDeleteTarget(null);
      fetchImages();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-3xl text-foreground">Galería</h1>
          <p className="text-muted-foreground mt-1">Administra las imágenes de la galería</p>
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Subir imágenes
        </Button>
      </div>

      <GalleryCategoryTabs value={categoryFilter} onChange={setCategoryFilter} />

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
        </div>
      ) : images.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">Sin imágenes en esta categoría todavía.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden bg-secondary group">
              {img.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center px-3 text-center">
                  <ImageOff className="h-5 w-5 text-muted-foreground shrink-0" />
                  <p className="text-xs text-muted-foreground ml-2 line-clamp-3">{img.caption}</p>
                </div>
              )}
              <button
                onClick={() => setDeleteTarget(img)}
                className="absolute top-1.5 right-1.5 bg-background/90 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </button>
            </div>
          ))}
        </div>
      )}

      <GalleryUploadDialog open={uploadOpen} onOpenChange={setUploadOpen} onSave={handleSave} />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar imagen"
        description="¿Seguro que quieres eliminar esta imagen de la galería?"
        confirmText="Eliminar"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
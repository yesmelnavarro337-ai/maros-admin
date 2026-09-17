"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Trash2,
  Image as ImageIcon,
  Info,
  ShoppingBag,
  AlertTriangle,
  Eye,
  Clock,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { SingleImageUploader } from "@/components/shared/single-image-uploader";
import { AssignedProductsTable } from "./assigned-products-table";
import {
  updateCollection,
  setDefaultCollection,
  deleteCollection,
} from "../services/collections.service";
import { toast } from "@/lib/toast";
import type { Collection } from "../types";

export function CollectionForm({ collection }: { collection: Collection }) {
  const router = useRouter();
  const [name, setName] = useState(collection.name);
  const [description, setDescription] = useState(collection.description);
  const [coverImage, setCoverImage] = useState<string | undefined>(collection.coverImage);
  const [productIds, setProductIds] = useState<string[]>(collection.productIds ?? []);
  const [accentHex] = useState(collection.accentHex || "#555A2B");

  const [saving, setSaving] = useState(false);
  const [settingDefault, setSettingDefault] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Unsaved changes detection
  const isDirty = useMemo(() => {
    if (name !== collection.name) return true;
    if (description !== collection.description) return true;
    if (coverImage !== collection.coverImage) return true;
    if (JSON.stringify(productIds.sort()) !== JSON.stringify([...(collection.productIds ?? [])].sort())) return true;
    return false;
  }, [name, description, coverImage, productIds, collection]);

  async function handleSave() {
    if (!name.trim()) {
      toast.error("El nombre de la colección es obligatorio.");
      return;
    }
    setSaving(true);
    try {
      await updateCollection(collection.id, { name, description, coverImage, productIds, accentHex });
      toast.success("Colección actualizada correctamente");
      router.push("/admin/colecciones");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar la colección.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSetDefault() {
    setSettingDefault(true);
    try {
      await setDefaultCollection(collection.id);
      toast.success(`"${collection.name}" es ahora la colección predeterminada`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo marcar como predeterminada.");
    } finally {
      setSettingDefault(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteCollection(collection.id);
      toast.success(`"${collection.name}" fue eliminada`);
      router.push("/admin/colecciones");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar. Verifica que no tenga temporadas asociadas."
      );
    }
  }

  // Format date helper (e.g. 12 sept. 2026 · 10:24 a. m.)
  const formatDateSpanish = (dateStr?: string) => {
    if (!dateStr) return "Sin fecha registrada";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Sin fecha registrada";

    const day = date.getDate();
    const months = ["sept.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic."];
    // exact Spanish month mapping
    const monthNames = [
      "ene.", "feb.", "mar.", "abr.", "may.", "jun.",
      "jul.", "ago.", "sept.", "oct.", "nov.", "dic."
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "p. m." : "a. m.";
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${day} ${month} ${year} · ${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-16">
      {/* Top Header & Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/admin/colecciones" className="hover:text-foreground flex items-center gap-1 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              Colecciones
            </Link>
            <span>/</span>
            <span className="font-medium text-foreground">{name || collection.name}</span>

            {isDirty && (
              <span className="ml-3 inline-flex items-center gap-1 text-[11px] text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                Cambios sin guardar
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-1">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1C1917]">
              {name || collection.name}
            </h1>
            {collection.isDefault && (
              <span className="bg-[#FAF5E6] text-[#555A2B] border border-[#E6DBB8] text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                <Star className="h-3 w-3 fill-[#555A2B]" />
                Predeterminada
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons Top Right */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/colecciones")}
            className="text-xs border-border/60"
          >
            Cancelar
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#555A2B] hover:bg-[#454A23] text-white text-xs font-medium px-4 shadow-xs"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Column (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Información básica */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/40">
              <Info className="h-4 w-4 text-[#555A2B]" />
              <h2 className="font-serif text-lg font-semibold text-[#1C1917]">
                Información básica
              </h2>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <Label className="text-xs font-medium text-foreground mb-1.5 block">
                  Nombre de la colección
                </Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Amor y Amistad 2026"
                  className="bg-[#FAF9F5]/60 border-border/60 focus-visible:bg-background text-sm"
                />
              </div>

              <div>
                <Label className="text-xs font-medium text-foreground mb-1.5 block">
                  Descripción
                </Label>
                <Textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Escribe una descripción publicitaria o narrativa para esta colección..."
                  className="bg-[#FAF9F5]/60 border-border/60 focus-visible:bg-background text-sm leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Imagen de portada */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/40">
              <ImageIcon className="h-4 w-4 text-[#555A2B]" />
              <h2 className="font-serif text-lg font-semibold text-[#1C1917]">
                Imagen de portada
              </h2>
            </div>

            <div className="space-y-4 pt-1">
              {coverImage ? (
                <div className="space-y-3">
                  <div className="aspect-[21/9] w-full rounded-lg overflow-hidden border border-border/60 bg-[#FAF9F5] relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coverImage}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <SingleImageUploader
                        label=""
                        value={coverImage}
                        onChange={setCoverImage}
                        folder="collections"
                      />
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setCoverImage(undefined)}
                      className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 text-xs shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                      Quitar
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <SingleImageUploader
                    label="Subir imagen de portada"
                    value={coverImage}
                    onChange={setCoverImage}
                    folder="collections"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Productos asignados */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/40">
              <ShoppingBag className="h-4 w-4 text-[#555A2B]" />
              <h2 className="font-serif text-lg font-semibold text-[#1C1917]">
                Productos asignados ({productIds.length})
              </h2>
            </div>

            <AssignedProductsTable
              assignedProductIds={productIds}
              onChange={setProductIds}
            />
          </div>

          {/* Card 4: Zona de peligro */}
          <div className="bg-card border border-red-200/80 rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-red-600 pb-2 border-b border-red-100">
              <AlertTriangle className="h-4 w-4" />
              <h2 className="font-serif text-lg font-semibold">Zona de peligro</h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div>
                <p className="text-xs font-medium text-foreground">Eliminar esta colección</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Esta acción no se puede deshacer. Se eliminarán los vínculos de productos.
                </p>
              </div>

              <Button
                variant="outline"
                onClick={() => setDeleteOpen(true)}
                className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 text-xs font-medium self-start sm:self-auto"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Eliminar colección
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar Column (Right 1 col) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Card: Resumen */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-2xs space-y-4 sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <h2 className="font-serif text-lg font-semibold text-[#1C1917]">Resumen</h2>
              {collection.isDefault && (
                <span className="bg-[#FAF5E6] text-[#555A2B] border border-[#E6DBB8] text-[11px] font-medium px-2 py-0.5 rounded-md">
                  ★ Predeterminada
                </span>
              )}
            </div>

            <div className="space-y-4 text-xs">
              {/* Mark Default option if not default */}
              {!collection.isDefault && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSetDefault}
                  disabled={settingDefault}
                  className="w-full text-xs border-[#E6DBB8] text-[#555A2B] bg-[#FAF5E6]/60 hover:bg-[#FAF5E6]"
                >
                  <Star className="h-3.5 w-3.5 mr-1.5 fill-current" />
                  {settingDefault ? "Marcando..." : "Marcar como predeterminada"}
                </Button>
              )}

              {/* Products count row */}
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#FAF9F5] border border-border/40">
                <ShoppingBag className="h-4 w-4 text-[#555A2B] shrink-0" />
                <div>
                  <p className="font-medium text-foreground">
                    {productIds.length} {productIds.length === 1 ? "producto asignado" : "productos asignados"}
                  </p>
                </div>
              </div>

              {/* Visibility status */}
              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#FAF9F5] border border-border/40">
                <Eye className="h-4 w-4 text-[#555A2B] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Visible</p>
                  <p className="text-[11px] text-muted-foreground">La colección es visible en la tienda.</p>
                </div>
              </div>

              {/* Audit info */}
              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#FAF9F5] border border-border/40">
                <Clock className="h-4 w-4 text-[#555A2B] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Última actualización</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {formatDateSpanish(collection.updatedAt || collection.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Eliminar colección"
        description={`¿Seguro que quieres eliminar "${collection.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        onConfirm={handleDelete}
      />
    </div>
  );
}
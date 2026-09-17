"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, Info, Sliders, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SingleImageUploader } from "@/components/shared/single-image-uploader";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { getCollections } from "@/features/collections/services/collections.service";
import { createSeason, updateSeason, deleteSeason } from "../services/seasons.service";
import { toast } from "@/lib/toast";
import type { Collection } from "@/features/collections/types";
import type { Season, SeasonStatus, SeasonColors } from "../types";

interface SeasonFormProps {
  mode: "create" | "edit";
  initialData?: Season;
}

export function SeasonForm({ mode, initialData }: SeasonFormProps) {
  const router = useRouter();

  // Left Column States
  const [name, setName] = useState(initialData?.name ?? "");
  const [collectionId, setCollectionId] = useState(initialData?.collectionId ?? "");
  const [startDate, setStartDate] = useState(initialData?.startDate ?? "");
  const [endDate, setEndDate] = useState(initialData?.endDate ?? "");
  const [status, setStatus] = useState<SeasonStatus>(initialData?.status ?? "borrador");
  const [description, setDescription] = useState(
    initialData?.heroSubtitle || initialData?.heroTitle || ""
  );

  // Right Column States
  const [bannerImage, setBannerImage] = useState<string | undefined>(
    initialData?.bannerImage || initialData?.heroImage || initialData?.coverImageUrl
  );
  const [isVisibleStore, setIsVisibleStore] = useState(initialData?.isVisibleStore ?? true);
  const [isFeaturedHome, setIsFeaturedHome] = useState(initialData?.isFeaturedHome ?? true);
  const [allowCustomization, setAllowCustomization] = useState(initialData?.allowCustomization ?? false);

  const [colors] = useState<SeasonColors>(
    initialData?.colors ?? { primary: "#555A2B", accent: "#E6DBB8", background: "#FAF9F5" }
  );

  // Collections State
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loadingCollections, setLoadingCollections] = useState(true);

  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    getCollections()
      .then(setCollections)
      .catch(() => setCollections([]))
      .finally(() => setLoadingCollections(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("El nombre de la temporada es obligatorio.");
      return;
    }
    if (!collectionId) {
      toast.error("Debes seleccionar una colección vinculada.");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Las fechas de inicio y fin son obligatorias.");
      return;
    }

    setSaving(true);

    const payload = {
      name,
      collectionId,
      startDate,
      endDate,
      heroTitle: name,
      heroSubtitle: description,
      bannerImage,
      heroImage: bannerImage,
      colors,
      ctaText: "Ver colección",
      ctaLink: "/colecciones",
      featuredProductIds: initialData?.featuredProductIds ?? [],
      status,
      isVisibleStore,
      isFeaturedHome,
      allowCustomization,
    };

    try {
      if (mode === "create") {
        const created = await createSeason(payload);
        toast.success("Temporada creada correctamente");
        router.push(`/admin/temporadas/${created.id}`);
      } else if (initialData) {
        await updateSeason(initialData.id, payload);
        toast.success("Temporada actualizada correctamente");
        router.push(`/admin/temporadas/${initialData.id}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar la temporada.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!initialData) return;
    try {
      await deleteSeason(initialData.id);
      toast.success(`Temporada "${initialData.name}" eliminada`);
      router.push("/admin/temporadas");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar la temporada.");
    }
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-6xl mx-auto pb-16">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div className="flex flex-col gap-1">
          <Link
            href="/admin/temporadas"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a temporadas
          </Link>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1C1917] mt-0.5">
            {mode === "create" ? "Nueva temporada" : `Editar "${initialData?.name}"`}
          </h1>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/temporadas")}
            className="text-xs border-border/60"
          >
            Cancelar
          </Button>

          {mode === "edit" && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(true)}
              className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 text-xs"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Eliminar
            </Button>
          )}

          <Button
            type="submit"
            disabled={saving}
            className="bg-[#555A2B] hover:bg-[#454A23] text-white text-xs font-medium px-4 shadow-xs"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (Main Data - 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-border/40">
              <Info className="h-4 w-4 text-[#555A2B]" />
              <h2 className="font-serif text-lg font-semibold text-[#1C1917]">
                Datos Principales
              </h2>
            </div>

            {/* Field: Nombre */}
            <div>
              <Label className="text-xs font-medium text-foreground mb-1.5 block">
                Nombre de la temporada <span className="text-red-500">*</span>
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Navidad 2026, Amor y Amistad 2026"
                className="bg-[#FAF9F5]/60 border-border/60 focus-visible:bg-background text-sm"
              />
            </div>

            {/* Field: Colección vinculada */}
            <div>
              <Label className="text-xs font-medium text-foreground mb-1.5 block">
                Colección vinculada <span className="text-red-500">*</span>
              </Label>
              <Select
                value={collectionId}
                onValueChange={setCollectionId}
                disabled={loadingCollections}
              >
                <SelectTrigger className="bg-[#FAF9F5]/60 border-border/60 text-sm">
                  <SelectValue placeholder="Selecciona una colección comercial" />
                </SelectTrigger>
                <SelectContent>
                  {collections.map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.name} ({col.productsCount ?? col.productIds.length} productos)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fechas de Operación */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-foreground mb-1.5 block">
                  Fecha de inicio <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-[#FAF9F5]/60 border-border/60 focus-visible:bg-background text-sm"
                />
              </div>

              <div>
                <Label className="text-xs font-medium text-foreground mb-1.5 block">
                  Fecha de fin <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-[#FAF9F5]/60 border-border/60 focus-visible:bg-background text-sm"
                />
              </div>
            </div>

            {/* Selector de Estado */}
            <div>
              <Label className="text-xs font-medium text-foreground mb-1.5 block">
                Estado de la temporada
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["activa", "programada", "borrador", "finalizada"] as SeasonStatus[]).map((st) => {
                  const isSelected = status === st;
                  const labels: Record<SeasonStatus, string> = {
                    activa: "Activa",
                    programada: "Programada",
                    borrador: "Borrador",
                    finalizada: "Finalizada",
                  };
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatus(st)}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all text-center ${
                        isSelected
                          ? "bg-[#555A2B] text-white border-[#555A2B] shadow-2xs"
                          : "bg-[#FAF9F5] text-foreground border-border/60 hover:bg-secondary"
                      }`}
                    >
                      {labels[st]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field: Descripción con Contador 0/250 */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-xs font-medium text-foreground block">
                  Descripción promocional
                </Label>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {description.length}/250
                </span>
              </div>
              <Textarea
                rows={4}
                maxLength={250}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Resumen o eslogan promocional de esta temporada..."
                className="bg-[#FAF9F5]/60 border-border/60 focus-visible:bg-background text-sm leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Right Column (Media & Config - 1 col) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Card: Imagen de Portada / Banner */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/40">
              <ImageIcon className="h-4 w-4 text-[#555A2B]" />
              <h2 className="font-serif text-lg font-semibold text-[#1C1917]">
                Imagen de Portada
              </h2>
            </div>

            {bannerImage ? (
              <div className="space-y-3">
                <div className="aspect-[16/10] w-full rounded-lg overflow-hidden border border-border/60 bg-[#FAF9F5]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={bannerImage} alt="Portada" className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <SingleImageUploader
                      label=""
                      value={bannerImage}
                      onChange={setBannerImage}
                      folder="seasons"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setBannerImage(undefined)}
                    className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 text-xs shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Quitar
                  </Button>
                </div>
              </div>
            ) : (
              <SingleImageUploader
                label="Cargar imagen promocional"
                value={bannerImage}
                onChange={setBannerImage}
                folder="seasons"
              />
            )}
          </div>

          {/* Card: Configuration Switches */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/40">
              <Sliders className="h-4 w-4 text-[#555A2B]" />
              <h2 className="font-serif text-lg font-semibold text-[#1C1917]">
                Configuración Adicional
              </h2>
            </div>

            <div className="space-y-4 pt-1 text-xs">
              {/* Toggle 1: Visible en la tienda */}
              <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#FAF9F5] border border-border/40">
                <div>
                  <p className="font-medium text-foreground">Visible en la tienda</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Muestra esta temporada en los menús públicos.
                  </p>
                </div>
                <Switch
                  checked={isVisibleStore}
                  onCheckedChange={setIsVisibleStore}
                  className="data-[state=checked]:bg-[#555A2B]"
                />
              </div>

              {/* Toggle 2: Destacar en la página principal */}
              <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#FAF9F5] border border-border/40">
                <div>
                  <p className="font-medium text-foreground">Destacar en home</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Posiciona el banner en el carrusel principal.
                  </p>
                </div>
                <Switch
                  checked={isFeaturedHome}
                  onCheckedChange={setIsFeaturedHome}
                  className="data-[state=checked]:bg-[#555A2B]"
                />
              </div>

              {/* Toggle 3: Permitir personalización */}
              <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#FAF9F5] border border-border/40">
                <div>
                  <p className="font-medium text-foreground">Permitir personalización</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Permite bordados o estampados especiales.
                  </p>
                </div>
                <Switch
                  checked={allowCustomization}
                  onCheckedChange={setAllowCustomization}
                  className="data-[state=checked]:bg-[#555A2B]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      {initialData && (
        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Eliminar temporada"
          description={`¿Seguro que quieres eliminar "${initialData.name}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          onConfirm={handleDelete}
        />
      )}
    </form>
  );
}
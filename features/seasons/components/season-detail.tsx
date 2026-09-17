"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  ShoppingBag,
  Calendar,
  Layers,
  Sparkles,
  Clock,
  CheckCircle2,
  FileText,
  ImageOff,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { deleteSeason } from "../services/seasons.service";
import { toast } from "@/lib/toast";
import type { Season, SeasonStatus } from "../types";

export function SeasonDetail({ season }: { season: Season }) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handleDelete() {
    try {
      await deleteSeason(season.id);
      toast.success(`Temporada "${season.name}" eliminada`);
      router.push("/admin/temporadas");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar la temporada.");
    }
  }

  // Format date display (dd mmm. yyyy)
  const formatDateSpanish = (dateStr?: string) => {
    if (!dateStr) return "Sin fecha";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const monthNames = [
      "ene.", "feb.", "mar.", "abr.", "may.", "jun.",
      "jul.", "ago.", "sept.", "oct.", "nov.", "dic."
    ];
    return `${date.getDate().toString().padStart(2, "0")} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  const cover = season.coverImageUrl || season.bannerImage || season.heroImage;
  const status = season.status;

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-16">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div className="flex flex-col gap-1">
          <Link
            href="/admin/temporadas"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a temporadas
          </Link>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1C1917]">
              {season.name}
            </h1>

            {/* Status Chip */}
            {status === "activa" && (
              <span className="bg-[#E8F5E9] text-[#166534] text-xs font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
                Activa
              </span>
            )}
            {status === "programada" && (
              <span className="bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1 rounded-full inline-flex items-center gap-1.5 border border-amber-200 shadow-2xs">
                <Clock className="h-3.5 w-3.5" />
                Programada
              </span>
            )}
            {status === "borrador" && (
              <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full border border-gray-200">
                Borrador
              </span>
            )}
            {status === "finalizada" && (
              <span className="bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                Finalizada
              </span>
            )}
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button asChild size="sm" className="bg-[#555A2B] hover:bg-[#454A23] text-white text-xs font-medium px-4 shadow-xs">
            <Link href={`/admin/temporadas/${season.id}/editar`}>
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Editar temporada
            </Link>
          </Button>
        </div>
      </div>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Panel Izquierdo: Información General (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-border/40">
              <FileText className="h-4 w-4 text-[#555A2B]" />
              <h2 className="font-serif text-lg font-semibold text-[#1C1917]">
                Información General
              </h2>
            </div>

            {/* Grid of Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-[#FAF9F5] border border-border/40 flex items-center gap-3">
                <Layers className="h-5 w-5 text-[#555A2B] shrink-0" />
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase font-semibold">Colección vinculada</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{season.collectionName}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#FAF9F5] border border-border/40 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-[#555A2B] shrink-0" />
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase font-semibold">Período de operación</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">
                    {formatDateSpanish(season.startDate)} - {formatDateSpanish(season.endDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Complete Description Block */}
            <div className="pt-2">
              <h3 className="text-xs font-medium text-foreground mb-1.5">Descripción completa</h3>
              <div className="p-4 rounded-lg bg-[#FAF9F5]/70 border border-border/40 text-sm text-foreground leading-relaxed whitespace-pre-line">
                {season.heroSubtitle || season.heroTitle || "Sin descripción disponible para esta temporada."}
              </div>
            </div>
          </div>

          {/* Card: Acciones Rápidas */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/40">
              <Tag className="h-4 w-4 text-[#555A2B]" />
              <h2 className="font-serif text-lg font-semibold text-[#1C1917]">
                Acciones Rápidas
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button asChild variant="outline" className="text-xs">
                <Link href={`/admin/temporadas/${season.id}/editar`}>
                  <Pencil className="h-3.5 w-3.5 mr-1.5 text-[#555A2B]" />
                  Editar temporada
                </Link>
              </Button>

              <Button asChild variant="outline" className="text-xs">
                <Link href={`/admin/productos?seasonId=${season.id}`}>
                  <ShoppingBag className="h-3.5 w-3.5 mr-1.5 text-[#555A2B]" />
                  Gestionar productos
                </Link>
              </Button>

              <Button
                variant="outline"
                onClick={() => setDeleteOpen(true)}
                className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 text-xs ml-auto"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Eliminar temporada
              </Button>
            </div>
          </div>
        </div>

        {/* Panel Derecho: Vista de Portada (1 col) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/40">
              <Sparkles className="h-4 w-4 text-[#555A2B]" />
              <h2 className="font-serif text-lg font-semibold text-[#1C1917]">
                Vista de Portada
              </h2>
            </div>

            <div className="w-full aspect-[16/11] rounded-lg overflow-hidden border border-border/60 bg-[#FAF9F5] flex items-center justify-center relative">
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cover} alt={season.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                  <ImageOff className="h-8 w-8 mb-2 text-[#555A2B] opacity-40" />
                  <span className="text-xs opacity-60">Sin imagen promocional cargada</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Eliminar temporada"
        description={`¿Seguro que quieres eliminar "${season.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        onConfirm={handleDelete}
      />
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  MoreVertical,
  Clock,
  CheckCircle2,
  Sparkles,
  FileText,
  Calendar,
  Layers,
  ImageOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/lib/toast";
import { getSeasons, activateSeason, deleteSeason } from "../services/seasons.service";
import type { Season, SeasonStatus } from "../types";

export function SeasonsTimeline() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Season | null>(null);
  const [activatingId, setActivatingId] = useState<string | null>(null);

  const fetchSeasons = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSeasons();
      setSeasons(data);
    } catch {
      toast.error("No se pudieron cargar las temporadas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeasons();
  }, [fetchSeasons]);

  async function handleActivate(id: string, name: string) {
    setActivatingId(id);
    try {
      const updatedList = await activateSeason(id);
      setSeasons(updatedList);
      toast.success(`"${name}" es ahora la temporada activa.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo activar la temporada.");
    } finally {
      setActivatingId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteSeason(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" fue eliminada.`);
      setDeleteTarget(null);
      fetchSeasons();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar.");
    }
  }

  // Sorted timeline order: Activa first, then Programada, Borrador, Finalizada
  const sortedSeasons = useMemo(() => {
    const statusWeight: Record<SeasonStatus, number> = {
      activa: 1,
      programada: 2,
      borrador: 3,
      finalizada: 4,
    };
    return [...seasons].sort((a, b) => {
      const wA = statusWeight[a.status] || 5;
      const wB = statusWeight[b.status] || 5;
      if (wA !== wB) return wA - wB;
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
  }, [seasons]);

  // Format date range (e.g. 01 dic. - 28 feb. 2026)
  const formatDateRange = (startDateStr: string, endDateStr: string) => {
    if (!startDateStr || !endDateStr) return "Fechas no definidas";
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return `${startDateStr} - ${endDateStr}`;

    const monthNames = [
      "ene.", "feb.", "mar.", "abr.", "may.", "jun.",
      "jul.", "ago.", "sept.", "oct.", "nov.", "dic."
    ];
    const startDay = start.getDate().toString().padStart(2, "0");
    const startMonth = monthNames[start.getMonth()];
    const endDay = end.getDate().toString().padStart(2, "0");
    const endMonth = monthNames[end.getMonth()];
    const endYear = end.getFullYear();

    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${endYear}`;
  };

  // Time progress for active season
  const calculateProgress = (startDateStr: string, endDateStr: string) => {
    const start = new Date(startDateStr).getTime();
    const end = new Date(endDateStr).getTime();
    const now = new Date().getTime();

    if (isNaN(start) || isNaN(end) || end <= start) return { percent: 0, daysLeft: 0 };
    const total = end - start;
    const elapsed = now - start;

    if (elapsed <= 0) return { percent: 0, daysLeft: Math.ceil((end - now) / (1000 * 60 * 60 * 24)) };
    if (elapsed >= total) return { percent: 100, daysLeft: 0 };

    const percent = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
    const daysLeft = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
    return { percent, daysLeft };
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1C1917]">
            Temporadas
          </h1>
          <p className="text-sm text-[#71717A] mt-1">
            Línea temporal de campañas y temporadas comerciales.
          </p>
        </div>

        <Button
          asChild
          className="bg-[#555A2B] hover:bg-[#454A23] text-white shadow-xs font-medium px-4 py-2 rounded-lg self-start sm:self-auto"
        >
          <Link href="/admin/temporadas/nueva">
            <Plus className="h-4 w-4 mr-2" />
            Nueva temporada
          </Link>
        </Button>
      </div>

      {/* Timeline Section */}
      {loading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : sortedSeasons.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-card border border-border/60 rounded-xl">
          <Calendar className="h-10 w-10 text-muted-foreground/50 mb-3" />
          <h3 className="font-serif text-lg font-semibold text-[#1C1917]">No hay temporadas registradas</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Crea tu primera temporada o campaña comercial para conectar colecciones y productos.
          </p>
          <Button asChild className="mt-4 bg-[#555A2B] hover:bg-[#454A23] text-white">
            <Link href="/admin/temporadas/nueva">
              <Plus className="h-4 w-4 mr-2" />
              Crear primera temporada
            </Link>
          </Button>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-border/60">
          {sortedSeasons.map((season) => {
            const status = season.status;
            const cover = season.coverImageUrl || season.bannerImage || season.heroImage;
            const { percent, daysLeft } = calculateProgress(season.startDate, season.endDate);

            return (
              <div key={season.id} className="relative group">
                {/* Timeline Node Icon */}
                <div className="absolute -left-6 sm:-left-8 top-4 -translate-x-1/2 flex items-center justify-center">
                  {status === "activa" && (
                    <div className="relative flex items-center justify-center">
                      <span className="absolute h-9 w-9 rounded-full bg-emerald-500/30 animate-ping" />
                      <div className="h-9 w-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md ring-4 ring-emerald-500/20 z-10">
                        <Sparkles className="h-4 w-4" />
                      </div>
                    </div>
                  )}

                  {status === "programada" && (
                    <div className="h-8 w-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs ring-4 ring-amber-500/20">
                      <Clock className="h-4 w-4" />
                    </div>
                  )}

                  {status === "borrador" && (
                    <div className="h-8 w-8 rounded-full bg-background border-2 border-dashed border-gray-400 text-gray-500 flex items-center justify-center shadow-2xs">
                      <FileText className="h-3.5 w-3.5" />
                    </div>
                  )}

                  {status === "finalizada" && (
                    <div className="h-8 w-8 rounded-full bg-gray-400 text-white flex items-center justify-center shadow-2xs">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  )}
                </div>

                {/* Timeline Node Card */}
                <div className="bg-card border border-border/60 rounded-xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row gap-5">
                  {/* Banner / Cover Thumbnail */}
                  <div className="w-full md:w-48 aspect-[16/10] rounded-lg overflow-hidden bg-[#FAF9F5] border border-border/40 shrink-0 relative flex items-center justify-center">
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cover} alt={season.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-muted-foreground p-3">
                        <ImageOff className="h-6 w-6 mb-1 text-[#555A2B] opacity-50" />
                        <span className="text-[11px] opacity-60">Sin banner</span>
                      </div>
                    )}

                    {status === "activa" && (
                      <Badge className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-semibold px-2 py-0.5 shadow-xs">
                        ● ACTIVA
                      </Badge>
                    )}
                  </div>

                  {/* Metadata and Content */}
                  <div className="flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link href={`/admin/temporadas/${season.id}`}>
                              <h3 className="font-serif text-xl font-bold tracking-tight text-[#1C1917] hover:text-[#555A2B] transition-colors">
                                {season.name}
                              </h3>
                            </Link>

                            {/* Status Chip */}
                            {status === "activa" && (
                              <span className="bg-[#E8F5E9] text-[#166534] text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                                Activa
                              </span>
                            )}
                            {status === "programada" && (
                              <span className="bg-amber-50 text-amber-700 text-xs font-medium px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 border border-amber-200">
                                <Clock className="h-3 w-3" />
                                Programada
                              </span>
                            )}
                            {status === "borrador" && (
                              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full border border-gray-200">
                                Borrador
                              </span>
                            )}
                            {status === "finalizada" && (
                              <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                Finalizada
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-xs text-[#71717A] mt-1.5 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Layers className="h-3.5 w-3.5 text-[#555A2B]" />
                              Colección: <strong className="text-foreground font-medium">{season.collectionName}</strong>
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-[#555A2B]" />
                              {formatDateRange(season.startDate, season.endDate)}
                            </span>
                          </div>
                        </div>

                        {/* Dropdown Options Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary text-muted-foreground">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/temporadas/${season.id}`}>
                                <Eye className="h-3.5 w-3.5 mr-2" />
                                Ver detalle
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/temporadas/${season.id}/editar`}>
                                <Pencil className="h-3.5 w-3.5 mr-2" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            {status !== "activa" && (
                              <DropdownMenuItem
                                onClick={() => handleActivate(season.id, season.name)}
                                disabled={activatingId === season.id}
                                className="text-emerald-700 font-medium"
                              >
                                <Sparkles className="h-3.5 w-3.5 mr-2" />
                                Activar esta temporada
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => setDeleteTarget(season)} className="text-red-600">
                              <Trash2 className="h-3.5 w-3.5 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Hero Subtitle / Description preview */}
                      <p className="text-xs text-[#52525B] line-clamp-2 mt-2 leading-relaxed">
                        {season.heroSubtitle || season.heroTitle || "Sin descripción corta para esta temporada."}
                      </p>
                    </div>

                    {/* Progress Bar for Active Season */}
                    {status === "activa" && (
                      <div className="pt-2 border-t border-border/40 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-[#166534] flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> Progreso de la campaña
                          </span>
                          <span className="text-muted-foreground font-mono font-medium">
                            {percent}% completado ({daysLeft} {daysLeft === 1 ? "día restante" : "días restantes"})
                          </span>
                        </div>
                        <div className="h-2 w-full bg-[#E8F5E9] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Bar Footer */}
                    <div className="pt-2 flex items-center justify-end gap-2">
                      <Button asChild size="sm" variant="outline" className="h-8 text-xs">
                        <Link href={`/admin/temporadas/${season.id}`}>
                          <Eye className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                          Ver detalle
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="h-8 text-xs">
                        <Link href={`/admin/temporadas/${season.id}/editar`}>
                          <Pencil className="h-3.5 w-3.5 mr-1.5 text-[#555A2B]" />
                          Editar
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar temporada"
        description={`¿Seguro que quieres eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        onConfirm={confirmDelete}
      />
    </div>
  );
}

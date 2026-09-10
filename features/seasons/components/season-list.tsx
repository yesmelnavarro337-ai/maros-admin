"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { toast } from "@/lib/toast";
import { getSeasons, deleteSeason } from "../services/seasons.service";
import { SeasonYearTimeline } from "./season-year-timeline";
import { SeasonRow } from "./season-row";
import type { Season } from "../types";

export function SeasonList() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Season | null>(null);

  const fetchSeasons = useCallback(async () => {
    setLoading(true);
    const data = await getSeasons();
    setSeasons(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSeasons();
  }, [fetchSeasons]);

  async function confirmDelete() {
    if (!deleteTarget) return;
    await deleteSeason(deleteTarget.id);
    toast.success(`"${deleteTarget.name}" fue eliminada`);
    setDeleteTarget(null);
    fetchSeasons();
  }

  const activeSeason = seasons.find((s) => s.status === "activa");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Temporadas"
        subtitle="Programa el contenido dinámico de la landing pública"
        action={
          <Button asChild>
            <Link href="/admin/temporadas/nueva">
              <Plus className="h-4 w-4 mr-2" />
              Nueva temporada
            </Link>
          </Button>
        }
      />

      {loading ? (
        <Skeleton className="h-40 w-full rounded-lg" />
      ) : (
        <SeasonYearTimeline seasons={seasons} activeSeasonId={activeSeason?.id} />
      )}

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {seasons.map((season) => (
            <SeasonRow
              key={season.id}
              season={season}
              defaultOpen={season.status === "activa"}
              onChanged={fetchSeasons}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

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
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ExternalLink, Trash2 } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SingleImageUploader } from "@/components/shared/single-image-uploader";
import { SeasonColorTile } from "./season-color-tile";
import { SeasonPreviewModal } from "./season-preview-modal";
import { toast } from "@/lib/toast";
import { updateSeason, activateSeason } from "../services/seasons.service";
import { getSeasonIcon } from "../utils/season-icon";
import type { Season, SeasonColors, SeasonStatus } from "../types";

const STATUS_CONFIG: Record<SeasonStatus, { label: string; dot: string; badgeClass: string }> = {
  activa: { label: "Activa", dot: "●", badgeClass: "bg-primary text-primary-foreground" },
  programada: { label: "Programada", dot: "○", badgeClass: "bg-accent/30 text-foreground" },
  finalizada: { label: "Finalizada", dot: "✓", badgeClass: "bg-muted text-muted-foreground" },
  borrador: { label: "Borrador", dot: "○", badgeClass: "bg-secondary text-secondary-foreground" },
};

function formatRange(start: string, end: string) {
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
  return `${new Date(start).toLocaleDateString("es-CO", opts)} → ${new Date(end).toLocaleDateString("es-CO", opts)}`;
}

interface SeasonRowProps {
  season: Season;
  defaultOpen?: boolean;
  onChanged: () => void;
  onDelete: (season: Season) => void;
}

export function SeasonRow({ season, defaultOpen = false, onChanged, onDelete }: SeasonRowProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [heroImage, setHeroImage] = useState(season.heroImage);
  const [bannerImage, setBannerImage] = useState(season.bannerImage);
  const [colors, setColors] = useState<SeasonColors>(season.colors);
  const [saving, setSaving] = useState(false);
  const [activating, setActivating] = useState(false);

  const status = STATUS_CONFIG[season.status];

async function handleSave() {
  setSaving(true);
  try {
    await updateSeason(season.id, { heroImage, bannerImage, colors });
    toast.success("Cambios guardados correctamente");
    onChanged();
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "No se pudieron guardar los cambios");
  } finally {
    setSaving(false);
  }
}

async function handleToggleActive(checked: boolean) {
  if (!checked) {
    toast.info("Activa otra temporada para desactivar esta");
    return;
  }
  setActivating(true);
  try {
    await activateSeason(season.id);
    toast.success(`${season.name} es ahora la temporada activa`);
    onChanged();
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "No se pudo activar la temporada");
  } finally {
    setActivating(false);
  }
}

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 flex-wrap">
        <div className="h-11 w-11 rounded-lg bg-secondary flex items-center justify-center text-xl shrink-0">
          {getSeasonIcon(season)}
        </div>

        <Link href={`/admin/temporadas/${season.id}`} className="min-w-0 flex-1 group">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-heading text-lg text-foreground truncate group-hover:underline">{season.name}</p>
            <Badge className={status.badgeClass}>{status.dot} {status.label}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{formatRange(season.startDate, season.endDate)}</p>
        </Link>

        <Button asChild size="icon" variant="ghost" className="h-8 w-8 shrink-0 hidden sm:inline-flex" title="Editar información general">
          <Link href={`/admin/temporadas/${season.id}`}>
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 shrink-0 hover:text-destructive"
          onClick={() => onDelete(season)}
          title="Eliminar"
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        <Switch
          checked={season.status === "activa"}
          onCheckedChange={handleToggleActive}
          disabled={activating}
          className="shrink-0"
        />

        <CollapsibleTrigger asChild>
          <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0">
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent>
        <div className="border-t border-border px-4 py-5">
          <div className="grid grid-cols-1 gap-4">
<SingleImageUploader label="Hero / Imagen" value={heroImage} onChange={setHeroImage} aspect="square" folder="seasons" />
<SingleImageUploader label="Banner" value={bannerImage} onChange={setBannerImage} aspect="square" folder="seasons" />
            <SeasonColorTile colors={colors} onChange={setColors} />
          </div>

          <div className="flex items-center justify-end gap-3 mt-5 flex-wrap">
            <SeasonPreviewModal season={{ ...season, heroImage, bannerImage, colors }} />
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
import { ImageOff, Pencil, Trash2, Sparkles, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import type { Banner } from "../types";

interface BannerCardProps {
  banner: Banner;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: (active: boolean) => void;
}

export function BannerCard({ banner, onEdit, onDelete, onToggleActive }: BannerCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[3/1] bg-secondary flex items-center justify-center">
        {banner.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
        ) : (
          <ImageOff className="h-6 w-6 text-muted-foreground" />
        )}
      </div>
      <CardContent className="pt-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{banner.title}</p>
          <p className="text-xs text-muted-foreground">{banner.position} · {banner.linkUrl}</p>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {banner.seasonName && (
              <Badge variant="secondary" className="gap-1 text-[10px]">
                <Sparkles className="h-2.5 w-2.5" />
                {banner.seasonName}
              </Badge>
            )}
            {banner.collectionName && (
              <Badge variant="secondary" className="gap-1 text-[10px]">
                <Layers className="h-2.5 w-2.5" />
                {banner.collectionName}
              </Badge>
            )}
            {(banner.startDate || banner.endDate) && (
              <span className="text-[10px] text-muted-foreground">
                {banner.startDate ?? "…"} → {banner.endDate ?? "…"}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Switch checked={banner.active} onCheckedChange={onToggleActive} />
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
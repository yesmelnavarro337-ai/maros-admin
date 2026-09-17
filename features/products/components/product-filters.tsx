"use client";

import { useEffect, useState } from "react";
import { Tag, Filter, Calendar, Layers } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { getSeasons } from "@/features/seasons/services/seasons.service";
import type { Season } from "@/features/seasons/types";

interface ProductFiltersProps {
  categoryId: string;
  status: string;
  seasonId: string;
  selectedCount?: number;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSeasonChange: (value: string) => void;
  onBulkAction?: (action: string) => void;
}

export function ProductFilters({
  categoryId,
  status,
  seasonId,
  selectedCount = 0,
  onCategoryChange,
  onStatusChange,
  onSeasonChange,
  onBulkAction,
}: ProductFiltersProps) {
  const { categories, loading: categoriesLoading } = useCategories();
  const [seasons, setSeasons] = useState<Season[]>([]);

  useEffect(() => {
    getSeasons()
      .then(setSeasons)
      .catch(() => setSeasons([]));
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {/* 1. Select Categoría */}
      <Select value={categoryId} onValueChange={onCategoryChange} disabled={categoriesLoading}>
        <SelectTrigger className="w-[150px] h-9 text-xs bg-card border-border/80 rounded-lg">
          <Tag className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
          <SelectValue placeholder="Categoría" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas las categorías</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 2. Select Estado */}
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[140px] h-9 text-xs bg-card border-border/80 rounded-lg">
          <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos los estados</SelectItem>
          <SelectItem value="activo">Activo</SelectItem>
          <SelectItem value="lowStock">Stock bajo</SelectItem>
          <SelectItem value="outOfStock">Sin stock</SelectItem>
        </SelectContent>
      </Select>

      {/* 3. Select Temporada */}
      <Select value={seasonId} onValueChange={onSeasonChange}>
        <SelectTrigger className="w-[150px] h-9 text-xs bg-card border-border/80 rounded-lg">
          <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
          <SelectValue placeholder="Temporada" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas las temporadas</SelectItem>
          {seasons.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 4. Select Acciones Masivas */}
      <Select onValueChange={(val) => onBulkAction?.(val)} disabled={selectedCount === 0}>
        <SelectTrigger className="w-[165px] h-9 text-xs bg-card border-border/80 rounded-lg">
          <Layers className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
          <SelectValue placeholder={selectedCount > 0 ? `Acciones (${selectedCount})` : "Acciones masivas"} />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="delete" className="text-rose-600 font-medium">
            Eliminar seleccionados ({selectedCount})
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
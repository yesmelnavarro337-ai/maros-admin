import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/features/categories/hooks/use-categories";
import type { ProductStatus } from "../types";

interface ProductFiltersProps {
  categoryId: string;
  status: ProductStatus | "todos";
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: ProductStatus | "todos") => void;
}

export function ProductFilters({
  categoryId,
  status,
  onCategoryChange,
  onStatusChange,
}: ProductFiltersProps) {
  const { categories, loading } = useCategories();

  return (
    <div className="flex gap-2">
      <Select value={categoryId} onValueChange={onCategoryChange} disabled={loading}>
        <SelectTrigger className="w-40">
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

      <Select value={status} onValueChange={(v) => onStatusChange(v as ProductStatus | "todos")}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos los estados</SelectItem>
          <SelectItem value="activo">Activo</SelectItem>
          <SelectItem value="borrador">Borrador</SelectItem>
          <SelectItem value="archivado">Archivado</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
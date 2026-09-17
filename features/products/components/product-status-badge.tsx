import { Badge } from "@/components/ui/badge";
import type { ProductDisplayStatus, ProductStatus } from "../types";

interface ProductStatusBadgeProps {
  status: ProductDisplayStatus | ProductStatus | string;
}

export function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  const normalized = status.toLowerCase();

  if (normalized === "activo") {
    return (
      <Badge variant="outline" className="bg-[#E6F6ED] text-[#1E7E4E] border-[#C3EBD4] font-medium text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shrink-0">
        <span className="h-1.5 w-1.5 rounded-full bg-[#1E7E4E]" />
        Activo
      </Badge>
    );
  }

  if (normalized === "stock bajo" || normalized === "lowstock") {
    return (
      <Badge variant="outline" className="bg-[#FEF3D6] text-[#A6750C] border-[#FBE6AD] font-medium text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shrink-0">
        <span className="h-1.5 w-1.5 rounded-full bg-[#A6750C]" />
        Stock bajo
      </Badge>
    );
  }

  if (normalized === "sin stock" || normalized === "outofstock") {
    return (
      <Badge variant="outline" className="bg-[#FDE8E8] text-[#C53030] border-[#F9C3C3] font-medium text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shrink-0">
        <span className="h-1.5 w-1.5 rounded-full bg-[#C53030]" />
        Sin stock
      </Badge>
    );
  }

  if (normalized === "borrador") {
    return (
      <Badge variant="outline" className="bg-secondary text-secondary-foreground font-medium text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shrink-0">
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
        Borrador
      </Badge>
    );
  }

  if (normalized === "archivado") {
    return (
      <Badge variant="outline" className="bg-muted text-muted-foreground font-medium text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shrink-0">
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
        Archivado
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="text-xs px-2.5 py-0.5 rounded-full">
      {status}
    </Badge>
  );
}
import { Badge } from "@/components/ui/badge";
import type { BlogStatus } from "../types";

const config: Record<BlogStatus, { label: string; className: string }> = {
  publicado: {
    label: "Publicado",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  borrador: {
    label: "Borrador",
    className: "bg-stone-100 text-stone-600 border-stone-200",
  },
  programado: {
    label: "Programado",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
};

export function BlogStatusBadge({ status }: { status: BlogStatus }) {
  const cfg = config[status] ?? config.borrador;
  return (
    <Badge
      variant="outline"
      className={`${cfg.className} font-medium px-2.5 py-0.5 rounded-full text-xs`}
    >
      {cfg.label}
    </Badge>
  );
}
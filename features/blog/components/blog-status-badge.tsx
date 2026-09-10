import { Badge } from "@/components/ui/badge";
import type { BlogStatus } from "../types";

const config: Record<BlogStatus, { label: string; className: string }> = {
  publicado: { label: "Publicado", className: "bg-primary text-primary-foreground" },
  programado: { label: "Programado", className: "bg-accent/30 text-foreground" },
  borrador: { label: "Borrador", className: "bg-muted text-muted-foreground" },
};

export function BlogStatusBadge({ status }: { status: BlogStatus }) {
  return <Badge className={config[status].className}>{config[status].label}</Badge>;
}
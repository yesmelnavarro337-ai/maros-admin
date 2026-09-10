import { Badge } from "@/components/ui/badge";
import type { UserStatus } from "../types";

const config: Record<UserStatus, { label: string; className: string }> = {
  activo: { label: "Activo", className: "bg-primary text-primary-foreground" },
  inactivo: { label: "Inactivo", className: "bg-muted text-muted-foreground" },
  pendiente: { label: "Pendiente", className: "bg-accent/30 text-foreground" },
};

export function UserStatusBadge({ status }: { status: UserStatus }) {
  return <Badge className={config[status].className}>{config[status].label}</Badge>;
}
import { Badge } from "@/components/ui/badge";
import type { UserRole } from "../types";

const config: Record<UserRole, string> = {
  Administrador: "bg-primary text-primary-foreground",
  Editor: "bg-accent/30 text-foreground",
  Viewer: "bg-muted text-muted-foreground",
};

export function UserRoleBadge({ role }: { role: UserRole }) {
  return <Badge className={config[role]}>{role}</Badge>;
}
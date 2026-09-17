import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { UserStatus } from "../types";

export function UserStatusBadge({ status }: { status: UserStatus }) {
  if (status === "activo") {
    return (
      <Badge
        variant="outline"
        className="bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100/80 inline-flex items-center gap-1.5 font-medium text-xs py-0.5 px-2.5 shadow-2xs rounded-full"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Activo
      </Badge>
    );
  }

  if (status === "pendiente") {
    return (
      <Badge
        variant="outline"
        className="bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100/80 inline-flex items-center gap-1.5 font-medium text-xs py-0.5 px-2.5 shadow-2xs rounded-full"
      >
        <Clock className="h-3 w-3 text-amber-600" />
        Pendiente
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200 inline-flex items-center gap-1.5 font-medium text-xs py-0.5 px-2.5 shadow-2xs rounded-full"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
      Inactivo
    </Badge>
  );
}
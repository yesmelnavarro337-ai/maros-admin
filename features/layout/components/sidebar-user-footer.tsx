"use client";

import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/features/auth/context/auth-context";

interface SidebarUserFooterProps {
  collapsed: boolean;
}

export function SidebarUserFooter({ collapsed }: SidebarUserFooterProps) {
  const { user, loading, logout } = useAuth();

  const displayName = loading ? "Cargando..." : user?.name ?? "";
  const displayRole = loading ? "" : user?.role ?? "";
  const initial = displayName ? displayName[0].toUpperCase() : "?";

  if (collapsed) {
    return (
      <div className="border-t border-border p-3 flex justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar className="h-9 w-9 cursor-default">
              <AvatarFallback className="bg-accent text-accent-foreground text-sm">
                {initial}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent side="right">
            {displayName} — {displayRole}
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="border-t border-border p-3 flex items-center gap-2">
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarFallback className="bg-accent text-accent-foreground text-sm">
          {initial}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
        <p className="text-xs text-muted-foreground truncate">{displayRole}</p>
      </div>
      <button
        onClick={logout}
        className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-destructive transition-colors shrink-0"
        title="Cerrar sesión"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
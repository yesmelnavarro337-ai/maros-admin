"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getClientNotifications } from "../services/notifications.service";

interface NotificationItem {
  id: string;
  text: string;
  time: string;
}

export function NotificationsMenu() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getClientNotifications()
      .then((items) => {
        if (mounted) setNotifications(items);
      })
      .catch(() => {
        if (mounted) setNotifications([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {notifications.length > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <DropdownMenuItem disabled className="text-sm text-muted-foreground">
            Cargando…
          </DropdownMenuItem>
        ) : notifications.length === 0 ? (
          <DropdownMenuItem disabled className="text-sm text-muted-foreground">
            No hay notificaciones pendientes
          </DropdownMenuItem>
        ) : (
          notifications.map((n) => (
            <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5">
              <span className="text-sm">{n.text}</span>
              <span className="text-xs text-muted-foreground">{n.time}</span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
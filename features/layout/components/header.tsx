"use client";

import Link from "next/link";
import { Search, Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/features/auth/context/auth-context";

export function Header() {
  const { user } = useAuth();
  const userName = user?.name || "Yesmel De La Torre";
  const userRole = user?.role || "Administrador";

  return (
    <header className="sticky top-0 z-10 h-16 border-b border-border bg-background/90 backdrop-blur-sm flex items-center justify-between gap-4 px-6">
      {/* Centered Search Bar */}
      <div className="flex-1 max-w-md mx-auto relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar en el panel..."
          className="w-full h-9.5 pl-9 pr-4 text-xs bg-muted/40 rounded-full border border-border/60 focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/70"
        />
      </div>

      {/* Right User & Notification Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button
          className="relative rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          title="Notificaciones"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border border-background" />
        </button>

        {/* User Profile */}
        <Link
          href="/admin/perfil"
          className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-secondary transition-colors"
        >
          <Avatar className="h-9 w-9 border border-brand-gold/40">
            <AvatarFallback className="bg-[#5C5232] text-white font-medium text-xs">
              {userName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block text-left leading-tight">
            <p className="text-xs font-semibold text-foreground">{userName}</p>
            <p className="text-[10px] text-muted-foreground">{userRole}</p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block ml-0.5" />
        </Link>
      </div>
    </header>
  );
}
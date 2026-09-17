"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminNavItems } from "../config/navigation";
import { useSidebar } from "../hooks/use-sidebar";
import { SidebarUserFooter } from "./sidebar-user-footer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Sidebar() {
  const { collapsed, toggle } = useSidebar();
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "sticky top-0 h-screen shrink-0 border-r border-border bg-card flex flex-col transition-all duration-200",
          collapsed ? "w-[80px]" : "w-64"
        )}
      >
        {/* Header: logo + toggle */}
        <div
          className={cn(
            "flex items-center h-16 px-4 border-b border-border",
            collapsed ? "justify-center px-2" : "justify-between"
          )}
        >
          {!collapsed && (
            <div className="flex items-center gap-2 min-w-0">
              <Image
                src="/logo.png"
                alt="Maro's Pijamas"
                width={32}
                height={32}
                className="rounded-full shrink-0"
              />
              <div className="leading-tight truncate">
                <p className="font-heading text-sm font-semibold text-foreground truncate">
                  MARO&apos;S
                </p>
                <p className="text-[10px] tracking-widest text-muted-foreground truncate">
                  PIJAMAS
                </p>
              </div>
            </div>
          )}
          <button
            onClick={toggle}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors shrink-0"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 flex flex-col gap-1">
          {adminNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            const link = (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-[#4a5833] text-white font-medium shadow-xs"
                    : "text-foreground hover:bg-secondary",
                  collapsed && "justify-center px-0"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.href}>{link}</div>;
          })}
        </nav>

        {/* Footer: usuario */}
        <SidebarUserFooter collapsed={collapsed} />
      </aside>
    </TooltipProvider>
  );
}
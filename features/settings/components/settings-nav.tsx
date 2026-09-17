"use client";

import { cn } from "@/lib/utils";
import { SETTINGS_SECTIONS } from "../types";
import type { SettingsSectionKey } from "../types";
import {
  Globe,
  Share2,
  MessageSquare,
  Phone,
  Mail,
  Search,
  ShieldCheck,
  Server,
  Database,
  Lock,
} from "lucide-react";

interface SettingsNavProps {
  active: SettingsSectionKey;
  onChange: (key: SettingsSectionKey) => void;
}

const SECTION_ICONS: Record<SettingsSectionKey, React.ReactNode> = {
  general: <Globe className="h-4 w-4" />,
  social: <Share2 className="h-4 w-4" />,
  whatsapp: <MessageSquare className="h-4 w-4" />,
  contact: <Phone className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  seo: <Search className="h-4 w-4" />,
  legal: <ShieldCheck className="h-4 w-4" />,
  domain: <Server className="h-4 w-4" />,
  backups: <Database className="h-4 w-4" />,
  security: <Lock className="h-4 w-4" />,
};

export function SettingsNav({ active, onChange }: SettingsNavProps) {
  return (
    <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible lg:w-64 shrink-0 pb-2 lg:pb-0 scrollbar-none">
      {SETTINGS_SECTIONS.map((s) => {
        const isSelected = active === s.key;
        return (
          <button
            key={s.key}
            type="button"
            onClick={() => onChange(s.key)}
            className={cn(
              "flex items-center gap-3 text-left text-sm rounded-xl px-3.5 py-2.5 whitespace-nowrap transition-all duration-200 font-medium",
              isSelected
                ? "bg-[#2D4A3E] text-white shadow-xs"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            <span
              className={cn(
                "flex items-center justify-center h-7 w-7 rounded-lg shrink-0",
                isSelected
                  ? "bg-white/15 text-white"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {SECTION_ICONS[s.key]}
            </span>
            <div className="min-w-0 hidden lg:block">
              <p className="leading-none text-xs font-semibold">{s.label}</p>
              <p
                className={cn(
                  "text-[10px] truncate mt-1 font-normal",
                  isSelected ? "text-white/80" : "text-muted-foreground"
                )}
              >
                {s.description}
              </p>
            </div>
            <span className="lg:hidden text-xs">{s.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
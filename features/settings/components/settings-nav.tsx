import { cn } from "@/lib/utils";
import { SETTINGS_SECTIONS } from "../types";
import type { SettingsSectionKey } from "../types";

interface SettingsNavProps {
  active: SettingsSectionKey;
  onChange: (key: SettingsSectionKey) => void;
}

export function SettingsNav({ active, onChange }: SettingsNavProps) {
  return (
    <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible lg:w-48 shrink-0">
      {SETTINGS_SECTIONS.map((s) => (
        <button
          key={s.key}
          onClick={() => onChange(s.key)}
          className={cn(
            "text-left text-sm rounded-md px-3 py-2 whitespace-nowrap transition-colors",
            active === s.key
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          {s.label}
        </button>
      ))}
    </nav>
  );
}
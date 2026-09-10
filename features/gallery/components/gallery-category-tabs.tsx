import { cn } from "@/lib/utils";
import { GALLERY_CATEGORIES } from "../types";
import type { GalleryCategory } from "../types";

interface GalleryCategoryTabsProps {
  value: GalleryCategory | "todas";
  onChange: (value: GalleryCategory | "todas") => void;
}

export function GalleryCategoryTabs({ value, onChange }: GalleryCategoryTabsProps) {
  const options: (GalleryCategory | "todas")[] = ["todas", ...GALLERY_CATEGORIES];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-sm transition-colors",
            value === opt
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
          )}
        >
          {opt === "todas" ? "Todas" : opt}
        </button>
      ))}
    </div>
  );
}
"use client";

import { Palette, Shirt, Scissors, Sparkles, Tag, Layers, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { catalogConfigs } from "../config/catalogs.config";
import type { CatalogKey, CatalogItem } from "../types";

interface OverviewGridProps {
  catalogs: Record<Exclude<CatalogKey, "overview">, CatalogItem[]>;
  onSelectTab: (tabKey: CatalogKey) => void;
}

const CATALOG_ICONS: Record<Exclude<CatalogKey, "overview">, React.ComponentType<{ className?: string }>> = {
  modelos: Shirt,
  telas: Scissors,
  colores: Palette,
  estampados: Sparkles,
  bordados: Layers,
  tallas: Tag,
};

export function OverviewGrid({ catalogs, onSelectTab }: OverviewGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {catalogConfigs.map((config) => {
        const Icon = CATALOG_ICONS[config.key] || Shirt;
        const items = catalogs[config.key] || [];
        const count = items.length;

        return (
          <div
            key={config.key}
            className="bg-card border border-border/60 rounded-xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-[#FAF9F5] text-[#555A2B] border border-[#EBE8DE] flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center gap-1 bg-[#FAF5E6] text-[#555A2B] border border-[#E6DBB8] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {count} {count === 1 ? "opción" : "opciones"}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-[#1C1917] group-hover:text-[#555A2B] transition-colors">
                  {config.label}
                </h3>
                <p className="text-xs text-[#71717A] leading-relaxed mt-1">
                  {config.description}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-border/40 flex items-center justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectTab(config.key)}
                className="text-xs font-medium text-[#555A2B] hover:text-[#454A23] hover:bg-[#FAF9F5] p-0 h-auto font-sans"
              >
                Administrar
                <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

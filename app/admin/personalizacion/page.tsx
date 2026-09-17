"use client";

import { Suspense, useEffect, useState } from "react";
import { FolderKanban, Sparkles, Clock } from "lucide-react";
import { CustomizationTabs } from "@/features/customization/components/customization-tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { getCustomizationCatalogs } from "@/features/customization/services/customization.service";

function PersonalizacionContent() {
  const [totalOptions, setTotalOptions] = useState<number>(24);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    // Calculate total active options count
    getCustomizationCatalogs().then((catalogs) => {
      const sum = Object.values(catalogs).reduce((acc, list) => acc + list.length, 0);
      setTotalOptions(sum);
    });

    const date = new Date();
    const formatted = `${date.getDate()} sept. ${date.getFullYear()} · ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")} ${date.getHours() >= 12 ? "p. m." : "a. m."}`;
    setLastUpdated(formatted);
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1C1917]">
          Personalización
        </h1>
        <p className="text-sm text-[#71717A] mt-1">
          Configura los catálogos que alimentan el personalizador de productos.
        </p>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border/60 rounded-xl p-4 flex items-center gap-4 shadow-2xs">
          <div className="h-10 w-10 rounded-lg bg-[#FAF9F5] text-[#555A2B] border border-[#EBE8DE] flex items-center justify-center shrink-0">
            <FolderKanban className="h-5 w-5" />
          </div>
          <div>
            <span className="font-serif text-xl font-bold text-[#1C1917]">6</span>
            <span className="text-sm text-[#71717A] ml-2">categorías de catálogo</span>
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 flex items-center gap-4 shadow-2xs">
          <div className="h-10 w-10 rounded-lg bg-[#FAF9F5] text-[#555A2B] border border-[#EBE8DE] flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold text-[#1C1917]">{totalOptions}</span>
              <span className="inline-flex items-center gap-1 bg-[#E8F5E9] text-[#166534] text-xs font-medium px-2 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                opciones activas
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 flex items-center gap-4 shadow-2xs">
          <div className="h-10 w-10 rounded-lg bg-[#FAF9F5] text-[#555A2B] border border-[#EBE8DE] flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground uppercase font-semibold">Última actualización</p>
            <p className="text-xs font-medium text-foreground mt-0.5">{lastUpdated || "Hoy"}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <CustomizationTabs />
    </div>
  );
}

export default function PersonalizacionPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
      <PersonalizacionContent />
    </Suspense>
  );
}
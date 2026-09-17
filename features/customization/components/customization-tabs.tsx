"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { catalogConfigs } from "../config/catalogs.config";
import { CatalogGrid } from "./catalog-grid";
import { OverviewGrid } from "./overview-grid";
import { CustomizationPreviewSidebar } from "./customization-preview-sidebar";
import {
  getCustomizationCatalogs,
  type CustomizationCatalogs,
} from "../services/customization.service";
import type { CatalogKey } from "../types";

export function CustomizationTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentTab = (searchParams.get("tab") as CatalogKey) || "overview";
  const [activeTab, setActiveTab] = useState<CatalogKey>(currentTab);
  const [catalogs, setCatalogs] = useState<CustomizationCatalogs | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCatalogs = useCallback(async (force = false) => {
    setLoading(true);
    try {
      setCatalogs(await getCustomizationCatalogs(force));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCatalogs();
  }, [loadCatalogs]);

  useEffect(() => {
    const tabFromUrl = (searchParams.get("tab") as CatalogKey) || "overview";
    setActiveTab(tabFromUrl);
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    const newTab = value as CatalogKey;
    setActiveTab(newTab);
    const params = new URLSearchParams(searchParams.toString());
    if (newTab === "overview") {
      params.delete("tab");
    } else {
      params.set("tab", newTab);
    }
    router.push(`/admin/personalizacion?${params.toString()}`);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full space-y-6">
      {/* Navigation Chips Bar */}
      <div className="overflow-x-auto pb-1 scrollbar-none">
        <TabsList className="bg-[#FAF9F5] border border-border/60 p-1 rounded-xl h-auto inline-flex gap-1">
          <TabsTrigger
            value="overview"
            className="text-xs font-medium px-3.5 py-1.5 rounded-lg data-[state=active]:bg-[#555A2B] data-[state=active]:text-white data-[state=active]:shadow-2xs transition-all"
          >
            Visión General
          </TabsTrigger>
          {catalogConfigs.map((c) => (
            <TabsTrigger
              key={c.key}
              value={c.key}
              className="text-xs font-medium px-3.5 py-1.5 rounded-lg data-[state=active]:bg-[#555A2B] data-[state=active]:text-white data-[state=active]:shadow-2xs transition-all"
            >
              {c.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* Visión General Content: 6 Quick-Access Cards + Preview Sidebar */}
      <TabsContent value="overview" className="mt-0 focus-visible:outline-none">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            <OverviewGrid
              catalogs={
                catalogs || {
                  modelos: [],
                  telas: [],
                  colores: [],
                  estampados: [],
                  bordados: [],
                  tallas: [],
                }
              }
              onSelectTab={handleTabChange}
            />
          </div>

          <div className="lg:col-span-1">
            <CustomizationPreviewSidebar catalogs={catalogs} />
          </div>
        </div>
      </TabsContent>

      {/* Individual Tab Contents */}
      {catalogConfigs.map((c) => (
        <TabsContent key={c.key} value={c.key} className="mt-0 focus-visible:outline-none">
          <CatalogGrid
            config={c}
            items={catalogs?.[c.key] ?? []}
            loading={loading}
            onChanged={() => loadCatalogs(true)}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

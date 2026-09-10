"use client";

import { useCallback, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { catalogConfigs } from "../config/catalogs.config";
import { CatalogGrid } from "./catalog-grid";
import { getCustomizationCatalogs, type CustomizationCatalogs } from "../services/customization.service";

export function CustomizationTabs() {
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

  return (
    <Tabs defaultValue="modelos">
      <TabsList>
        {catalogConfigs.map((c) => (
          <TabsTrigger key={c.key} value={c.key}>
            {c.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {catalogConfigs.map((c) => (
        <TabsContent key={c.key} value={c.key}>
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

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SingleImageUploader } from "@/components/shared/single-image-uploader";
import { toast } from "@/lib/toast";
import { getAppearanceSettings, updateAppearanceSettings } from "../services/appearance.service";
import { HomeSectionsEditor } from "./home-sections-editor";
import type { AppearanceSettings } from "../types";

export function AppearancePage() {
  const [settings, setSettings] = useState<AppearanceSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAppearanceSettings().then(setSettings);
  }, []);

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    await updateAppearanceSettings(settings);
    setSaving(false);
    toast.success("Apariencia actualizada");
  }

  if (!settings) return <Skeleton className="h-96 w-full rounded-lg" />;

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-foreground">Apariencia</h1>
          <p className="text-muted-foreground mt-1">
            Controla qué secciones se muestran en la landing pública y en qué orden
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Guardar cambios"}</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-md">
        <SingleImageUploader
          label="Logo"
          value={settings.logo}
          onChange={(img) => setSettings({ ...settings, logo: img })}
          aspect="square"
        />
        <SingleImageUploader
          label="Favicon"
          value={settings.favicon}
          onChange={(img) => setSettings({ ...settings, favicon: img })}
          aspect="square"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-foreground mb-3">Secciones del home</p>
        <HomeSectionsEditor
          sections={settings.sections}
          onChange={(sections) => setSettings({ ...settings, sections })}
        />
      </div>
    </div>
  );
}
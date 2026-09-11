"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SingleImageUploader } from "@/components/shared/single-image-uploader";
import { toast } from "@/lib/toast";
import {
  PAGE_KEYS,
  PAGE_LABELS,
  defaultPageHeader,
  type PageHeaderData,
  type PageKey,
} from "../types";
import { getPageHeaders, updatePageHeader } from "../services/page-headers.service";

export function PageHeadersEditor() {
  const [headers, setHeaders] = useState<Record<PageKey, PageHeaderData> | null>(null);
  const [activeTab, setActiveTab] = useState<PageKey>("collections");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPageHeaders()
      .then((list) => {
        const byKey = { ...(list as PageHeaderData[]).reduce(
          (acc, h) => {
            acc[h.pageKey] = h;
            return acc;
          },
          {} as Partial<Record<PageKey, PageHeaderData>>
        ) };
        for (const key of PAGE_KEYS) {
          if (!byKey[key]) byKey[key] = defaultPageHeader(key);
        }
        setHeaders(byKey as Record<PageKey, PageHeaderData>);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "No se pudieron cargar los encabezados.");
      });
  }, []);

  const updateField = useCallback(
    <K extends keyof PageHeaderData>(key: PageKey, field: K, value: PageHeaderData[K]) => {
      setHeaders((prev) => {
        if (!prev) return prev;
        return { ...prev, [key]: { ...prev[key], [field]: value } };
      });
    },
    []
  );

  async function handleSave() {
    if (!headers) return;
    const header = headers[activeTab];
    setSaving(true);
    try {
      const updated = await updatePageHeader(activeTab, header);
      setHeaders((prev) => (prev ? { ...prev, [activeTab]: updated } : prev));
      toast.success("Encabezado guardado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar el encabezado.");
    } finally {
      setSaving(false);
    }
  }

  if (!headers) return <Skeleton className="h-96 w-full rounded-lg" />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-3xl text-foreground">Encabezados de página</h1>
        <p className="text-muted-foreground mt-1">Personaliza los encabezados amplios de Colecciones, Blog y Galería</p>
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as PageKey)}>
          <TabsList className="mb-5">
            {PAGE_KEYS.map((key) => (
              <TabsTrigger key={key} value={key}>{PAGE_LABELS[key]}</TabsTrigger>
            ))}
          </TabsList>

          {PAGE_KEYS.map((key) => (
            <TabsContent key={key} value={key} className="flex flex-col gap-5 max-w-md">
              <div>
                <Label className="mb-1.5 block">Título</Label>
                <Input value={headers[key].title} onChange={(e) => updateField(key, "title", e.target.value)} />
              </div>

              <div>
                <Label className="mb-1.5 block">Subtítulo</Label>
                <Textarea rows={3} value={headers[key].subtitle} onChange={(e) => updateField(key, "subtitle", e.target.value)} />
              </div>

              <SingleImageUploader
                label="Imagen de fondo"
                value={headers[key].backgroundImage}
                onChange={(img) => updateField(key, "backgroundImage", img)}
                folder="page-headers"
              />

              <div className="rounded-md border border-border p-4 flex flex-col gap-3">
                <p className="text-sm font-medium text-foreground">Botón principal</p>
                <div>
                  <Label className="mb-1.5 block">Texto</Label>
                  <Input placeholder="Explorar ahora" value={headers[key].primaryButtonText ?? ""} onChange={(e) => updateField(key, "primaryButtonText", e.target.value)} />
                </div>
                <div>
                  <Label className="mb-1.5 block">Enlace</Label>
                  <Input placeholder="/catalogo" value={headers[key].primaryButtonLink ?? ""} onChange={(e) => updateField(key, "primaryButtonLink", e.target.value)} />
                </div>
              </div>

              <div className="rounded-md border border-border p-4 flex flex-col gap-3">
                <p className="text-sm font-medium text-foreground">Botón secundario</p>
                <div>
                  <Label className="mb-1.5 block">Texto</Label>
                  <Input placeholder="Ver galería" value={headers[key].secondaryButtonText ?? ""} onChange={(e) => updateField(key, "secondaryButtonText", e.target.value)} />
                </div>
                <div>
                  <Label className="mb-1.5 block">Enlace</Label>
                  <Input placeholder="/galeria" value={headers[key].secondaryButtonLink ?? ""} onChange={(e) => updateField(key, "secondaryButtonLink", e.target.value)} />
                </div>
              </div>

              <div>
                <Label className="mb-1.5 block">Color del texto</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={headers[key].textColor}
                    onChange={(e) => updateField(key, "textColor", e.target.value)}
                    className="h-10 w-16 cursor-pointer rounded border border-border bg-transparent"
                  />
                  <Input value={headers[key].textColor} onChange={(e) => updateField(key, "textColor", e.target.value)} />
                </div>
              </div>

              <div>
                <Label className="mb-1.5 block">Opacidad del fondo oscuro: {headers[key].overlayOpacity}%</Label>
                <input
                  type="range"
                  min={0}
                  max={90}
                  step={5}
                  value={headers[key].overlayOpacity}
                  onChange={(e) => updateField(key, "overlayOpacity", Number(e.target.value))}
                  className="w-full accent-[var(--primary)]"
                />
                <p className="text-xs text-muted-foreground mt-1">Aumenta la opacidad para mejorar la legibilidad del texto.</p>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
          <Button onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Guardar encabezado"}</Button>
        </div>
      </div>
    </div>
  );
}
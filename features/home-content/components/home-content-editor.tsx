"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SingleImageUploader } from "@/components/shared/single-image-uploader";
import { toast } from "@/lib/toast";
import {
  getHomeSectionContent,
  updateHomeSectionContent,
} from "../services/home-content.service";
import {
  HOME_SECTION_DESCRIPTIONS,
  HOME_SECTION_KEYS,
  HOME_SECTION_LABELS,
  TAG_ICON_OPTIONS,
  type HomeSectionDraft,
  type HomeSectionKey,
} from "../types";

type Drafts = Record<HomeSectionKey, HomeSectionDraft>;

export function HomeContentEditor() {
  const [drafts, setDrafts] = useState<Drafts | null>(null);
  const [activeTab, setActiveTab] = useState<HomeSectionKey>("personalize");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getHomeSectionContent()
      .then(setDrafts)
      .catch((error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : "No se pudo cargar el contenido del Home."
        );
      });
  }, []);

  const updateField = useCallback(
    <K extends keyof HomeSectionDraft>(
      sectionKey: HomeSectionKey,
      field: K,
      value: HomeSectionDraft[K]
    ) => {
      setDrafts((prev) =>
        prev
          ? {
              ...prev,
              [sectionKey]: { ...prev[sectionKey], [field]: value },
            }
          : prev
      );
    },
    []
  );

  async function handleSave() {
    if (!drafts) return;
    const draft = drafts[activeTab];

    if (draft.secondaryImages.some((img) => !img.url.trim() && img.alt.trim())) {
      toast.error("Hay imágenes secundarias sin URL. Sube la imagen o quítala.");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateHomeSectionContent(activeTab, draft);
      setDrafts((prev) => (prev ? { ...prev, [activeTab]: updated } : prev));
      toast.success(`${HOME_SECTION_LABELS[activeTab]} guardado`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo guardar la sección."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!drafts) return <Skeleton className="h-96 w-full rounded-lg" />;

  const draft = drafts[activeTab];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-3xl text-foreground">Contenido del Home</h1>
        <p className="text-muted-foreground mt-1">
          Edita los textos e imágenes de la portada. Lo que dejes vacío conserva
          el contenido actual de la tienda.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as HomeSectionKey)}>
          <TabsList className="mb-2">
            {HOME_SECTION_KEYS.map((key) => (
              <TabsTrigger key={key} value={key}>
                {HOME_SECTION_LABELS[key]}
              </TabsTrigger>
            ))}
          </TabsList>

          {HOME_SECTION_KEYS.map((key) => (
            <TabsContent key={key} value={key} className="flex flex-col gap-5">
              <p className="text-xs text-muted-foreground">
                {HOME_SECTION_DESCRIPTIONS[key]}
              </p>

              <div className="flex items-center gap-3 rounded-md border border-border bg-secondary/30 px-4 py-3">
                <Switch
                  checked={drafts[key].enabled}
                  onCheckedChange={(v) => updateField(key, "enabled", v)}
                  id={`enabled-${key}`}
                />
                <Label htmlFor={`enabled-${key}`} className="cursor-pointer">
                  Mostrar esta sección en el Home
                </Label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <Label className="mb-1.5 block">Antetítulo</Label>
                  <Input
                    placeholder="CAMPAÑA DESTACADA"
                    value={drafts[key].eyebrow}
                    onChange={(e) => updateField(key, "eyebrow", e.target.value)}
                    disabled={key === "personalize"}
                  />
                </div>

                <div>
                  <Label className="mb-1.5 block">Título</Label>
                  <Input
                    placeholder="Colección destacada"
                    value={drafts[key].sectionTitle}
                    onChange={(e) => updateField(key, "sectionTitle", e.target.value)}
                  />
                </div>
              </div>

              {key !== "brand-promise" && (
                <div>
                  <Label className="mb-1.5 block">Subtítulo</Label>
                  <Textarea
                    rows={2}
                    placeholder="Diseños que inspiran momentos especiales."
                    value={drafts[key].sectionSubtitle}
                    onChange={(e) => updateField(key, "sectionSubtitle", e.target.value)}
                  />
                </div>
              )}

              {key === "brand-promise" && (
                <div>
                  <Label className="mb-1.5 block">Descripción</Label>
                  <Textarea
                    rows={4}
                    placeholder="Telas de alta calidad, diseños únicos…"
                    value={drafts[key].bodyText}
                    onChange={(e) => updateField(key, "bodyText", e.target.value)}
                  />
                </div>
              )}

              <SingleImageUploader
                label={
                  key === "personalize"
                    ? "Imagen para Header / Banner Principal (Carrusel)"
                    : "Imagen principal"
                }
                value={drafts[key].mainImageUrl || undefined}
                onChange={(img) => updateField(key, "mainImageUrl", img ?? "")}
                folder="home"
              />

              <div>
                <Label className="mb-1.5 block">Texto alternativo de la imagen</Label>
                <Input
                  placeholder="Describe la imagen para lectores de pantalla"
                  value={drafts[key].mainImageAlt}
                  onChange={(e) => updateField(key, "mainImageAlt", e.target.value)}
                />
              </div>

              {key === "personalize" && (
                <>
                  <SingleImageUploader
                    label="Imagen para Tarjeta Promocional (4 Pasos)"
                    value={drafts[key].cardImageUrl || undefined}
                    onChange={(img) => updateField(key, "cardImageUrl", img ?? "")}
                    folder="home"
                  />
                  <p className="-mt-1 text-[11px] text-muted-foreground">
                    Esta es la foto de la tarjeta &quot;Personaliza tu pijama en 4
                    pasos&quot;. Es independiente del banner del carrusel: puedes
                    cambiarla sin tocar la imagen del hero.
                  </p>
                </>
              )}

              {key === "featured-collection" && (
                <>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <Label className="mb-1.5 block">Texto del botón</Label>
                      <Input
                        placeholder="Ver colección"
                        value={drafts[key].ctaText}
                        onChange={(e) => updateField(key, "ctaText", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">Enlace del botón</Label>
                      <Input
                        placeholder="Vacío = enlace a la colección activa"
                        value={drafts[key].ctaLink}
                        onChange={(e) => updateField(key, "ctaLink", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="rounded-md border border-border p-4 flex flex-col gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Imágenes destacadas laterales
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Son las dos fotos de la columna derecha de &quot;Colección
                        destacada&quot; (visibles en pantallas grandes). Son fijas:
                        no cambian al navegar entre colecciones.
                      </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      {[0, 1].map((index) => {
                        const image = drafts[key].secondaryImages[index] ?? { url: "", alt: "" };
                        const setSlot = (patch: Partial<{ url: string; alt: string }>) => {
                          const next = [...drafts[key].secondaryImages];
                          while (next.length <= index) next.push({ url: "", alt: "" });
                          next[index] = { ...next[index], ...patch };
                          updateField(key, "secondaryImages", next);
                        };
                        return (
                          <div key={index} className="flex flex-col gap-3 rounded-lg border border-border bg-secondary/20 p-3">
                            <SingleImageUploader
                              label={`Imagen Destacada Lateral ${index + 1}`}
                              value={image.url || undefined}
                              onChange={(url) => setSlot({ url: url ?? "" })}
                              aspect="square"
                              folder="home"
                            />
                            <div>
                              <Label className="mb-1.5 block">Texto alternativo</Label>
                              <Input
                                value={image.alt}
                                onChange={(e) => setSlot({ alt: e.target.value })}
                                placeholder={`Describe la imagen lateral ${index + 1}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {key === "personalize" && (
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <Label className="mb-1.5 block">Texto del botón</Label>
                    <Input
                      placeholder="Diseñar mi pijama"
                      value={drafts[key].ctaText}
                      onChange={(e) => updateField(key, "ctaText", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Enlace del botón</Label>
                    <Input
                      placeholder="/personaliza"
                      value={drafts[key].ctaLink}
                      onChange={(e) => updateField(key, "ctaLink", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {key === "brand-promise" && (
                <div className="rounded-md border border-border p-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      Etiquetas de valores
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateField(key, "tags", [
                          ...drafts[key].tags,
                          { label: "", icon: "tag" },
                        ])
                      }
                    >
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Agregar etiqueta
                    </Button>
                  </div>

                  {drafts[key].tags.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Sin etiquetas. Se muestran las de respaldo.
                    </p>
                  )}

                  {drafts[key].tags.map((tag, index) => (
                    <div key={index} className="flex items-end gap-3">
                      <div className="flex-1">
                        <Label className="mb-1.5 block">Texto</Label>
                        <Input
                          value={tag.label}
                          onChange={(e) => {
                            const next = [...drafts[key].tags];
                            next[index] = { ...next[index], label: e.target.value };
                            updateField(key, "tags", next);
                          }}
                        />
                      </div>

                      <div className="w-44">
                        <Label className="mb-1.5 block">Icono</Label>
                        <Select
                          value={tag.icon}
                          onValueChange={(value) => {
                            const next = [...drafts[key].tags];
                            next[index] = { ...next[index], icon: value };
                            updateField(key, "tags", next);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TAG_ICON_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          updateField(
                            key,
                            "tags",
                            drafts[key].tags.filter((_, i) => i !== index)
                          )
                        }
                        className="h-9 w-9 rounded-md border border-border flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"
                        aria-label={`Quitar etiqueta ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mr-auto self-center">
            {draft.enabled ? "Sección visible en el Home" : "Sección oculta"}
          </p>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar sección"}
          </Button>
        </div>
      </div>
    </div>
  );
}
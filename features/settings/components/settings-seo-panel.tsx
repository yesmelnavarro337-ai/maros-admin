"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SingleImageUploader } from "@/components/shared/single-image-uploader";
import { Search, CheckCircle2, AlertCircle } from "lucide-react";
import type { SeoSettings } from "../types";

interface PanelProps {
  value: SeoSettings;
  onChange: (value: SeoSettings) => void;
}

const ROBOTS_OPTIONS = [
  "index, follow",
  "noindex, follow",
  "index, nofollow",
  "noindex, nofollow",
];

const LANGUAGE_SEO_OPTIONS = ["es", "es-CO", "en", "pt"];

export function SettingsSeoPanel({ value, onChange }: PanelProps) {
  const titleLen = value.metaTitle.length;
  const descLen = value.metaDescription.length;

  const isTitleOk = titleLen > 10 && titleLen <= 60;
  const isDescOk = descLen > 50 && descLen <= 160;
  const hasKeywords = value.keywords.trim().length > 0;
  const hasSocialImg = !!value.socialImage;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8">
      {/* Formulario */}
      <div className="flex flex-col gap-5">
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <Label className="text-sm font-medium">Meta título global (SEO) *</Label>
            <span
              className={`text-xs font-medium ${
                titleLen > 60 ? "text-red-500 font-semibold" : "text-muted-foreground"
              }`}
            >
              {titleLen}/60 caracteres
            </span>
          </div>
          <Input
            maxLength={60}
            value={value.metaTitle}
            onChange={(e) => onChange({ ...value, metaTitle: e.target.value })}
            placeholder="Maros Pijamas | Pijamas al por Mayor y Detal en Colombia"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <Label className="text-sm font-medium">Meta descripción global *</Label>
            <span
              className={`text-xs font-medium ${
                descLen > 160 ? "text-red-500 font-semibold" : "text-muted-foreground"
              }`}
            >
              {descLen}/160 caracteres
            </span>
          </div>
          <Textarea
            rows={3}
            maxLength={160}
            value={value.metaDescription}
            onChange={(e) => onChange({ ...value, metaDescription: e.target.value })}
            placeholder="Fabricante de pijamas en Colombia. Compra al por mayor y detal con envíos a todo el país..."
          />
        </div>

        <div>
          <Label className="mb-1.5 block text-sm font-medium">Palabras clave (separadas por comas)</Label>
          <Input
            value={value.keywords}
            onChange={(e) => onChange({ ...value, keywords: e.target.value })}
            placeholder="pijamas, moda, satén, ropa de descanso, medellín"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label className="mb-1.5 block text-sm font-medium">URL Canónica</Label>
            <Input
              value={value.canonicalUrl}
              onChange={(e) => onChange({ ...value, canonicalUrl: e.target.value })}
              placeholder="https://marospijamas.com"
            />
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium">Etiqueta de Robots</Label>
            <Select
              value={value.robotsTag}
              onValueChange={(v) => onChange({ ...value, robotsTag: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROBOTS_OPTIONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium">Idioma HTML</Label>
            <Select
              value={value.language}
              onValueChange={(v) => onChange({ ...value, language: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_SEO_OPTIONS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="mb-2 block text-sm font-medium">Open Graph Image (OG Image opcional)</Label>
          <SingleImageUploader
            label="Subir imagen de vista previa en redes"
            value={value.socialImage}
            onChange={(img) => onChange({ ...value, socialImage: img })}
            folder="settings"
          />
          <p className="text-xs text-muted-foreground mt-1">Recomendado: 1200x630px para Facebook, WhatsApp y X.</p>
        </div>
      </div>

      {/* Live Preview Sidebar */}
      <div className="flex flex-col gap-5">
        {/* Vista previa SERP de Google */}
        <div className="bg-card border border-border/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            <Search className="h-3.5 w-3.5 text-primary" />
            Vista Previa en Google (SERP)
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-4 w-4 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-700">
                M
              </div>
              <div className="text-[11px] text-slate-700 truncate">
                {value.canonicalUrl || "https://marospijamas.com"}
              </div>
            </div>
            <h3 className="text-sm font-medium text-blue-800 hover:underline cursor-pointer line-clamp-1">
              {value.metaTitle || "Título de tu sitio web en Google"}
            </h3>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
              {value.metaDescription || "Descripción meta que aparecerá en los resultados de búsqueda de Google..."}
            </p>
          </div>
        </div>

        {/* Checklist Dinámico Consejos SEO */}
        <div className="bg-muted/30 border border-border/80 rounded-xl p-4 space-y-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Checklist de Consejos SEO
          </h4>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              {isTitleOk ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
              )}
              <span className={isTitleOk ? "text-foreground" : "text-muted-foreground"}>
                Título tiene entre 10 y 60 caracteres ({titleLen})
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isDescOk ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
              )}
              <span className={isDescOk ? "text-foreground" : "text-muted-foreground"}>
                Meta descripción entre 50 y 160 caracteres ({descLen})
              </span>
            </div>

            <div className="flex items-center gap-2">
              {hasKeywords ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
              )}
              <span className={hasKeywords ? "text-foreground" : "text-muted-foreground"}>
                Palabras clave configuradas
              </span>
            </div>

            <div className="flex items-center gap-2">
              {hasSocialImg ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
              )}
              <span className={hasSocialImg ? "text-foreground" : "text-muted-foreground"}>
                Imagen Open Graph configurada
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
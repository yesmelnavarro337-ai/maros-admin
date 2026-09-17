"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SingleImageUploader } from "@/components/shared/single-image-uploader";
import type { GeneralSettings } from "../types";

interface PanelProps {
  value: GeneralSettings;
  onChange: (value: GeneralSettings) => void;
}

const CURRENCY_OPTIONS = [
  "COP ($) - Peso Colombiano",
  "USD ($) - Dólar Estadounidense",
  "MXN ($) - Peso Mexicano",
  "EUR (€) - Euro",
];

const TIMEZONE_OPTIONS = [
  "America/Bogota (UTC-5)",
  "America/Mexico_City (UTC-6)",
  "America/Argentina/Buenos_Aires (UTC-3)",
  "America/New_York (UTC-5)",
];

const LANGUAGE_OPTIONS = [
  "Español (Colombia)",
  "Español (Internacional)",
  "Inglés (EE. UU.)",
];

const DATE_FORMAT_OPTIONS = [
  "DD/MM/YYYY (ej. 16/09/2026)",
  "MM/DD/YYYY (ej. 09/16/2026)",
  "YYYY-MM-DD (ej. 2026-09-16)",
];

export function SettingsGeneralPanel({ value, onChange }: PanelProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
      <div className="flex flex-col gap-5">
        <div>
          <Label className="mb-1.5 block text-sm font-medium">Nombre del sitio *</Label>
          <Input
            value={value.siteName}
            onChange={(e) => onChange({ ...value, siteName: e.target.value })}
            placeholder="Ej. Maros Pijamas"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <Label className="text-sm font-medium">Descripción corta</Label>
            <span className="text-xs text-muted-foreground">
              {value.description.length}/160
            </span>
          </div>
          <Textarea
            rows={3}
            maxLength={160}
            value={value.description}
            onChange={(e) => onChange({ ...value, description: e.target.value })}
            placeholder="Breve descripción corporativa de la marca..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="mb-1.5 block text-sm font-medium">Moneda principal</Label>
            <Select
              value={value.currency}
              onValueChange={(v) => onChange({ ...value, currency: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium">Zona horaria</Label>
            <Select
              value={value.timezone}
              onValueChange={(v) => onChange({ ...value, timezone: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONE_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium">Idioma principal</Label>
            <Select
              value={value.language}
              onValueChange={(v) => onChange({ ...value, language: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_OPTIONS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium">Formato de fecha</Label>
            <Select
              value={value.dateFormat}
              onValueChange={(v) => onChange({ ...value, dateFormat: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATE_FORMAT_OPTIONS.map((df) => (
                  <SelectItem key={df} value={df}>
                    {df}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-amber-200/60 bg-amber-50/40 p-4 mt-2">
          <div>
            <p className="text-sm font-semibold text-foreground">Modo de mantenimiento</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Si está activo, el sitio público mostrará una pantalla de &quot;Próximamente&quot;.
            </p>
          </div>
          <Switch
            checked={value.maintenanceMode}
            onCheckedChange={(v) => onChange({ ...value, maintenanceMode: v })}
          />
        </div>
      </div>

      {/* Sidebar de Marca / Uploads */}
      <div className="flex flex-col gap-6 bg-muted/20 border border-border/80 rounded-xl p-5">
        <div>
          <Label className="mb-2 block font-medium text-sm">Logo principal (Dropzone 512x512px PNG)</Label>
          <SingleImageUploader
            label="Subir Logo"
            value={value.logo}
            onChange={(img) => onChange({ ...value, logo: img })}
            aspect="square"
            folder="settings"
          />
          <p className="text-xs text-muted-foreground mt-1.5">Recomendado: 512x512px PNG con fondo transparente.</p>
        </div>

        <div className="pt-4 border-t border-border">
          <Label className="mb-2 block font-medium text-sm">Favicon (32x32px PNG)</Label>
          <SingleImageUploader
            label="Cambiar Favicon"
            value={value.favicon}
            onChange={(img) => onChange({ ...value, favicon: img })}
            aspect="square"
            folder="settings"
          />
          <p className="text-xs text-muted-foreground mt-1.5">Ícono del navegador en 32x32px o 64x64px PNG.</p>
        </div>
      </div>
    </div>
  );
}
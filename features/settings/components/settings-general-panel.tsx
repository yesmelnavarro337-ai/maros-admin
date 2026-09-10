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

const CURRENCY_OPTIONS = ["COP - Peso Colombiano", "USD - Dólar Estadounidense", "MXN - Peso Mexicano"];
const TIMEZONE_OPTIONS = ["UTC-05:00 Bogotá", "UTC-06:00 Ciudad de México", "UTC-03:00 Buenos Aires"];
const LANGUAGE_OPTIONS = ["Español", "Inglés", "Portugués"];

export function SettingsGeneralPanel({ value, onChange }: PanelProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
      <div className="flex flex-col gap-4">
        <div>
          <Label className="mb-1.5 block">Nombre del sitio</Label>
          <Input value={value.siteName} onChange={(e) => onChange({ ...value, siteName: e.target.value })} />
        </div>

        <div>
          <Label className="mb-1.5 block">Descripción</Label>
          <Textarea rows={2} value={value.description} onChange={(e) => onChange({ ...value, description: e.target.value })} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <Label className="mb-1.5 block text-xs">Moneda</Label>
            <Select value={value.currency} onValueChange={(v) => onChange({ ...value, currency: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block text-xs">Zona horaria</Label>
            <Select value={value.timezone} onValueChange={(v) => onChange({ ...value, timezone: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONE_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block text-xs">Idioma</Label>
            <Select value={value.language} onValueChange={(v) => onChange({ ...value, language: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_OPTIONS.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-md bg-secondary/50 px-3 py-2.5">
          <div>
            <p className="text-sm font-medium text-foreground">Activar modo mantenimiento</p>
            <p className="text-xs text-muted-foreground">El sitio mostrará una página de mantenimiento a visitantes</p>
          </div>
          <Switch checked={value.maintenanceMode} onCheckedChange={(v) => onChange({ ...value, maintenanceMode: v })} />
        </div>
      </div>

      <div>
        <SingleImageUploader label="Logo" value={value.logo} onChange={(img) => onChange({ ...value, logo: img })} aspect="square" folder="settings" />
        <p className="text-xs text-muted-foreground mt-1.5">Recomendado: 512x512px, fondo transparente.</p>
      </div>
    </div>
  );
}
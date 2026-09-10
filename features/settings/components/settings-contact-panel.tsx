import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ContactSettings } from "../types";

export function SettingsContactPanel({ value, onChange }: { value: ContactSettings; onChange: (v: ContactSettings) => void }) {
  return (
    <div className="flex flex-col gap-4 max-w-md">
      <div>
        <Label className="mb-1.5 block">Dirección</Label>
        <Input value={value.address} onChange={(e) => onChange({ ...value, address: e.target.value })} placeholder="Mz 3 Casa 98 Urb. Doña Clara, Valledupar" />
        <p className="text-xs text-muted-foreground mt-1.5">Se muestra en la sección de Contacto del sitio público.</p>
      </div>
      <div>
        <Label className="mb-1.5 block">Horario de atención</Label>
        <Input value={value.businessHours} onChange={(e) => onChange({ ...value, businessHours: e.target.value })} placeholder="Lunes a Sábado · 8:00 a.m. – 6:00 p.m." />
      </div>
    </div>
  );
}
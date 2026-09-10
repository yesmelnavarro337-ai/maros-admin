import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { WhatsappSettings } from "../types";

export function SettingsWhatsappPanel({ value, onChange }: { value: WhatsappSettings; onChange: (v: WhatsappSettings) => void }) {
  return (
    <div className="flex flex-col gap-4 max-w-md">
      <div>
        <Label className="mb-1.5 block">Número de WhatsApp</Label>
        <Input value={value.phoneNumber} onChange={(e) => onChange({ ...value, phoneNumber: e.target.value })} placeholder="+57 300 133 4567" />
      </div>
      <div>
        <Label className="mb-1.5 block">Mensaje predeterminado</Label>
        <Textarea rows={3} value={value.defaultMessage} onChange={(e) => onChange({ ...value, defaultMessage: e.target.value })} />
        <p className="text-xs text-muted-foreground mt-1.5">Este mensaje también se usa como base para el botón de WhatsApp en Cotizaciones.</p>
      </div>
    </div>
  );
}
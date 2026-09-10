import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { EmailSettings } from "../types";

export function SettingsEmailPanel({ value, onChange }: { value: EmailSettings; onChange: (v: EmailSettings) => void }) {
  return (
    <div className="flex flex-col gap-4 max-w-md">
      <div>
        <Label className="mb-1.5 block">Nombre del remitente</Label>
        <Input value={value.fromName} onChange={(e) => onChange({ ...value, fromName: e.target.value })} />
      </div>
      <div>
        <Label className="mb-1.5 block">Correo del remitente</Label>
        <Input value={value.fromEmail} onChange={(e) => onChange({ ...value, fromEmail: e.target.value })} />
      </div>
      <div className="flex items-center justify-between rounded-md bg-secondary/50 px-3 py-2.5">
        <div>
          <p className="text-sm font-medium text-foreground">Notificar nuevas cotizaciones</p>
          <p className="text-xs text-muted-foreground">Recibe un correo cada vez que llega una cotización</p>
        </div>
        <Switch checked={value.notifyNewQuotation} onCheckedChange={(v) => onChange({ ...value, notifyNewQuotation: v })} />
      </div>
    </div>
  );
}
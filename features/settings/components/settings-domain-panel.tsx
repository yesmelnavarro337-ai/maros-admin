import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { DomainSettings } from "../types";

export function SettingsDomainPanel({ value, onChange }: { value: DomainSettings; onChange: (v: DomainSettings) => void }) {
  return (
    <div className="flex flex-col gap-4 max-w-md">
      <div>
        <Label className="mb-1.5 block">Dominio personalizado</Label>
        <Input value={value.customDomain} onChange={(e) => onChange({ ...value, customDomain: e.target.value })} />
        <p className="text-xs text-muted-foreground mt-1.5">La conexión real del dominio se configura cuando desplieguemos a producción.</p>
      </div>
      <div className="flex items-center justify-between rounded-md bg-secondary/50 px-3 py-2.5">
        <p className="text-sm font-medium text-foreground">SSL habilitado</p>
        <Switch checked={value.sslEnabled} onCheckedChange={(v) => onChange({ ...value, sslEnabled: v })} />
      </div>
    </div>
  );
}
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { SecuritySettings } from "../types";

export function SettingsSecurityPanel({ value, onChange }: { value: SecuritySettings; onChange: (v: SecuritySettings) => void }) {
  return (
    <div className="flex flex-col gap-4 max-w-md">
      <div className="flex items-center justify-between rounded-md bg-secondary/50 px-3 py-2.5">
        <div>
          <p className="text-sm font-medium text-foreground">Autenticación de dos factores</p>
          <p className="text-xs text-muted-foreground">Se activa completamente cuando conectemos JWT real</p>
        </div>
        <Switch checked={value.twoFactorEnabled} onCheckedChange={(v) => onChange({ ...value, twoFactorEnabled: v })} />
      </div>
      <div>
        <Label className="mb-1.5 block">Tiempo de expiración de sesión (minutos)</Label>
        <Input
          type="number"
          value={value.sessionTimeoutMinutes}
          onChange={(e) => onChange({ ...value, sessionTimeoutMinutes: Number(e.target.value) })}
        />
      </div>
    </div>
  );
}
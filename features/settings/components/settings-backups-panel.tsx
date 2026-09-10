import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BackupSettings } from "../types";

export function SettingsBackupsPanel({ value, onChange }: { value: BackupSettings; onChange: (v: BackupSettings) => void }) {
  return (
    <div className="flex flex-col gap-4 max-w-md">
      <div className="flex items-center justify-between rounded-md bg-secondary/50 px-3 py-2.5">
        <p className="text-sm font-medium text-foreground">Copias de seguridad automáticas</p>
        <Switch checked={value.autoBackupEnabled} onCheckedChange={(v) => onChange({ ...value, autoBackupEnabled: v })} />
      </div>
      <div>
        <Label className="mb-1.5 block">Frecuencia</Label>
        <Select value={value.frequency} onValueChange={(v) => onChange({ ...value, frequency: v as BackupSettings["frequency"] })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="diaria">Diaria</SelectItem>
            <SelectItem value="semanal">Semanal</SelectItem>
            <SelectItem value="mensual">Mensual</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {value.lastBackupDate && (
        <p className="text-xs text-muted-foreground">Última copia: {value.lastBackupDate}</p>
      )}
    </div>
  );
}
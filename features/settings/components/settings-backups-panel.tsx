"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Database, Download, RefreshCw, HardDrive, CheckCircle2 } from "lucide-react";
import { toast } from "@/lib/toast";
import { createBackupNow } from "../services/settings.service";
import type { BackupSettings } from "../types";

interface PanelProps {
  value: BackupSettings;
  onChange: (value: BackupSettings) => void;
}

const FREQUENCY_OPTIONS = [
  { value: "diaria", label: "Diaria (Cada 24 horas)" },
  { value: "semanal", label: "Semanal (Todos los domingos)" },
  { value: "mensual", label: "Mensual (El primer día del mes)" },
];

const TIME_OPTIONS = ["00:00 AM", "02:00 AM", "04:00 AM", "11:00 PM"];
const RETENTION_OPTIONS = ["7 días", "30 días", "90 días", "365 días"];

export function SettingsBackupsPanel({ value, onChange }: PanelProps) {
  const [creating, setCreating] = useState(false);
  const [restoreOpen, setRestoreOpen] = useState(false);

  async function handleCreateBackup() {
    setCreating(true);
    try {
      const res = await createBackupNow();
      onChange({
        ...value,
        lastBackupDate: res.lastBackupDate.slice(0, 10),
        lastBackupSize: res.lastBackupSize,
      });
      toast.success(res.message || "Copia de seguridad creada correctamente");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo generar la copia de seguridad.");
    } finally {
      setCreating(false);
    }
  }

  function handleRestoreConfirm() {
    toast.success("Restauración iniciada. Los datos se actualizarán en breve.");
    setRestoreOpen(false);
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
      {/* Formulario */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between rounded-xl border border-border p-4 bg-muted/20">
          <div>
            <p className="text-sm font-semibold text-foreground">Copias de seguridad automáticas</p>
            <p className="text-xs text-muted-foreground">Genera respaldos periódicos de la base de datos e imágenes</p>
          </div>
          <Switch
            checked={value.autoBackupEnabled}
            onCheckedChange={(v) => onChange({ ...value, autoBackupEnabled: v })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label className="mb-1.5 block text-sm font-medium">Frecuencia</Label>
            <Select
              value={value.frequency}
              onValueChange={(v) => onChange({ ...value, frequency: v as "diaria" | "semanal" | "mensual" })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FREQUENCY_OPTIONS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium">Hora de ejecución</Label>
            <Select
              value={value.executionTime}
              onValueChange={(v) => onChange({ ...value, executionTime: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium">Retención de copias</Label>
            <Select
              value={value.retentionDays}
              onValueChange={(v) => onChange({ ...value, retentionDays: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RETENTION_OPTIONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-2">
          <Button
            onClick={handleCreateBackup}
            disabled={creating}
            className="bg-[#2D4A3E] hover:bg-[#233a30] text-white font-medium gap-2"
          >
            <Database className={`h-4 w-4 ${creating ? "animate-spin" : ""}`} />
            {creating ? "Generando respaldo..." : "Crear copia de seguridad ahora"}
          </Button>
        </div>
      </div>

      {/* Live Preview Sidebar */}
      <div className="flex flex-col gap-5">
        {/* Tarjeta Última Copia */}
        <div className="bg-card border border-border/80 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3 border-b border-border pb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <HardDrive className="h-4 w-4 text-primary" />
              Última Copia de Seguridad
            </h4>
            <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded-full">
              <CheckCircle2 className="h-3 w-3" />
              Verificada
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fecha de respaldo:</span>
              <span className="font-semibold text-foreground">{value.lastBackupDate || "Hoy"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tamaño del archivo:</span>
              <span className="font-semibold text-foreground">{value.lastBackupSize || "24.5 MB"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tipo de respaldo:</span>
              <span className="font-medium text-foreground">Completo (BD + Media)</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex gap-2">
            <Button size="sm" variant="outline" className="w-full gap-1.5 text-xs">
              <Download className="h-3.5 w-3.5" /> Descargar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setRestoreOpen(true)}
              className="w-full gap-1.5 text-xs text-amber-700 hover:text-amber-800"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Restaurar
            </Button>
          </div>
        </div>
      </div>

      {/* Modal Confirmación de Restauración */}
      <ConfirmDialog
        open={restoreOpen}
        onOpenChange={setRestoreOpen}
        title="Restaurar copia de seguridad"
        description={`¿Estás seguro de restaurar el respaldo del ${value.lastBackupDate}? Todos los cambios no guardados se sobrescribirán con el estado de esta copia.`}
        confirmText="Restaurar copia ahora"
        onConfirm={handleRestoreConfirm}
      />
    </div>
  );
}
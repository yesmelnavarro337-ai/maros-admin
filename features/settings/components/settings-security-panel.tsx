"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, ShieldAlert, CheckCircle2, Laptop, LogOut } from "lucide-react";
import { toast } from "@/lib/toast";
import type { SecuritySettings } from "../types";

interface PanelProps {
  value: SecuritySettings;
  onChange: (value: SecuritySettings) => void;
}

const ATTEMPTS_OPTIONS = [3, 5, 10];
const LOCKOUT_OPTIONS = [15, 30, 60];
const TIMEOUT_OPTIONS = [30, 60, 120, 240];

export function SettingsSecurityPanel({ value, onChange }: PanelProps) {
  function handleCloseOtherSessions() {
    toast.success("Se cerraron todas las demás sesiones activas correctamente.");
  }

  const isSecured = value.twoFactorEnabled && value.maxAttempts <= 5 && value.securityNotificationsEnabled;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
      {/* Formulario */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between rounded-xl border border-border p-4 bg-muted/20">
          <div>
            <p className="text-sm font-semibold text-foreground">Autenticación de Dos Factores (2FA)</p>
            <p className="text-xs text-muted-foreground">Requiere un código temporal adicional para iniciar sesión</p>
          </div>
          <Switch
            checked={value.twoFactorEnabled}
            onCheckedChange={(v) => onChange({ ...value, twoFactorEnabled: v })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label className="mb-1.5 block text-sm font-medium">Límite de intentos de acceso</Label>
            <Select
              value={value.maxAttempts.toString()}
              onValueChange={(v) => onChange({ ...value, maxAttempts: parseInt(v) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ATTEMPTS_OPTIONS.map((a) => (
                  <SelectItem key={a} value={a.toString()}>
                    {a} intentos fallidos
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium">Tiempo de bloqueo</Label>
            <Select
              value={value.lockoutDurationMinutes.toString()}
              onValueChange={(v) => onChange({ ...value, lockoutDurationMinutes: parseInt(v) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOCKOUT_OPTIONS.map((l) => (
                  <SelectItem key={l} value={l.toString()}>
                    {l} minutos
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium">Cierre de sesión inactiva</Label>
            <Select
              value={value.sessionTimeoutMinutes.toString()}
              onValueChange={(v) => onChange({ ...value, sessionTimeoutMinutes: parseInt(v) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEOUT_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t.toString()}>
                    {t} minutos
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border p-4 bg-muted/20">
          <div>
            <p className="text-sm font-semibold text-foreground">Notificaciones de seguridad por email</p>
            <p className="text-xs text-muted-foreground">Alertar por correo si se detectan inicios de sesión desde nuevas ubicaciones</p>
          </div>
          <Switch
            checked={value.securityNotificationsEnabled}
            onCheckedChange={(v) => onChange({ ...value, securityNotificationsEnabled: v })}
          />
        </div>

        {/* Card Sesiones Activas */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Laptop className="h-4 w-4 text-primary" />
              Sesiones Activas
            </h4>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
              1 sesión activa (Este dispositivo)
            </span>
          </div>

          <div className="flex items-center justify-between text-xs py-1">
            <div>
              <p className="font-semibold text-foreground">Navegador actual — Chrome / Windows 11</p>
              <p className="text-muted-foreground text-[11px]">IP: 190.158.42.12 — Medellín, Colombia</p>
            </div>
            <Button size="sm" variant="outline" onClick={handleCloseOtherSessions} className="gap-1.5 text-xs">
              <LogOut className="h-3.5 w-3.5" />
              Cerrar otras sesiones
            </Button>
          </div>
        </div>
      </div>

      {/* Live Preview Sidebar */}
      <div className="flex flex-col gap-5">
        {/* Badge Estado de Seguridad */}
        <div className="bg-card border border-border/80 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Estado de Seguridad
            </h4>
            {isSecured ? (
              <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
                <Shield className="h-3.5 w-3.5 text-emerald-700" />
                Excelente
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-700" />
                Recomendaciones
              </span>
            )}
          </div>

          {/* Checklist Recomendaciones */}
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2">
              {value.twoFactorEnabled ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-medium text-foreground">Autenticación de dos factores (2FA)</p>
                <p className="text-[11px] text-muted-foreground">
                  {value.twoFactorEnabled ? "Activada y protegiendo accesos" : "Se recomienda activar 2FA para administradores"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Protección de intentos de login</p>
                <p className="text-[11px] text-muted-foreground">
                  Máximo {value.maxAttempts} intentos antes de bloqueo temporal ({value.lockoutDurationMinutes} min)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              {value.securityNotificationsEnabled ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-medium text-foreground">Alertas de accesos sospechosos</p>
                <p className="text-[11px] text-muted-foreground">
                  {value.securityNotificationsEnabled ? "Notificaciones enviadas por correo" : "Desactivadas"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
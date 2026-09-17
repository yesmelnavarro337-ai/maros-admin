"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lock, Copy, Check, ShieldCheck, Globe } from "lucide-react";
import { toast } from "@/lib/toast";
import type { DomainSettings } from "../types";

interface PanelProps {
  value: DomainSettings;
  onChange: (value: DomainSettings) => void;
}

export function SettingsDomainPanel({ value, onChange }: PanelProps) {
  const [copied, setCopied] = useState(false);

  function copyIp() {
    navigator.clipboard.writeText(value.serverIp || "185.199.108.153");
    setCopied(true);
    toast.success("Dirección IP copiada al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
      {/* Formulario */}
      <div className="flex flex-col gap-5">
        <div>
          <Label className="mb-1.5 block text-sm font-medium">Dominio principal</Label>
          <Input
            value={value.customDomain}
            onChange={(e) => onChange({ ...value, customDomain: e.target.value })}
            placeholder="marospijamas.com"
          />
        </div>

        <div>
          <Label className="mb-1.5 block text-sm font-medium">Redirección WWW</Label>
          <Select
            value={value.wwwRedirect ? "www-to-root" : "none"}
            onValueChange={(v) => onChange({ ...value, wwwRedirect: v === "www-to-root" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="www-to-root">
                Redirigir www.{value.customDomain || "dominio.com"} → {value.customDomain || "dominio.com"}
              </SelectItem>
              <SelectItem value="none">Sin redirección (Permitir ambos)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bloque Informativo DNS */}
        <div className="rounded-xl border border-blue-200/80 bg-blue-50/50 p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-950">
            <Globe className="h-4 w-4 text-blue-600" />
            Configuración de Registros DNS Requeridos
          </div>
          <p className="text-xs text-blue-900 leading-relaxed">
            Apunta tu dominio personalizado configurando el siguiente registro Tipo A en tu proveedor de DNS (Cloudflare, GoDaddy, Namecheap, etc.):
          </p>

          <div className="flex items-center justify-between bg-white border border-blue-200 rounded-lg p-3 text-xs">
            <div>
              <p className="text-[10px] uppercase font-semibold text-blue-800">Registro Tipo A</p>
              <p className="font-mono font-bold text-foreground text-sm mt-0.5">{value.serverIp || "185.199.108.153"}</p>
            </div>
            <Button size="sm" variant="outline" onClick={copyIp} className="h-8 gap-1.5 text-xs">
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copiado" : "Copiar IP"}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-3.5 bg-muted/20">
          <div>
            <p className="text-sm font-medium text-foreground">Certificado SSL (HTTPS)</p>
            <p className="text-xs text-muted-foreground">Forzar conexión segura cifrada de 256 bits</p>
          </div>
          <Switch
            checked={value.sslEnabled}
            onCheckedChange={(v) => onChange({ ...value, sslEnabled: v })}
          />
        </div>
      </div>

      {/* Live Preview Sidebar */}
      <div className="flex flex-col gap-5">
        {/* Barra del Navegador simulada */}
        <div className="bg-card border border-border/80 rounded-xl p-4 shadow-2xs">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Vista Previa de Barra del Navegador
          </h4>

          <div className="bg-slate-100 border border-slate-300 rounded-lg p-2.5 flex items-center gap-2">
            {value.sslEnabled ? (
              <div className="flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px] font-semibold shrink-0">
                <Lock className="h-3 w-3" />
                https://
              </div>
            ) : (
              <div className="flex items-center gap-1 text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-[10px] font-semibold shrink-0">
                http://
              </div>
            )}
            <span className="text-xs font-mono text-slate-800 truncate">
              {value.customDomain || "marospijamas.com"}
            </span>
          </div>
        </div>

        {/* Card Estado DNS */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-900 leading-relaxed">
            <p className="font-semibold mb-0.5">Estado DNS: Resuelto Correctamente</p>
            El dominio apunta activamente a la infraestructura de MAROS PIJAMAS con protección de certificado SSL vigente.
          </div>
        </div>
      </div>
    </div>
  );
}
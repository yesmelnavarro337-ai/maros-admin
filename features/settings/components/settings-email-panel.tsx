"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Mail, CheckCircle2 } from "lucide-react";
import type { EmailSettings } from "../types";

interface PanelProps {
  value: EmailSettings;
  onChange: (value: EmailSettings) => void;
}

export function SettingsEmailPanel({ value, onChange }: PanelProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8">
      {/* Formulario */}
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="mb-1.5 block text-sm font-medium">Nombre del remitente</Label>
            <Input
              value={value.fromName}
              onChange={(e) => onChange({ ...value, fromName: e.target.value })}
              placeholder="Maros Pijamas"
            />
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium">Correo electrónico del remitente</Label>
            <Input
              type="email"
              value={value.fromEmail}
              onChange={(e) => onChange({ ...value, fromEmail: e.target.value })}
              placeholder="ventas@marospijamas.com"
            />
          </div>
        </div>

        <div>
          <Label className="mb-1.5 block text-sm font-medium">Asunto predeterminado</Label>
          <Input
            value={value.defaultSubject}
            onChange={(e) => onChange({ ...value, defaultSubject: e.target.value })}
            placeholder="Confirmación de solicitud de cotización - Maros Pijamas"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <Label className="text-sm font-medium">Mensaje de respuesta automática</Label>
            <span className="text-xs text-muted-foreground">
              {value.autoReplyMessage.length}/500
            </span>
          </div>
          <Textarea
            rows={4}
            maxLength={500}
            value={value.autoReplyMessage}
            onChange={(e) => onChange({ ...value, autoReplyMessage: e.target.value })}
            placeholder="Gracias por escribirnos. Nuestro equipo revisará tu solicitud de cotización en breve..."
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-3.5 bg-muted/20">
          <div>
            <p className="text-sm font-medium text-foreground">Activar notificaciones administrativas</p>
            <p className="text-xs text-muted-foreground">Recibir una alerta por correo cuando un cliente pida una cotización</p>
          </div>
          <Switch
            checked={value.notifyNewQuotation}
            onCheckedChange={(v) => onChange({ ...value, notifyNewQuotation: v })}
          />
        </div>
      </div>

      {/* Live Preview Sidebar (Plantilla HTML de correo) */}
      <div className="flex flex-col gap-4">
        <div className="bg-card border border-border/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-primary" />
              Vista Previa de Correo HTML
            </h4>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
              Plantilla V2
            </span>
          </div>

          {/* Simulación de Email Client */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
            <div className="space-y-1 mb-3 border-b border-slate-200 pb-2 text-[11px]">
              <p>
                <span className="font-semibold text-slate-700">De:</span> {value.fromName || "Maros Pijamas"} &lt;{value.fromEmail || "ventas@marospijamas.com"}&gt;
              </p>
              <p>
                <span className="font-semibold text-slate-700">Asunto:</span> {value.defaultSubject || "Confirmación de cotización"}
              </p>
            </div>

            {/* Cuerpo del correo HTML */}
            <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
              <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs">MAROS PIJAMAS</span>
                <span className="text-[10px] text-slate-400">Notificación Oficial</span>
              </div>

              <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs">
                <CheckCircle2 className="h-4 w-4" />
                ¡Solicitud recibida con éxito!
              </div>

              <p className="text-slate-600 text-[11px] leading-relaxed">
                {value.autoReplyMessage || "Gracias por contactarnos. Pronto un asesor atenderá tu pedido."}
              </p>

              <div className="bg-slate-50 p-2.5 rounded text-[10px] text-slate-500 border border-slate-100 space-y-1">
                <p><strong className="text-slate-700">Resumen de Cotización:</strong> 12x Pijama Satén Dama</p>
                <p><strong className="text-slate-700">Estado:</strong> En revisión por asesor comercial</p>
              </div>

              <div className="pt-2 text-center text-[10px] text-slate-400 border-t border-slate-100">
                MAROS PIJAMAS — Medellín, Colombia
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
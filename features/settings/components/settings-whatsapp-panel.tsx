"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SingleImageUploader } from "@/components/shared/single-image-uploader";
import { MessageSquare, Lightbulb } from "lucide-react";
import type { WhatsappSettings } from "../types";

interface PanelProps {
  value: WhatsappSettings;
  onChange: (value: WhatsappSettings) => void;
}

export function SettingsWhatsappPanel({ value, onChange }: PanelProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
      {/* Formulario */}
      <div className="flex flex-col gap-5">
        <div>
          <Label className="mb-1.5 block text-sm font-medium">Número de WhatsApp (con código de país)</Label>
          <Input
            value={value.phoneNumber}
            onChange={(e) => onChange({ ...value, phoneNumber: e.target.value })}
            placeholder="+573013169974"
          />
          <p className="text-xs text-muted-foreground mt-1">Formato internacional sin espacios ni guiones (ej. +573013169974).</p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <Label className="text-sm font-medium">Mensaje predeterminado</Label>
            <span className="text-xs text-muted-foreground">{value.defaultMessage.length}/160</span>
          </div>
          <Textarea
            rows={3}
            maxLength={160}
            value={value.defaultMessage}
            onChange={(e) => onChange({ ...value, defaultMessage: e.target.value })}
            placeholder="¡Hola! Me gustaría solicitar información sobre ventas al por mayor."
          />
          <p className="text-xs text-muted-foreground mt-1">Este texto se abrirá automáticamente en la app del cliente.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="mb-1.5 block text-sm font-medium">Posición del botón flotante</Label>
            <Select
              value={value.position}
              onValueChange={(v) => onChange({ ...value, position: v as "right" | "left" })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="right">Inferior derecha</SelectItem>
                <SelectItem value="left">Inferior izquierda</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col justify-end">
            <div className="flex items-center justify-between rounded-lg border border-border p-3 bg-muted/20">
              <div>
                <p className="text-sm font-medium text-foreground">Activar botón flotante</p>
                <p className="text-xs text-muted-foreground">Mostrar en la tienda pública</p>
              </div>
              <Switch
                checked={value.buttonEnabled}
                onCheckedChange={(v) => onChange({ ...value, buttonEnabled: v })}
              />
            </div>
          </div>
        </div>

        <div>
          <Label className="mb-2 block text-sm font-medium">Imagen opcional de botón flotante</Label>
          <SingleImageUploader
            label="Subir ícono o avatar personalizado"
            value={value.buttonImage}
            onChange={(img) => onChange({ ...value, buttonImage: img })}
            aspect="square"
            folder="settings"
          />
        </div>
      </div>

      {/* Live Preview Sidebar */}
      <div className="flex flex-col gap-5">
        <div className="bg-card border border-border/80 rounded-xl p-4 shadow-2xs">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Vista Previa en Vivo (Landing Page)
          </h4>

          <div className="relative h-64 w-full bg-slate-900 rounded-lg overflow-hidden border border-slate-800 flex flex-col justify-between p-4">
            {/* Simulación header landing */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white tracking-wide">MAROS PIJAMAS</span>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-slate-400">En línea</span>
              </div>
            </div>

            {/* Simulación contenido landing */}
            <div className="text-center py-4">
              <span className="text-xs text-slate-300 font-medium">Pijamas de Satén y Seda</span>
              <p className="text-[10px] text-slate-500 mt-1">Colección Verano 2027</p>
            </div>

            {/* Botón flotante simulado */}
            {value.buttonEnabled && (
              <div
                className={`absolute bottom-3 ${
                  value.position === "left" ? "left-3" : "right-3"
                } transition-all duration-300`}
              >
                <div className="flex items-center gap-2 bg-emerald-600 text-white p-2.5 rounded-full shadow-lg hover:scale-105 cursor-pointer">
                  {value.buttonImage ? (
                    <img
                      src={value.buttonImage}
                      alt="WhatsApp Avatar"
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <MessageSquare className="h-5 w-5 fill-current" />
                  )}
                  <span className="text-xs font-medium pr-1">Chatea con nosotros</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tarjeta de Consejos */}
        <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-4 flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-900 leading-relaxed">
            <p className="font-semibold mb-1">Consejo de Ventas por WhatsApp</p>
            Un mensaje claro y amable incrementa las conversiones en un 35%. Asegúrate de responder de forma ágil para cerrar pedidos mayoristas.
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SingleImageUploader } from "@/components/shared/single-image-uploader";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";
import type { ContactSettings } from "../types";

interface PanelProps {
  value: ContactSettings;
  onChange: (value: ContactSettings) => void;
}

export function SettingsContactPanel({ value, onChange }: PanelProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
      {/* Formulario */}
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="mb-1.5 block text-sm font-medium">Teléfono principal</Label>
            <Input
              value={value.phone}
              onChange={(e) => onChange({ ...value, phone: e.target.value })}
              placeholder="+57 301 316 9974"
            />
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium">Correo electrónico de contacto</Label>
            <Input
              type="email"
              value={value.email}
              onChange={(e) => onChange({ ...value, email: e.target.value })}
              placeholder="contacto@marospijamas.com"
            />
          </div>
        </div>

        <div>
          <Label className="mb-1.5 block text-sm font-medium">Dirección física</Label>
          <Input
            value={value.address}
            onChange={(e) => onChange({ ...value, address: e.target.value })}
            placeholder="Calle 10 # 43-12, Medellín, Colombia"
          />
        </div>

        <div>
          <Label className="mb-1.5 block text-sm font-medium">Horario de atención</Label>
          <Textarea
            rows={2}
            value={value.businessHours}
            onChange={(e) => onChange({ ...value, businessHours: e.target.value })}
            placeholder="Lunes a Viernes: 8:00 AM - 6:00 PM / Sábados: 9:00 AM - 1:00 PM"
          />
        </div>

        <div>
          <Label className="mb-2 block text-sm font-medium">Imagen de mapa estático (Dropzone)</Label>
          <SingleImageUploader
            label="Subir captura de mapa"
            value={value.mapImage}
            onChange={(img) => onChange({ ...value, mapImage: img })}
            folder="settings"
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-3.5 bg-muted/20">
          <div>
            <p className="text-sm font-medium text-foreground">Mostrar sección de ubicación</p>
            <p className="text-xs text-muted-foreground">Muestra la dirección y el mapa en la página de contacto pública</p>
          </div>
          <Switch
            checked={value.showLocation}
            onCheckedChange={(v) => onChange({ ...value, showLocation: v })}
          />
        </div>
      </div>

      {/* Live Preview Sidebar */}
      <div className="flex flex-col gap-5">
        <div className="bg-card border border-border/80 rounded-xl p-5 shadow-2xs">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Vista Previa de Sección &quot;Contáctanos&quot;
          </h4>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Phone className="h-4 w-4 text-[#2D4A3E]" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Teléfono</p>
                <p className="text-xs font-semibold text-foreground">{value.phone || "No especificado"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Mail className="h-4 w-4 text-[#2D4A3E]" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Correo</p>
                <p className="text-xs font-semibold text-foreground truncate">{value.email || "No especificado"}</p>
              </div>
            </div>

            {value.showLocation && (
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-[#2D4A3E]" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Dirección</p>
                  <p className="text-xs font-semibold text-foreground">{value.address || "No especificada"}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Clock className="h-4 w-4 text-[#2D4A3E]" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Horario</p>
                <p className="text-xs font-semibold text-foreground">{value.businessHours || "No especificado"}</p>
              </div>
            </div>

            {/* Imagen de mapa simulada */}
            {value.showLocation && (
              <div className="mt-3 rounded-lg overflow-hidden border border-border h-32 bg-muted flex items-center justify-center relative">
                {value.mapImage ? (
                  <img src={value.mapImage} alt="Mapa de ubicación" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-center p-3">
                    <MapPin className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                    <span className="text-[11px] text-muted-foreground">Vista previa de mapa</span>
                  </div>
                )}
              </div>
            )}

            {/* Botones de Acción simulados */}
            <div className="pt-2 flex flex-col gap-2">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(value.address)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-medium border border-border rounded-lg py-2 hover:bg-muted/50 transition-colors"
              >
                Abrir en Google Maps
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
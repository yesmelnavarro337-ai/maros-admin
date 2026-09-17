"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShieldCheck, FileText, Cookie, Eye } from "lucide-react";
import type { LegalSettings } from "../types";

interface PanelProps {
  value: LegalSettings;
  onChange: (value: LegalSettings) => void;
}

export function SettingsLegalPanel({ value, onChange }: PanelProps) {
  const [previewPolicy, setPreviewPolicy] = useState<{ title: string; content: string } | null>(null);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
      {/* Formulario */}
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Aviso de privacidad y datos personales
            </Label>
            <span className="text-xs text-muted-foreground">{value.privacyPolicy.length}/1000</span>
          </div>
          <Textarea
            rows={4}
            maxLength={1000}
            value={value.privacyPolicy}
            onChange={(e) => onChange({ ...value, privacyPolicy: e.target.value })}
            placeholder="Aviso de privacidad para el tratamiento de datos personales..."
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-blue-600" />
              Términos y condiciones de uso
            </Label>
            <span className="text-xs text-muted-foreground">{value.termsAndConditions.length}/1000</span>
          </div>
          <Textarea
            rows={4}
            maxLength={1000}
            value={value.termsAndConditions}
            onChange={(e) => onChange({ ...value, termsAndConditions: e.target.value })}
            placeholder="Términos y condiciones de compra, pedidos y despachos..."
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <Cookie className="h-4 w-4 text-amber-600" />
              Ley de cookies y almacenamiento local
            </Label>
            <span className="text-xs text-muted-foreground">{value.cookiesPolicy.length}/1000</span>
          </div>
          <Textarea
            rows={4}
            maxLength={1000}
            value={value.cookiesPolicy}
            onChange={(e) => onChange({ ...value, cookiesPolicy: e.target.value })}
            placeholder="Información sobre el uso de cookies en nuestro sitio web..."
          />
        </div>
      </div>

      {/* Live Preview Sidebar (Footer del Frontend) */}
      <div className="flex flex-col gap-5">
        <div className="bg-card border border-border/80 rounded-xl p-4 shadow-2xs">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Vista Previa de Pie de Página (Footer)
          </h4>

          <div className="bg-slate-900 text-slate-300 rounded-lg p-4 text-xs space-y-3">
            <div className="border-b border-slate-800 pb-2">
              <span className="font-bold text-white tracking-wide">MAROS PIJAMAS</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Pijamas de alta calidad al por mayor y detal.</p>
            </div>

            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-white">Políticas Legales:</p>
              <div className="flex flex-col gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setPreviewPolicy({ title: "Aviso de Privacidad", content: value.privacyPolicy })}
                  className="text-left text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Eye className="h-3 w-3" /> Aviso de Privacidad
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewPolicy({ title: "Términos y Condiciones", content: value.termsAndConditions })}
                  className="text-left text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Eye className="h-3 w-3" /> Términos y Condiciones
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewPolicy({ title: "Política de Cookies", content: value.cookiesPolicy })}
                  className="text-left text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Eye className="h-3 w-3" /> Ley de Cookies
                </button>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-slate-500 border-t border-slate-800 text-center">
              © {new Date().getFullYear()} MAROS PIJAMAS. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Lectura de Política */}
      <Dialog open={!!previewPolicy} onOpenChange={(open) => !open && setPreviewPolicy(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{previewPolicy?.title}</DialogTitle>
          </DialogHeader>
          <div className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto p-2">
            {previewPolicy?.content || "Sin contenido cargado."}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { LegalSettings } from "../types";

export function SettingsLegalPanel({ value, onChange }: { value: LegalSettings; onChange: (v: LegalSettings) => void }) {
  return (
    <div className="flex flex-col gap-4 max-w-md">
      <div>
        <Label className="mb-1.5 block">URL de Términos y Condiciones</Label>
        <Input value={value.termsUrl} onChange={(e) => onChange({ ...value, termsUrl: e.target.value })} />
      </div>
      <div>
        <Label className="mb-1.5 block">URL de Política de Privacidad</Label>
        <Input value={value.privacyUrl} onChange={(e) => onChange({ ...value, privacyUrl: e.target.value })} />
      </div>
      <div>
        <Label className="mb-1.5 block">Política de devoluciones</Label>
        <Textarea rows={4} value={value.returnsPolicy} onChange={(e) => onChange({ ...value, returnsPolicy: e.target.value })} />
      </div>
    </div>
  );
}
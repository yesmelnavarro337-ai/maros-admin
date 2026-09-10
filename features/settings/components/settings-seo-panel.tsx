import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SingleImageUploader } from "@/components/shared/single-image-uploader";
import type { SeoSettings } from "../types";

export function SettingsSeoPanel({ value, onChange }: { value: SeoSettings; onChange: (v: SeoSettings) => void }) {
  return (
    <div className="flex flex-col gap-4 max-w-md">
      <div>
        <Label className="mb-1.5 block">Meta título global</Label>
        <Input value={value.metaTitle} onChange={(e) => onChange({ ...value, metaTitle: e.target.value })} />
      </div>
      <div>
        <Label className="mb-1.5 block">Meta descripción global</Label>
        <Textarea rows={3} value={value.metaDescription} onChange={(e) => onChange({ ...value, metaDescription: e.target.value })} />
      </div>
      <SingleImageUploader label="Imagen social por defecto" value={value.socialImage} onChange={(img) => onChange({ ...value, socialImage: img })} folder="settings" />
    </div>
  );
}
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SocialSettings } from "../types";

export function SettingsSocialPanel({ value, onChange }: { value: SocialSettings; onChange: (v: SocialSettings) => void }) {
  return (
    <div className="flex flex-col gap-4 max-w-md">
      <div>
        <Label className="mb-1.5 block">Instagram</Label>
        <Input value={value.instagram} onChange={(e) => onChange({ ...value, instagram: e.target.value })} placeholder="@marospijamas" />
      </div>
      <div>
        <Label className="mb-1.5 block">Facebook</Label>
        <Input value={value.facebook} onChange={(e) => onChange({ ...value, facebook: e.target.value })} placeholder="facebook.com/marospijamas" />
      </div>
      <div>
        <Label className="mb-1.5 block">TikTok</Label>
        <Input value={value.tiktok} onChange={(e) => onChange({ ...value, tiktok: e.target.value })} placeholder="@marospijamas" />
      </div>
    </div>
  );
}
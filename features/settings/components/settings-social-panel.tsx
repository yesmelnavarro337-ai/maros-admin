"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, MessageSquare, Share2 } from "lucide-react";
import type { SocialSettings } from "../types";

interface PanelProps {
  value: SocialSettings;
  onChange: (value: SocialSettings) => void;
}

export function SettingsSocialPanel({ value, onChange }: PanelProps) {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h3 className="text-base font-semibold text-foreground">Perfiles de Redes Sociales</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Ingresa las URLs completas de los perfiles oficiales de la marca. Se mostrarán en el pie de página y menú.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
            <Share2 className="h-4 w-4 text-pink-600" />
            Instagram
          </Label>
          <Input
            value={value.instagram}
            onChange={(e) => onChange({ ...value, instagram: e.target.value })}
            placeholder="https://instagram.com/marospijamas"
          />
        </div>

        <div>
          <Label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
            <Globe className="h-4 w-4 text-blue-600" />
            Facebook
          </Label>
          <Input
            value={value.facebook}
            onChange={(e) => onChange({ ...value, facebook: e.target.value })}
            placeholder="https://facebook.com/marospijamas"
          />
        </div>

        <div>
          <Label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
            <Share2 className="h-4 w-4 text-foreground" />
            TikTok
          </Label>
          <Input
            value={value.tiktok}
            onChange={(e) => onChange({ ...value, tiktok: e.target.value })}
            placeholder="https://tiktok.com/@marospijamas"
          />
        </div>

        <div>
          <Label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
            <MessageSquare className="h-4 w-4 text-emerald-600" />
            WhatsApp
          </Label>
          <Input
            value={value.whatsapp}
            onChange={(e) => onChange({ ...value, whatsapp: e.target.value })}
            placeholder="+573013169974"
          />
        </div>

        <div>
          <Label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
            <Globe className="h-4 w-4 text-red-600" />
            YouTube
          </Label>
          <Input
            value={value.youtube}
            onChange={(e) => onChange({ ...value, youtube: e.target.value })}
            placeholder="https://youtube.com/@marospijamas"
          />
        </div>

        <div>
          <Label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
            <Globe className="h-4 w-4 text-sky-500" />
            X (Twitter)
          </Label>
          <Input
            value={value.twitter}
            onChange={(e) => onChange({ ...value, twitter: e.target.value })}
            placeholder="https://x.com/marospijamas"
          />
        </div>
      </div>
    </div>
  );
}
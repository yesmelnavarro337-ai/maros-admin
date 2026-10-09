"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Music, Loader2, CheckCircle2, FileAudio2 } from "lucide-react";
import { toast } from "@/lib/toast";
import { getAudioSettings, uploadAudioSettings } from "../services/settings.service";
import type { AudioSettings } from "../services/settings.service";

type AudioType = "navidad" | "nosotros";

interface AudioSlot {
  type: AudioType;
  title: string;
  description: string;
}

const SLOTS: AudioSlot[] = [
  {
    type: "navidad",
    title: "Instrumental navideño",
    description: "Audio ambiental MP3 que acompaña la colección de Navidad.",
  },
  {
    type: "nosotros",
    title: "Instrumental nosotros",
    description: "Audio de fondo MP3 de la página Nosotros / Historia.",
  },
];

const MAX_AUDIO_BYTES = 30 * 1024 * 1024;

function isValidMp3(file: File): boolean {
  const hasMp3Extension = file.name.toLowerCase().endsWith(".mp3");
  const isAudioMpeg = file.type === "audio/mpeg" || file.type === "audio/mp3";
  return hasMp3Extension || isAudioMpeg;
}

export function SettingsAudioPanel() {
  const [settings, setSettings] = useState<AudioSettings | null>(null);
  const [uploading, setUploading] = useState<AudioType | null>(null);
  const inputRefs = useRef<Partial<Record<AudioType, HTMLInputElement | null>>>({});

  useEffect(() => {
    getAudioSettings()
      .then(setSettings)
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "No se pudo cargar la configuración de audio.");
      });
  }, []);

  async function handleFileSelected(type: AudioType, file: File | undefined) {
    if (!file) return;

    if (!isValidMp3(file)) {
      toast.error("Solo se permiten archivos MP3.");
      return;
    }
    if (file.size > MAX_AUDIO_BYTES) {
      toast.error("El archivo supera el límite de 30 MB.");
      return;
    }

    setUploading(type);
    try {
      const res = await uploadAudioSettings(type, file);
      setSettings({ navidad: res.navidad, nosotros: res.nosotros });
      toast.success(res.message || `Audio ${type} actualizado correctamente.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo subir el audio.");
    } finally {
      setUploading(null);
      const input = inputRefs.current[type];
      if (input) input.value = "";
    }
  }

  if (!settings) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-40 animate-pulse rounded-xl border border-border/60 bg-muted/30" />
        <div className="h-40 animate-pulse rounded-xl border border-border/60 bg-muted/30" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
        <p className="text-sm font-semibold text-foreground">Audios instrumentales</p>
        <p className="text-xs text-muted-foreground">
          Los archivos MP3 se guardan automáticamente al seleccionarlos (no requieren el botón &quot;Guardar cambios&quot;).
          Formato permitido: MP3, máximo 30 MB.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {SLOTS.map((slot) => {
          const currentUrl = settings[slot.type];
          const isUploading = uploading === slot.type;

          return (
            <div
              key={slot.type}
              className="flex flex-col gap-4 rounded-xl border border-border/80 bg-card p-5 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4a5833]/10 text-[#4a5833]">
                    <Music className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{slot.title}</p>
                    <p className="text-xs text-muted-foreground">{slot.description}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    currentUrl ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {currentUrl ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" /> Activo
                    </>
                  ) : (
                    <>
                      <FileAudio2 className="h-3 w-3" /> Sin audio
                    </>
                  )}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <p className="truncate text-xs text-muted-foreground" title={currentUrl ?? undefined}>
                  {currentUrl || "Aún no se ha cargado ningún archivo para esta sección."}
                </p>

                {currentUrl && (
                  <audio key={currentUrl} controls preload="none" src={currentUrl} className="w-full h-10">
                    Tu navegador no soporta el elemento de audio.
                  </audio>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <input
                    ref={(el) => {
                      inputRefs.current[slot.type] = el;
                    }}
                    type="file"
                    accept=".mp3,audio/mpeg,audio/mp3"
                    className="hidden"
                    onChange={(e) => handleFileSelected(slot.type, e.target.files?.[0])}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploading}
                    onClick={() => inputRefs.current[slot.type]?.click()}
                    className="gap-1.5 text-xs"
                  >
                    {isUploading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Upload className="h-3.5 w-3.5" />
                    )}
                    {isUploading ? "Subiendo audio..." : currentUrl ? "Reemplazar MP3" : "Seleccionar MP3"}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

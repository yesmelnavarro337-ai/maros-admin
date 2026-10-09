"use client";

import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Film, ImageIcon, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "@/lib/toast";
import { uploadImage } from "@/lib/api/media.service";
import type { HeaderMedia } from "@/features/page-headers/types";

const ACCEPT_MEDIA_TYPES =
  "image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.heic,.heif," +
  "video/mp4,video/webm,video/quicktime,video/mov,.mp4,.webm,.mov,.MOV";

/** Límite máximo de subida de multimedia (coincide con el backend: 100 MB). */
const MAX_MEDIA_BYTES = 100 * 1024 * 1024;

function detectMediaType(file: File): "image" | "video" {
  const isVideoMime =
    file.type.startsWith("video/") || file.type === "video/quicktime";
  const isVideoExtension = /\.(mp4|webm|mov|m4v|avi|mkv)$/i.test(file.name);
  return isVideoMime || isVideoExtension ? "video" : "image";
}

interface HeaderMediaManagerProps {
  media: HeaderMedia[];
  onChange: (media: HeaderMedia[]) => void;
  folder?: string;
  /** URL de la imagen de fondo del header (se muestra como primer slide con badge "Fondo"). */
  anchorUrl?: string;
}

export function HeaderMediaManager({ media, onChange, folder = "page-headers", anchorUrl }: HeaderMediaManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;

    // Validación previa de tamaño: evita enviar peticiones destinadas a fallar
    // contra el límite de 100 MB del backend.
    if (file.size > MAX_MEDIA_BYTES) {
      toast.error(
        `El archivo pesa ${(file.size / (1024 * 1024)).toFixed(1)} MB. El máximo permitido es 100 MB.`
      );
      return;
    }

    setUploading(true);
    try {
      const result = await uploadImage(file, folder);
      if (!result?.url) {
        throw new Error("El servidor no devolvió una URL válida para el archivo subido.");
      }
      const mediaType = detectMediaType(file);
      onChange([...media, { url: result.url, mediaType, order: media.length }]);
      toast.success(mediaType === "video" ? "Video agregado al encabezado." : "Imagen agregada al encabezado.");
    } catch (error) {
      // La subida es independiente del guardado del encabezado: aquí solo se
      // reporta el fallo y se desactiva el indicador de carga (finally).
      toast.error(error instanceof Error ? error.message : "No se pudo subir el archivo.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove(index: number) {
    onChange(media.filter((_, i) => i !== index).map((m, i) => ({ ...m, order: i })));
  }

  function handleMove(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= media.length) return;
    const next = [...media];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((m, i) => ({ ...m, order: i })));
  }

  return (
    <div>
      <p className="text-sm font-medium text-foreground mb-2">Multimedia del encabezado</p>
      <p className="text-xs text-muted-foreground mb-3">
        El primer elemento se muestra primero en el sitio. Las imágenes avanzan cada 6 segundos; los videos se
        reproducen completos y cambian al terminar. Usa las flechas para reordenar (también en móvil).
      </p>

      {media.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-3">
          {media.map((item, index) => (
            <div
              key={`${item.url}-${index}`}
              className="group relative overflow-hidden rounded-lg border border-border bg-secondary/40 aspect-[21/9]"
            >
              {item.mediaType === "video" ? (
                <video
                  src={item.url}
                  muted
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt={`Encabezado ${index + 1}`} className="h-full w-full object-cover" />
              )}

              <div className="absolute left-1.5 top-1.5">
                <Badge variant="secondary" className="gap-1 text-[10px] bg-black/60 text-white border-transparent">
                  {item.mediaType === "video" ? <Film className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                  {anchorUrl && item.url === anchorUrl
                    ? "Fondo"
                    : item.mediaType === "video"
                      ? "Video"
                      : "Imagen"}
                </Badge>
              </div>

              <div className="absolute right-1.5 top-1.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMove(index, -1)}
                  disabled={index === 0}
                  aria-label="Mover antes"
                  className="flex h-6 w-6 items-center justify-center rounded bg-black/60 text-white hover:bg-black/80 disabled:opacity-30"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(index, 1)}
                  disabled={index === media.length - 1}
                  aria-label="Mover después"
                  className="flex h-6 w-6 items-center justify-center rounded bg-black/60 text-white hover:bg-black/80 disabled:opacity-30"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  aria-label="Quitar"
                  className="flex h-6 w-6 items-center justify-center rounded bg-red-600/80 text-white hover:bg-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex w-full flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border bg-secondary/40 py-6 text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
      >
        {uploading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <Plus className="h-5 w-5" />
            <span className="flex items-center gap-1.5 text-xs">
              <Upload className="h-3.5 w-3.5" />
              Agregar imagen o video
            </span>
          </>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_MEDIA_TYPES}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {media.length === 0 && (
        <p className="mt-1.5 text-xs text-muted-foreground">
          Sin multimedia configurada: se usará la imagen de fondo estática.
        </p>
      )}
    </div>
  );
}

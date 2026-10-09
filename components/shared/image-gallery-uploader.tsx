"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, Film, Loader2, Star, Trash2, Upload } from "lucide-react";
import { uploadImage } from "@/lib/api/media.service";
import {
  ACCEPT_IMAGE_TYPES,
  ACCEPT_VIDEO_TYPES,
  detectMediaType,
  isVideoUrl,
} from "@/lib/utils/image-file";
import { toast } from "@/lib/toast";

export interface GalleryImageItem {
  id?: string;
  imageUrl: string;
  isPrimary: boolean;
  mediaType?: "image" | "video";
}

interface ImageGalleryUploaderProps {
  label: string;
  value: GalleryImageItem[];
  onChange: (value: GalleryImageItem[]) => void;
  folder?: string;
  maxItems?: number;
  hint?: string;
  /** Cuando es true permite subir videos (MP4, WebM, MOV) además de imágenes. */
  allowVideo?: boolean;
}

/**
 * Selector múltiple de imágenes con portada única y orden explícito.
 * El orden del array es el orden de aparición en el carrusel de la web.
 */
export function ImageGalleryUploader({
  label,
  value,
  onChange,
  folder = "general",
  maxItems,
  hint,
  allowVideo = false,
}: ImageGalleryUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  function setPrimary(index: number) {
    onChange(value.map((image, i) => ({ ...image, isPrimary: i === index })));
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function remove(index: number) {
    const next = value.filter((_, i) => i !== index);
    // Si se quita la portada, la primera imagen restante la hereda.
    if (value[index].isPrimary && next.length > 0) {
      next[0] = { ...next[0], isPrimary: true };
    }
    onChange(next);
  }

  async function handleFiles(files: FileList | null) {
    const selected = Array.from(files ?? []);
    if (selected.length === 0) return;

    // Sin límite por defecto: solo se recorta si el consumidor fija maxItems.
    const room = maxItems !== undefined ? maxItems - value.length : selected.length;
    if (room <= 0) {
      toast.error(
        `Puedes subir hasta ${maxItems} ${allowVideo ? "archivos" : "imágenes"}.`
      );
      return;
    }
    const accepted = selected.slice(0, room);
    if (accepted.length < selected.length) {
      toast.error(
        `Solo se subirán los primeros ${room} ${allowVideo ? "archivos" : "elementos"} (límite de ${maxItems}).`
      );
    }

    setUploading(true);
    try {
      const uploaded: GalleryImageItem[] = [];
      for (const file of accepted) {
        const result = await uploadImage(file, folder);
        uploaded.push({
          imageUrl: result.url,
          isPrimary: false,
          mediaType: detectMediaType(file),
        });
      }
      if (uploaded.length === 0) return;
      // La portada solo se asigna automáticamente si la galería estaba vacía.
      if (value.length === 0) uploaded[0] = { ...uploaded[0], isPrimary: true };
      onChange([...value, ...uploaded]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <p className="text-sm font-medium text-foreground mb-2">{label}</p>

      {value.length === 0 && !uploading && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
          {allowVideo
            ? "Sin imágenes ni videos todavía. La primera será la portada."
            : "Sin imágenes todavía. La primera será la portada."}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {value.map((image, index) => {
          const isVideo =
            image.mediaType === "video" ||
            (image.mediaType === undefined && isVideoUrl(image.imageUrl));
          return (
            <div
              key={image.id ?? `${image.imageUrl}-${index}`}
              className={`overflow-hidden rounded-lg border bg-secondary/30 ${
                image.isPrimary ? "border-[#555A2B] ring-1 ring-[#555A2B]/40" : "border-border/60"
              }`}
            >
              <div className="relative aspect-[4/3] w-full bg-[#FAF9F5]">
                {isVideo ? (
                  <video
                    src={image.imageUrl}
                    muted
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image.imageUrl}
                    alt={`Imagen ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                )}
                {image.isPrimary && (
                  <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-[#555A2B] px-2 py-0.5 text-[10px] font-medium text-white">
                    <Star className="h-2.5 w-2.5" />
                    Portada
                  </span>
                )}
                {isVideo && (
                  <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white">
                    <Film className="h-2.5 w-2.5" />
                    Video
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-1 border-t border-border/40 p-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  title="Subir en la lista"
                  aria-label="Subir en la lista"
                  className="rounded p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === value.length - 1}
                  title="Bajar en la lista"
                  aria-label="Bajar en la lista"
                  className="rounded p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setPrimary(index)}
                  disabled={image.isPrimary}
                  title={image.isPrimary ? "Ya es la portada" : "Usar como portada"}
                  aria-label="Usar como portada"
                  className="rounded p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-[#555A2B] disabled:pointer-events-none disabled:opacity-30"
                >
                  <Star className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => remove(index)}
                  title="Quitar"
                  aria-label="Quitar"
                  className="rounded p-1 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {(maxItems === undefined || value.length < maxItems) && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex aspect-[4/3] flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span className="text-xs">Subir</span>
              </>
            )}
          </button>
        )}
      </div>

      {hint && <p className="mt-2 text-[11px] text-muted-foreground">{hint}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={allowVideo ? `${ACCEPT_IMAGE_TYPES},${ACCEPT_VIDEO_TYPES}` : ACCEPT_IMAGE_TYPES}
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
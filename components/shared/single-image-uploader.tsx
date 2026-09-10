"use client";

import { useRef, useState } from "react";
import { ImageOff, Upload, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/api/media.service";
import { toast } from "@/lib/toast";

interface SingleImageUploaderProps {
  label: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  aspect?: "square" | "wide";
  folder?: string;
}

export function SingleImageUploader({
  label,
  value,
  onChange,
  aspect = "wide",
  folder = "general",
}: SingleImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadImage(file, folder);
      onChange(result.url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <p className="text-sm font-medium text-foreground mb-2">{label}</p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={`relative w-full ${aspect === "wide" ? "aspect-[21/9]" : "aspect-square max-w-xs"} rounded-lg border-2 border-dashed border-border overflow-hidden flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors bg-secondary/40 disabled:opacity-60`}
      >
        {uploading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={label} className="w-full h-full object-cover" />
        ) : (
          <>
            <Upload className="h-5 w-5" />
            <span className="text-xs">Subir imagen</span>
          </>
        )}
      </button>
      {value && !uploading && (
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="text-xs text-destructive mt-1.5 hover:underline"
        >
          Quitar imagen
        </button>
      )}
      {!value && !uploading && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
          <ImageOff className="h-3 w-3" />
          Sin imagen todavía.
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
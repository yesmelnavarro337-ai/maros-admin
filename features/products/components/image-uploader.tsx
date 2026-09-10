"use client";

import { useRef, useState } from "react";
import { Plus, X, ImageOff, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/api/media.service";
import { toast } from "@/lib/toast";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
}

export function ImageUploader({ images, onChange, max = 6 }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    const toUpload = Array.from(files).slice(0, max - images.length);
    if (toUpload.length === 0) return;

    setUploading(true);
    try {
      const results = await Promise.all(toUpload.map((file) => uploadImage(file, "products")));
      onChange([...images, ...results.map((r) => r.url)]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudieron subir las imágenes.");
    } finally {
      setUploading(false);
    }
  }

  const removeAt = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {images.map((img, i) => (
        <div key={i} className="relative aspect-square rounded-md overflow-hidden border border-border group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt={`Imagen ${i + 1}`} className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => removeAt(i)}
            className="absolute top-1 right-1 bg-background/90 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      {images.length < max && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="aspect-square rounded-md border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Plus className="h-5 w-5" />
              <span className="text-xs">Agregar</span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {images.length === 0 && !uploading && (
        <div className="col-span-full flex items-center gap-2 text-xs text-muted-foreground">
          <ImageOff className="h-3.5 w-3.5" />
          Sin imágenes todavía.
        </div>
      )}
    </div>
  );
}
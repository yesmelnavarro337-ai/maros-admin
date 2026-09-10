"use client";

import { useRef, useState } from "react";
import { ImageOff, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GALLERY_CATEGORIES } from "../types";
import type { GalleryCategory } from "../types";

interface GalleryUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (file: File, category: GalleryCategory, caption: string) => Promise<void>;
}

export function GalleryUploadDialog({ open, onOpenChange, onSave }: GalleryUploadDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [category, setCategory] = useState<GalleryCategory>(GALLERY_CATEGORIES[0]);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  function handleFileSelect(selected: File | undefined) {
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  }

  function reset() {
    setFile(null);
    setPreviewUrl(null);
    setCaption("");
    setCategory(GALLERY_CATEGORIES[0]);
  }

  async function handleSubmit() {
    if (!file) return;
    setUploading(true);
    try {
      await onSave(file, category, caption);
      reset();
      onOpenChange(false);
    } finally {
      setUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subir imagen</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div>
            <Label className="mb-1.5 block">Imagen</Label>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="relative w-full aspect-square max-w-xs rounded-lg border-2 border-dashed border-border overflow-hidden flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors bg-secondary/40"
            >
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="Vista previa" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  <span className="text-xs">Seleccionar imagen</span>
                </>
              )}
            </button>
            {!previewUrl && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
                <ImageOff className="h-3 w-3" />
                Sin imagen seleccionada.
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
            />
          </div>

          <div>
            <Label className="mb-1.5 block">Categoría</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as GalleryCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GALLERY_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 block">Descripción (alt / caption)</Label>
            <Input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Ej. Familia en pijamas navideñas" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!file || uploading}>
            {uploading ? "Subiendo..." : "Subir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
"use client";

import { useEffect, useState } from "react";
import { X, Upload, Loader2, Image as ImageIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StarRating } from "./star-rating";
import { uploadImage } from "@/lib/api/media.service";
import type { Testimonial, TestimonialStatus } from "../types";

interface TestimonialSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial?: Testimonial | null;
  onSave: (data: {
    clientName: string;
    city?: string;
    rating: number;
    quote: string;
    avatarUrl?: string;
    status: TestimonialStatus;
    publishDate: string;
  }) => Promise<void>;
}

export function TestimonialSheet({
  open,
  onOpenChange,
  testimonial,
  onSave,
}: TestimonialSheetProps) {
  const [clientName, setClientName] = useState("");
  const [city, setCity] = useState("");
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [status, setStatus] = useState<TestimonialStatus>("publicado");
  const [publishDate, setPublishDate] = useState("");

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (testimonial) {
      setClientName(testimonial.clientName || "");
      setCity(testimonial.city || "");
      setRating(testimonial.rating || 5);
      setQuote(testimonial.quote || "");
      setAvatarUrl(testimonial.avatarUrl || "");
      setStatus(testimonial.status || "publicado");
      setPublishDate(
        testimonial.publishDate
          ? new Date(testimonial.publishDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0]
      );
    } else {
      setClientName("");
      setCity("");
      setRating(5);
      setQuote("");
      setAvatarUrl("");
      setStatus("publicado");
      setPublishDate(new Date().toISOString().split("T")[0]);
    }
  }, [testimonial, open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type)) {
      toast.error("Formato no soportado. Solo se permiten imágenes JPG o PNG.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("El tamaño máximo de la imagen es 2 MB.");
      return;
    }

    setUploading(true);
    try {
      const res = await uploadImage(file, "testimonials");
      setAvatarUrl(res.url);
      toast.success("Imagen subida con éxito.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim()) {
      toast.error("El nombre del cliente es requerido.");
      return;
    }

    if (!quote.trim()) {
      toast.error("El comentario es requerido.");
      return;
    }

    if (quote.length > 500) {
      toast.error("El comentario no puede exceder 500 caracteres.");
      return;
    }

    if (!publishDate) {
      toast.error("La fecha de publicación es requerida.");
      return;
    }

    setSubmitting(true);
    try {
      await onSave({
        clientName: clientName.trim(),
        city: city.trim() || undefined,
        rating,
        quote: quote.trim(),
        avatarUrl: avatarUrl || undefined,
        status,
        publishDate: new Date(publishDate).toISOString(),
      });
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar el testimonio.");
    } finally {
      setSubmitting(false);
    }
  };

  const isEditing = Boolean(testimonial);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-white p-0 sm:max-w-lg w-full flex flex-col h-full border-l border-border">
        {/* Header */}
        <SheetHeader className="p-6 border-b border-[#EBE9DF]">
          <SheetTitle className="font-heading font-serif text-2xl font-bold text-[#34351f]">
            {isEditing ? "Editar testimonio" : "Nuevo testimonio"}
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            {isEditing
              ? "Modifica los datos del testimonio de cliente."
              : "Ingresa los detalles para publicar un nuevo testimonio de cliente."}
          </SheetDescription>
        </SheetHeader>

        {/* Form Body */}
        <form id="testimonial-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Nombre del cliente */}
          <div className="space-y-1.5">
            <Label htmlFor="clientName" className="text-xs font-semibold text-[#34351f]">
              Nombre del cliente <span className="text-red-500">*</span>
            </Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ej. María Fernanda Gómez"
              required
              className="bg-white border-[#EBE9DF] focus-visible:ring-[#555829]"
            />
          </div>

          {/* Ciudad */}
          <div className="space-y-1.5">
            <Label htmlFor="city" className="text-xs font-semibold text-[#34351f]">
              Ciudad / Ubicación
            </Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ej. Medellín, Colombia"
              className="bg-white border-[#EBE9DF] focus-visible:ring-[#555829]"
            />
          </div>

          {/* Calificación */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#34351f]">
              Calificación <span className="text-red-500">*</span>
            </Label>
            <div className="pt-1">
              <StarRating value={rating} onChange={setRating} size="lg" />
            </div>
          </div>

          {/* Comentario */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label htmlFor="quote" className="text-xs font-semibold text-[#34351f]">
                Comentario del testimonio <span className="text-red-500">*</span>
              </Label>
              <span className={`text-[11px] ${quote.length > 500 ? "text-red-500 font-semibold" : "text-muted-foreground"}`}>
                {quote.length} / 500
              </span>
            </div>
            <Textarea
              id="quote"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Escribe aquí la reseña o comentario del cliente..."
              maxLength={500}
              rows={4}
              required
              className="bg-white border-[#EBE9DF] focus-visible:ring-[#555829] resize-none"
            />
          </div>

          {/* Imagen / Dropzone */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#34351f]">
              Imagen del cliente <span className="text-xs font-normal text-muted-foreground">(Opcional, JPG/PNG máx. 2MB)</span>
            </Label>

            {avatarUrl ? (
              <div className="flex items-center gap-4 p-3 rounded-lg border border-[#EBE9DF] bg-[#FAF9F5]">
                <img
                  src={avatarUrl}
                  alt="Avatar cliente"
                  className="w-14 h-14 rounded-full object-cover border border-[#EBE9DF]"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#34351f] truncate">{avatarUrl}</p>
                  <p className="text-[11px] text-muted-foreground">Imagen asignada correctamente</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setAvatarUrl("")}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label
                htmlFor="avatar-upload"
                className="flex flex-col items-center justify-center p-5 rounded-lg border-2 border-dashed border-[#EBE9DF] bg-[#FAF9F5] hover:bg-[#F4F3ED] transition-colors cursor-pointer"
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin text-[#555829]" />
                    <span className="text-xs">Subiendo imagen...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-center">
                    <div className="p-2 rounded-full bg-[#EBE9DF] text-[#555829] mb-1">
                      <Upload className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium text-[#34351f]">
                      Haz clic para subir una foto de avatar
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      PNG o JPG hasta 2MB
                    </span>
                  </div>
                )}
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Estado */}
          <div className="space-y-1.5">
            <Label htmlFor="status" className="text-xs font-semibold text-[#34351f]">
              Estado <span className="text-red-500">*</span>
            </Label>
            <Select value={status} onValueChange={(val: TestimonialStatus) => setStatus(val)}>
              <SelectTrigger id="status" className="bg-white border-[#EBE9DF] focus:ring-[#555829]">
                <SelectValue placeholder="Selecciona estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="publicado">Publicado</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fecha de publicación */}
          <div className="space-y-1.5">
            <Label htmlFor="publishDate" className="text-xs font-semibold text-[#34351f]">
              Fecha de publicación <span className="text-red-500">*</span>
            </Label>
            <Input
              id="publishDate"
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              required
              className="bg-white border-[#EBE9DF] focus-visible:ring-[#555829]"
            />
          </div>
        </form>

        {/* Footer Actions */}
        <SheetFooter className="p-4 px-6 border-t border-[#EBE9DF] bg-[#FAF9F5] flex flex-row justify-end gap-3 shrink-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            className="bg-[#F2F2EC] hover:bg-[#e6e6de] text-[#34351f] border-0 font-medium"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="testimonial-form"
            disabled={submitting || uploading}
            className="bg-[#555829] hover:bg-[#444620] text-white font-medium shadow-xs"
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Guardar cambios" : "Guardar testimonio"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

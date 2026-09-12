"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { SingleImageUploader } from "@/components/shared/single-image-uploader";
import { generateSlug } from "@/lib/slug";
import { BLOG_CATEGORIES } from "../types";
import type { BlogPost, BlogStatus } from "../types";

interface BlogPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPost: BlogPost | null;
  onSave: (data: {
    title: string;
    category: string;
    coverImage?: string;
    content: string;
    status: BlogStatus;
    publishDate: string;
  }) => void;
}

export function BlogPostDialog({ open, onOpenChange, editingPost, onSave }: BlogPostDialogProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(BLOG_CATEGORIES[0]);
  const [coverImage, setCoverImage] = useState<string | undefined>();
  const [content, setContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(editingPost?.title ?? "");
      setCategory(editingPost?.category ?? BLOG_CATEGORIES[0]);
      setCoverImage(editingPost?.coverImage);
      setContent(editingPost?.content ?? "");
      setScheduledDate(editingPost?.publishDate ?? "");
    }
  }, [open, editingPost]);

  const slugPreview = generateSlug(title) || "url-del-articulo";

  function buildPayload(status: BlogStatus) {
    return {
      title: title.trim(),
      category,
      coverImage,
      content,
      status,
      publishDate: scheduledDate || new Date().toISOString().slice(0, 10),
    };
  }

  function handlePublish() {
    if (!title.trim() || !content.trim()) return;
    onSave(buildPayload("publicado"));
    onOpenChange(false);
  }

  function handleSchedule() {
    if (!title.trim() || !content.trim() || !scheduledDate) return;
    onSave(buildPayload("programado"));
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingPost ? "Editar artículo" : "Nuevo artículo"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título del artículo" className="text-lg font-medium" />

          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label className="mb-1.5 block text-xs">URL amigable (generada automáticamente)</Label>
              <Input value={slugPreview} disabled className="text-muted-foreground bg-secondary/50" />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs">Categoría</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BLOG_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <SingleImageUploader label="Imagen principal del artículo" value={coverImage} onChange={setCoverImage} folder="blog" />

          <div>
            <Label className="mb-1.5 block text-xs">Contenido</Label>
            <Textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe el contenido del artículo aquí..."
            />
          </div>

          <div>
            <Label className="mb-1.5 block text-xs">Fecha de publicación / programación</Label>
            <Input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
          </div>
        </div>

        <DialogFooter className="flex-wrap gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button variant="secondary" onClick={handleSchedule} disabled={!scheduledDate}>
            Programar
          </Button>
          <Button onClick={handlePublish}>Publicar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
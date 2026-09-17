"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, ImageIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
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
import { SingleImageUploader } from "@/components/shared/single-image-uploader";
import { generateSlug } from "@/lib/slug";
import { toast } from "@/lib/toast";
import { BLOG_CATEGORIES } from "../types";
import type { BlogPost, BlogStatus } from "../types";

/* ────────────────────────────────────────────── */
/*  Simple Rich-Text toolbar + contentEditable   */
/* ────────────────────────────────────────────── */
function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Sync initial / external value only on mount or when value resets to ""
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value === ""]);

  function exec(cmd: string, val?: string) {
    document.execCommand(cmd, false, val);
    if (ref.current) onChange(ref.current.innerHTML);
  }

  const btn =
    "h-7 w-7 flex items-center justify-center rounded text-xs hover:bg-muted transition-colors text-foreground/70 hover:text-foreground select-none";

  return (
    <div className="rounded-lg border border-border bg-background overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-border/60 bg-muted/30">
        <button type="button" className={btn} onMouseDown={(e) => { e.preventDefault(); exec("bold"); }} title="Negrita"><b>B</b></button>
        <button type="button" className={btn} onMouseDown={(e) => { e.preventDefault(); exec("italic"); }} title="Cursiva"><i>I</i></button>
        <button type="button" className={btn} onMouseDown={(e) => { e.preventDefault(); exec("underline"); }} title="Subrayado"><u>U</u></button>
        <span className="w-px h-5 bg-border/60 mx-1" />
        <button type="button" className={btn} onMouseDown={(e) => { e.preventDefault(); exec("formatBlock", "h2"); }} title="Encabezado 2">H2</button>
        <button type="button" className={btn} onMouseDown={(e) => { e.preventDefault(); exec("formatBlock", "h3"); }} title="Encabezado 3">H3</button>
        <span className="w-px h-5 bg-border/60 mx-1" />
        <button type="button" className={btn} onMouseDown={(e) => { e.preventDefault(); exec("insertUnorderedList"); }} title="Lista con viñetas">• ≡</button>
        <button type="button" className={btn} onMouseDown={(e) => { e.preventDefault(); exec("insertOrderedList"); }} title="Lista numerada">1.</button>
        <span className="w-px h-5 bg-border/60 mx-1" />
        <button type="button" className={btn} onMouseDown={(e) => { e.preventDefault(); exec("justifyLeft"); }} title="Alinear izquierda">⇤</button>
        <button type="button" className={btn} onMouseDown={(e) => { e.preventDefault(); exec("justifyCenter"); }} title="Centrar">⇔</button>
        <button type="button" className={btn} onMouseDown={(e) => { e.preventDefault(); exec("justifyRight"); }} title="Alinear derecha">⇥</button>
      </div>

      {/* Editable area */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className="min-h-[200px] max-h-[340px] overflow-y-auto p-3 text-sm text-foreground focus:outline-none prose prose-sm prose-stone max-w-none [&_h2]:text-base [&_h2]:font-semibold [&_h3]:text-sm [&_h3]:font-semibold"
        onInput={() => {
          if (ref.current) onChange(ref.current.innerHTML);
        }}
      />
    </div>
  );
}

/* ────────────────────────────────────────────── */
/*  BlogSheetDrawer component                    */
/* ────────────────────────────────────────────── */
interface BlogSheetDrawerProps {
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

export function BlogSheetDrawer({
  open,
  onOpenChange,
  editingPost,
  onSave,
}: BlogSheetDrawerProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(BLOG_CATEGORIES[0]);
  const [coverImage, setCoverImage] = useState<string | undefined>();
  const [content, setContent] = useState("");
  const [publishDate, setPublishDate] = useState("");

  /* Reset fields when the sheet opens */
  useEffect(() => {
    if (open) {
      setTitle(editingPost?.title ?? "");
      setCategory(editingPost?.category ?? BLOG_CATEGORIES[0]);
      setCoverImage(editingPost?.coverImage);
      setContent(editingPost?.content ?? "");
      setPublishDate(editingPost?.publishDate ?? new Date().toISOString().slice(0, 10));
    }
  }, [open, editingPost]);

  const slugPreview = generateSlug(title) || "url-del-articulo";

  function copySlug() {
    navigator.clipboard.writeText(slugPreview);
    toast.info("Slug copiado al portapapeles");
  }

  function buildPayload(status: BlogStatus) {
    return {
      title: title.trim(),
      category,
      coverImage,
      content,
      status,
      publishDate: publishDate || new Date().toISOString().slice(0, 10),
    };
  }

  function handleDraft() {
    if (!title.trim()) return;
    onSave(buildPayload("borrador"));
    onOpenChange(false);
  }

  function handlePublish() {
    if (!title.trim() || !content.trim()) return;
    onSave(buildPayload("publicado"));
    onOpenChange(false);
  }

  const isEdit = !!editingPost;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton
        className="!w-full sm:!max-w-xl lg:!max-w-2xl flex flex-col"
      >
        {/* ── Header ── */}
        <SheetHeader className="border-b border-border/60 pb-3">
          <SheetTitle className="text-lg font-serif">
            {isEdit ? "Editar artículo" : "Nuevo artículo"}
          </SheetTitle>
        </SheetHeader>

        {/* ── Body (scrollable) ── */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          {/* Título */}
          <div>
            <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Título
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título del artículo"
              className="text-base font-medium"
            />
          </div>

          {/* Slug con copiar */}
          <div>
            <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              URL amigable (slug)
            </Label>
            <div className="flex gap-2">
              <Input
                value={slugPreview}
                disabled
                className="flex-1 text-muted-foreground bg-secondary/50 font-mono text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0"
                onClick={copySlug}
                title="Copiar slug"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Categoría */}
          <div>
            <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Categoría
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-10 bg-background border-border/80 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BLOG_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Imagen de portada panorámica */}
          <div>
            <SingleImageUploader
              label="Imagen de portada"
              value={coverImage}
              onChange={setCoverImage}
              aspect="wide"
              folder="blog"
            />
            {coverImage && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-1.5 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                onClick={() =>
                  (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()
                }
              >
                <ImageIcon className="h-3.5 w-3.5" />
                Cambiar imagen
              </Button>
            )}
          </div>

          {/* Editor Rich Text */}
          <div>
            <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Contenido
            </Label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>

          {/* Fecha de publicación */}
          <div>
            <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Fecha de publicación
            </Label>
            <Input
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="h-10 bg-background border-border/80 text-sm"
            />
          </div>
        </div>

        {/* ── Footer ── */}
        <SheetFooter className="border-t border-border/60 pt-3 flex-row justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="secondary" onClick={handleDraft}>
            Guardar borrador
          </Button>
          <Button
            onClick={handlePublish}
            className="bg-[#6b7c3e] hover:bg-[#5a6a33] text-white"
          >
            Publicar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

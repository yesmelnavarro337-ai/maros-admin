"use client";

import { useState } from "react";
import { Search, Copy, Check, Upload, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { uploadImage } from "@/lib/api/media.service";

interface ProductSeoSubmoduleProps {
  seoTitle: string;
  setSeoTitle: (val: string) => void;
  seoSlug: string;
  setSeoSlug: (val: string) => void;
  seoDescription: string;
  setSeoDescription: (val: string) => void;
  keywords: string;
  setKeywords: (val: string) => void;
  seoSocialImageUrl?: string;
  setSeoSocialImageUrl: (val?: string) => void;
  productName: string;
}

export function ProductSeoSubmodule({
  seoTitle,
  setSeoTitle,
  seoSlug,
  setSeoSlug,
  seoDescription,
  setSeoDescription,
  keywords,
  setKeywords,
  seoSocialImageUrl,
  setSeoSocialImageUrl,
  productName,
}: ProductSeoSubmoduleProps) {
  const [copied, setCopied] = useState(false);
  const [uploadingOg, setUploadingOg] = useState(false);

  const finalTitle = seoTitle || (productName ? `${productName} | Maro's Pijamas` : "Título SEO de Producto");
  const finalSlug = seoSlug || productName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  const finalDescription =
    seoDescription || "Compra pijamas de alta calidad en satín y algodón. Envíos a toda Colombia.";

  const handleCopySlug = () => {
    const fullUrl = `https://marospijamas.com/productos/${finalSlug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    toast.success("Enlace copiado al portapapeles.");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUploadOgImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen OG no debe superar 5 MB.");
      return;
    }

    setUploadingOg(true);
    try {
      const res = await uploadImage(file, "seo");
      setSeoSocialImageUrl(res.url);
      toast.success("Imagen de vista previa social subida.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al subir la imagen.");
    } finally {
      setUploadingOg(false);
    }
  };

  // SEO Tips checklist status
  const isTitleLengthOk = finalTitle.length >= 30 && finalTitle.length <= 60;
  const isDescLengthOk = finalDescription.length >= 70 && finalDescription.length <= 160;
  const hasSlug = Boolean(finalSlug);
  const hasOgImage = Boolean(seoSocialImageUrl);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Columna Izquierda (Formulario SEO - 7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        <Card className="border-[#EBE9DF] shadow-xs bg-white">
          <CardHeader className="border-b border-[#FAF9F5] pb-4">
            <CardTitle className="font-heading font-serif text-lg font-bold text-[#34351f] flex items-center gap-2">
              <Search className="h-5 w-5 text-[#555829]" /> Optimización para Motores de Búsqueda (SEO)
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Personaliza la apariencia del producto en los resultados de Google y redes sociales
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-5">
            {/* Título SEO */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="seo-title" className="text-xs font-semibold text-[#34351f]">
                  Título SEO <span className="text-red-500">*</span>
                </Label>
                <span className={`text-[11px] ${seoTitle.length > 60 ? "text-red-500 font-semibold" : "text-muted-foreground"}`}>
                  {seoTitle.length} / 60 recomendados
                </span>
              </div>
              <Input
                id="seo-title"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Ej. Pijama Satín Beige de Lujo | Maro's Pijamas"
                maxLength={70}
                className="bg-white border-[#EBE9DF] focus-visible:ring-[#555829]"
              />
            </div>

            {/* URL Amigable / Slug */}
            <div className="space-y-1.5">
              <Label htmlFor="seo-slug" className="text-xs font-semibold text-[#34351f]">
                URL amigable (Slug)
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono select-none">
                    /productos/
                  </span>
                  <Input
                    id="seo-slug"
                    value={seoSlug}
                    onChange={(e) =>
                      setSeoSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                    }
                    placeholder="pijama-satin-elegante-beige"
                    className="pl-24 font-mono text-xs bg-white border-[#EBE9DF] focus-visible:ring-[#555829]"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopySlug}
                  className="bg-white border-[#EBE9DF] text-[#34351f] hover:bg-[#FAF9F5] h-9 px-3 gap-1.5"
                >
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  <span className="text-xs">Copiar URL</span>
                </Button>
              </div>
            </div>

            {/* Meta Descripción */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="seo-desc" className="text-xs font-semibold text-[#34351f]">
                  Meta Descripción <span className="text-red-500">*</span>
                </Label>
                <span className={`text-[11px] ${seoDescription.length > 160 ? "text-red-500 font-semibold" : "text-muted-foreground"}`}>
                  {seoDescription.length} / 160 recomendados
                </span>
              </div>
              <Textarea
                id="seo-desc"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Resumen atractivo del producto para captar clics en resultados de búsqueda..."
                rows={3}
                maxLength={180}
                className="bg-white border-[#EBE9DF] focus-visible:ring-[#555829] resize-none text-xs"
              />
            </div>

            {/* Palabras clave */}
            <div className="space-y-1.5">
              <Label htmlFor="seo-keywords" className="text-xs font-semibold text-[#34351f]">
                Palabras clave principales <span className="text-xs font-normal text-muted-foreground">(Separadas por comas)</span>
              </Label>
              <Input
                id="seo-keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="pijama satin, pijamas de mujer, ropa de dormir, maros pijamas"
                className="bg-white border-[#EBE9DF] focus-visible:ring-[#555829] text-xs"
              />
            </div>

            {/* Imagen OpenGraph para Redes Sociales */}
            <div className="space-y-1.5 pt-2 border-t border-[#FAF9F5]">
              <Label className="text-xs font-semibold text-[#34351f]">
                Imagen para redes sociales (OG Image) <span className="text-xs font-normal text-muted-foreground">(Recomendado 1200x630px)</span>
              </Label>
              {seoSocialImageUrl ? (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-[#EBE9DF] bg-[#FAF9F5]">
                  <img src={seoSocialImageUrl} alt="OG Preview" className="w-16 h-10 object-cover rounded-md border" />
                  <span className="text-xs text-[#34351f] truncate flex-1">{seoSocialImageUrl}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSeoSocialImageUrl(undefined)}
                    className="text-red-500 text-xs h-7"
                  >
                    Eliminar
                  </Button>
                </div>
              ) : (
                <label className="flex items-center justify-center p-4 rounded-lg border-2 border-dashed border-[#EBE9DF] bg-[#FAF9F5] hover:bg-[#F4F3ED] transition-colors cursor-pointer text-center">
                  <div className="flex items-center gap-2 text-xs text-[#34351f]">
                    <Upload className="h-4 w-4 text-[#555829]" />
                    <span>Subir imagen de vista previa para compartir en WhatsApp/Facebook</span>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleUploadOgImage}
                    disabled={uploadingOg}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Columna Derecha (Google SERP Live Preview & Checklist - 5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        {/* SERP Snippet Preview */}
        <Card className="border-[#EBE9DF] shadow-xs bg-white overflow-hidden">
          <CardHeader className="border-b border-[#FAF9F5] pb-3 bg-[#FAF9F5]">
            <CardTitle className="font-heading font-serif text-sm font-bold text-[#34351f] flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#9FA367]" /> Live Preview Google Snippet (SERP)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 p-4">
            <div className="p-4 rounded-xl border border-[#EBE9DF] bg-white space-y-1 font-sans">
              <div className="flex items-center gap-1.5 text-xs text-[#202124]">
                <span className="w-4 h-4 rounded-full bg-[#555829] text-white flex items-center justify-center text-[9px] font-bold">
                  M
                </span>
                <span className="text-[11px] text-[#202124]">marospijamas.com</span>
                <span className="text-[11px] text-[#5f6368]"> › productos › {finalSlug}</span>
              </div>

              <h3 className="text-base text-[#1a0dab] font-medium hover:underline cursor-pointer line-clamp-1">
                {finalTitle}
              </h3>

              <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                {finalDescription}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Checklist "Tips SEO" Dinámico */}
        <Card className="border-[#EBE9DF] shadow-xs bg-white">
          <CardHeader className="border-b border-[#FAF9F5] pb-3">
            <CardTitle className="font-heading font-serif text-sm font-bold text-[#34351f]">
              Checklist de Optimización SEO
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2.5 text-xs">
            <div className="flex items-center gap-2">
              {isTitleLengthOk ? (
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
              )}
              <span className={isTitleLengthOk ? "text-[#34351f]" : "text-muted-foreground"}>
                Longitud del título SEO adecuada (30-60 caracteres)
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isDescLengthOk ? (
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
              )}
              <span className={isDescLengthOk ? "text-[#34351f]" : "text-muted-foreground"}>
                Longitud de meta descripción adecuada (70-160 caracteres)
              </span>
            </div>

            <div className="flex items-center gap-2">
              {hasSlug ? (
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
              )}
              <span className={hasSlug ? "text-[#34351f]" : "text-muted-foreground"}>
                Slug limpio y amigable para motores de búsqueda
              </span>
            </div>

            <div className="flex items-center gap-2">
              {hasOgImage ? (
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
              )}
              <span className={hasOgImage ? "text-[#34351f]" : "text-muted-foreground"}>
                Imagen social (OG) asignada para compartir en redes
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

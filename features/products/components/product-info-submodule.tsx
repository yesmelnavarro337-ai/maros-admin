"use client";

import { useState } from "react";
import {
  Upload,
  Plus,
  Trash2,
  Check,
  Tag,
  Bold,
  Italic,
  Underline,
  List,
  Link as LinkIcon,
  Loader2,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadImage } from "@/lib/api/media.service";
import type { Category } from "@/features/categories/types";
import type { Collection } from "@/features/collections/types";
import type { ProductStatus } from "../types";
import { generateUniqueSku } from "../utils/sku-generator";

interface ProductInfoSubmoduleProps {
  name: string;
  setName: (val: string) => void;
  categoryId: string;
  setCategoryId: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  basePrice: number;
  setBasePrice: (val: number) => void;
  status: ProductStatus;
  setStatus: (val: ProductStatus) => void;
  totalStock: number;
  setTotalStock: (val: number) => void;
  weightKg?: number;
  setWeightKg: (val?: number) => void;
  brand: string;
  setBrand: (val: string) => void;
  sku: string;
  setSku: (val: string) => void;
  isOffer: boolean;
  setIsOffer: (val: boolean) => void;
  freeShipping: boolean;
  setFreeShipping: (val: boolean) => void;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  collectionIds: string[];
  setCollectionIds: React.Dispatch<React.SetStateAction<string[]>>;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  categories: Category[];
  collections: Collection[];
  loadingCategories?: boolean;
  loadingCollections?: boolean;
}

export function ProductInfoSubmodule({
  name,
  setName,
  categoryId,
  setCategoryId,
  description,
  setDescription,
  basePrice,
  setBasePrice,
  status,
  setStatus,
  totalStock,
  setTotalStock,
  weightKg,
  setWeightKg,
  brand,
  setBrand,
  sku,
  setSku,
  isOffer,
  setIsOffer,
  freeShipping,
  setFreeShipping,
  images,
  setImages,
  collectionIds,
  setCollectionIds,
  tags,
  setTags,
  categories,
  collections,
  loadingCategories,
  loadingCollections,
}: ProductInfoSubmoduleProps) {
  const [newTagInput, setNewTagInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`"${file.name}" supera el límite de 5 MB.`);
          continue;
        }
        const res = await uploadImage(file, "products");
        setImages((prev) => [...prev, res.url]);
      }
      toast.success("Imágenes cargadas correctamente.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al cargar la imagen.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetCover = (indexToCover: number) => {
    setImages((prev) => {
      const copy = [...prev];
      const target = copy.splice(indexToCover, 1)[0];
      return [target, ...copy];
    });
  };

  const handleAddTag = () => {
    const trimmed = newTagInput.trim().toLowerCase();
    if (!trimmed) return;
    if (tags.includes(trimmed)) {
      toast.error("La etiqueta ya ha sido agregada.");
      return;
    }
    setTags((prev) => [...prev, trimmed]);
    setNewTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const applyTextFormat = (tag: string) => {
    const formatted = `${description} <${tag}>`;
    setDescription(formatted);
  };

  const selectedCategoryName = categories.find((c) => c.id === categoryId)?.name || "Categoría";
  const coverImage = images[0] || null;

  const formatCOP = (num: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Columna Izquierda (Formulario Principal - 7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Card: Información Básica */}
        <Card className="border-[#EBE9DF] shadow-xs bg-white">
          <CardHeader className="border-b border-[#FAF9F5] pb-4">
            <CardTitle className="font-heading font-serif text-lg font-bold text-[#34351f]">
              Información básica
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Detalles principales del producto visibles en el catálogo
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-5">
            {/* Nombre */}
            <div className="space-y-1.5">
              <Label htmlFor="prod-name" className="text-xs font-semibold text-[#34351f]">
                Nombre del producto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="prod-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Pijama Satín Elegante Beige"
                className="bg-white border-[#EBE9DF] focus-visible:ring-[#555829]"
                required
              />
            </div>

            {/* Categoría */}
            <div className="space-y-1.5">
              <Label htmlFor="prod-cat" className="text-xs font-semibold text-[#34351f]">
                Categoría <span className="text-red-500">*</span>
              </Label>
              <Select value={categoryId} onValueChange={setCategoryId} disabled={loadingCategories}>
                <SelectTrigger id="prod-cat" className="bg-white border-[#EBE9DF] focus:ring-[#555829]">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Descripción con Editor / Formato */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="prod-desc" className="text-xs font-semibold text-[#34351f]">
                  Descripción del producto <span className="text-red-500">*</span>
                </Label>
                <span className={`text-[11px] ${description.length > 1000 ? "text-red-500 font-semibold" : "text-muted-foreground"}`}>
                  {description.length} / 1000 caracteres
                </span>
              </div>

              {/* Toolbar de formato rápido */}
              <div className="flex items-center gap-1 p-1 rounded-t-md border border-b-0 border-[#EBE9DF] bg-[#FAF9F5]">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => applyTextFormat("strong")}
                  title="Negrita"
                  className="h-7 w-7 text-[#34351f]"
                >
                  <Bold className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => applyTextFormat("em")}
                  title="Cursiva"
                  className="h-7 w-7 text-[#34351f]"
                >
                  <Italic className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => applyTextFormat("u")}
                  title="Subrayado"
                  className="h-7 w-7 text-[#34351f]"
                >
                  <Underline className="h-3.5 w-3.5" />
                </Button>
                <div className="h-4 w-px bg-[#EBE9DF] mx-1" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => applyTextFormat("ul")}
                  title="Lista"
                  className="h-7 w-7 text-[#34351f]"
                >
                  <List className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => applyTextFormat("a")}
                  title="Enlace"
                  className="h-7 w-7 text-[#34351f]"
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                </Button>
              </div>

              <Textarea
                id="prod-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe las telas, ajuste, instrucciones de lavado y características del producto..."
                rows={5}
                maxLength={1000}
                className="bg-white border-[#EBE9DF] rounded-t-none focus-visible:ring-[#555829] resize-none"
              />
            </div>

            {/* Grid 3 columnas: Precio, Estado, Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Precio Base */}
              <div className="space-y-1.5">
                <Label htmlFor="prod-price" className="text-xs font-semibold text-[#34351f]">
                  Precio base COP ($) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="prod-price"
                  type="number"
                  min={0}
                  step={1000}
                  value={basePrice || ""}
                  onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                  placeholder="129000"
                  className="bg-white border-[#EBE9DF] focus-visible:ring-[#555829]"
                />
              </div>

              {/* Estado */}
              <div className="space-y-1.5">
                <Label htmlFor="prod-status" className="text-xs font-semibold text-[#34351f]">
                  Estado
                </Label>
                <Select value={status} onValueChange={(val: ProductStatus) => setStatus(val)}>
                  <SelectTrigger id="prod-status" className="bg-white border-[#EBE9DF] focus:ring-[#555829]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="borrador">Borrador</SelectItem>
                    <SelectItem value="archivado">Archivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Stock */}
              <div className="space-y-1.5">
                <Label htmlFor="prod-stock" className="text-xs font-semibold text-[#34351f]">
                  Stock disponible
                </Label>
                <Input
                  id="prod-stock"
                  type="number"
                  min={0}
                  value={totalStock || 0}
                  onChange={(e) => setTotalStock(parseInt(e.target.value, 10) || 0)}
                  placeholder="10"
                  className="bg-white border-[#EBE9DF] focus-visible:ring-[#555829]"
                />
              </div>
            </div>

            {/* Peso kg */}
            <div className="space-y-1.5 sm:w-1/3">
              <Label htmlFor="prod-weight" className="text-xs font-semibold text-[#34351f]">
                Peso (kg) <span className="text-xs font-normal text-muted-foreground">(Opcional)</span>
              </Label>
              <Input
                id="prod-weight"
                type="number"
                step="0.01"
                min={0}
                value={weightKg || ""}
                onChange={(e) => setWeightKg(parseFloat(e.target.value) || undefined)}
                placeholder="0.35"
                className="bg-white border-[#EBE9DF] focus-visible:ring-[#555829]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Card: Información Adicional */}
        <Card className="border-[#EBE9DF] shadow-xs bg-white">
          <CardHeader className="border-b border-[#FAF9F5] pb-4">
            <CardTitle className="font-heading font-serif text-lg font-bold text-[#34351f]">
              Información adicional
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Códigos de inventario, oferta y características de despacho
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Marca */}
              <div className="space-y-1.5">
                <Label htmlFor="prod-brand" className="text-xs font-semibold text-[#34351f]">
                  Marca
                </Label>
                <Input
                  id="prod-brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Maro's Pijamas"
                  className="bg-white border-[#EBE9DF] focus-visible:ring-[#555829]"
                />
              </div>

              {/* SKU */}
              <div className="space-y-1.5">
                <Label htmlFor="prod-sku" className="text-xs font-semibold text-[#34351f]">
                  SKU (Código Interno)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="prod-sku"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="MP-BASE-PROD-1024"
                    className="bg-white border-[#EBE9DF] focus-visible:ring-[#555829]"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSku(generateUniqueSku("BASE", name ? name.slice(0, 3) : "PROD"))}
                    title="Autogenerar SKU único"
                    className="border-[#EBE9DF] text-[#555829] hover:bg-[#FAF9F5] text-xs h-9 px-3 shrink-0 gap-1.5 font-medium"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Autogenerar SKU</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Switches de Oferta y Envío Gratis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#FAF9F5]">
              <div className="flex items-center justify-between p-3 rounded-lg border border-[#EBE9DF] bg-[#FAF9F5]">
                <div>
                  <p className="text-xs font-semibold text-[#34351f]">Producto en oferta</p>
                  <p className="text-[11px] text-muted-foreground">Muestra badge promocional</p>
                </div>
                <Switch checked={isOffer} onCheckedChange={setIsOffer} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-[#EBE9DF] bg-[#FAF9F5]">
                <div>
                  <p className="text-xs font-semibold text-[#34351f]">Envío gratis</p>
                  <p className="text-[11px] text-muted-foreground">Destaca beneficio al cliente</p>
                </div>
                <Switch checked={freeShipping} onCheckedChange={setFreeShipping} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Columna Derecha (Imágenes + Colección + Etiquetas + Live Preview - 5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        {/* Card: Imágenes del producto */}
        <Card className="border-[#EBE9DF] shadow-xs bg-white">
          <CardHeader className="border-b border-[#FAF9F5] pb-4">
            <CardTitle className="font-heading font-serif text-lg font-bold text-[#34351f]">
              Imágenes del producto
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Formatos JPG, PNG o WEBP máx. 5 MB por archivo
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            {/* Dropzone */}
            <label
              htmlFor="product-images-dropzone"
              className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-[#EBE9DF] bg-[#FAF9F5] hover:bg-[#F4F3ED] transition-colors cursor-pointer text-center"
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin text-[#555829]" />
                  <span className="text-xs">Subiendo imágenes...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5">
                  <div className="p-2 rounded-full bg-[#EBE9DF] text-[#555829]">
                    <Upload className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-[#34351f]">
                    Arrastra y suelta tus imágenes aquí
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    o haz clic para seleccionar archivos
                  </span>
                </div>
              )}
              <input
                id="product-images-dropzone"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleUploadImage}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {/* Grid de Thumbnails */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                {images.map((img, idx) => {
                  const isCover = idx === 0;
                  return (
                    <div
                      key={img + idx}
                      className={`relative aspect-square rounded-md border overflow-hidden group bg-card ${
                        isCover ? "border-2 border-[#555829]" : "border-[#EBE9DF]"
                      }`}
                    >
                      <img src={img} alt={`Imagen ${idx + 1}`} className="w-full h-full object-cover" />

                      {/* Cover Indicator */}
                      {isCover && (
                        <span className="absolute top-1 left-1 bg-[#555829] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs flex items-center gap-0.5">
                          <Check className="h-2.5 w-2.5" /> Portada
                        </span>
                      )}

                      {/* Overlay actions */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        {!isCover && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => handleSetCover(idx)}
                            title="Establecer portada"
                            className="h-7 w-7 text-white hover:bg-white/20"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleRemoveImage(idx)}
                          title="Eliminar imagen"
                          className="h-7 w-7 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {/* Botón "+" para agregar más */}
                <label
                  htmlFor="product-images-add-more"
                  className="aspect-square rounded-md border-2 border-dashed border-[#EBE9DF] bg-[#FAF9F5] hover:bg-[#F4F3ED] flex flex-col items-center justify-center text-muted-foreground cursor-pointer transition-colors"
                >
                  <Plus className="h-5 w-5 text-[#555829]" />
                  <span className="text-[10px] font-medium text-[#34351f] mt-0.5">Agregar</span>
                  <input
                    id="product-images-add-more"
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleUploadImage}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card: Colección Rápida */}
        <Card className="border-[#EBE9DF] shadow-xs bg-white">
          <CardHeader className="border-b border-[#FAF9F5] pb-3">
            <CardTitle className="font-heading font-serif text-sm font-bold text-[#34351f]">
              Asociar colección
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Select
              value={collectionIds[0] || "ninguna"}
              onValueChange={(val) => {
                if (val === "ninguna") setCollectionIds([]);
                else setCollectionIds([val]);
              }}
              disabled={loadingCollections}
            >
              <SelectTrigger className="bg-white border-[#EBE9DF] focus:ring-[#555829]">
                <SelectValue placeholder="Selecciona una colección" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ninguna">Sin colección asignada</SelectItem>
                {collections.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Card: Etiquetas */}
        <Card className="border-[#EBE9DF] shadow-xs bg-white">
          <CardHeader className="border-b border-[#FAF9F5] pb-3">
            <CardTitle className="font-heading font-serif text-sm font-bold text-[#34351f]">
              Etiquetas del producto
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="flex gap-2">
              <Input
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                placeholder="Ej. satín, mujer, comodidad"
                className="bg-white border-[#EBE9DF] focus-visible:ring-[#555829] text-xs"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                className="bg-[#555829] hover:bg-[#444620] text-white shrink-0 h-9 px-3"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((t) => (
                  <Badge
                    key={t}
                    className="bg-[#FAF9F5] text-[#34351f] border border-[#EBE9DF] hover:bg-[#F2F2EC] gap-1 text-xs py-1 px-2.5 rounded-full font-medium"
                  >
                    <Tag className="h-3 w-3 text-[#555829]" />
                    {t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="ml-1 text-muted-foreground hover:text-red-500 focus:outline-none"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-muted-foreground">No hay etiquetas agregadas.</p>
            )}
          </CardContent>
        </Card>

        {/* Card: Vista Previa E-commerce */}
        <Card className="border-[#EBE9DF] shadow-xs bg-white overflow-hidden">
          <CardHeader className="border-b border-[#FAF9F5] pb-3 bg-[#FAF9F5]">
            <div className="flex items-center justify-between">
              <CardTitle className="font-heading font-serif text-sm font-bold text-[#34351f] flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#9FA367]" /> Live Preview E-commerce
              </CardTitle>
              <Badge variant="outline" className="text-[10px] bg-white border-[#EBE9DF]">
                {status === "activo" ? "En catálogo" : "Oculto"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 p-4">
            <div className="rounded-xl border border-[#EBE9DF] bg-white overflow-hidden max-w-xs mx-auto shadow-xs">
              <div className="relative aspect-3/4 bg-[#FAF9F5] flex items-center justify-center overflow-hidden">
                {coverImage ? (
                  <img src={coverImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground p-4 text-center">
                    <ShoppingBag className="h-10 w-10 text-[#9FA367] opacity-50" />
                    <span className="text-xs">Sin imagen de portada</span>
                  </div>
                )}
                {isOffer && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Oferta
                  </span>
                )}
                {freeShipping && (
                  <span className="absolute bottom-2 left-2 bg-[#555829] text-white font-medium text-[9px] px-2 py-0.5 rounded-full">
                    Envío Gratis
                  </span>
                )}
              </div>
              <div className="p-3.5 space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  {selectedCategoryName}
                </span>
                <h4 className="font-serif font-bold text-sm text-[#34351f] truncate">
                  {name || "Nombre del Producto"}
                </h4>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-semibold text-sm text-[#555829]">
                    {formatCOP(basePrice)}
                  </span>
                  <Badge className="bg-[#EBE9DF] text-[#666459] text-[10px] border-0">
                    Stock: {totalStock}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

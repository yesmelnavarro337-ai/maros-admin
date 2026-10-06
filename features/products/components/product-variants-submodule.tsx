"use client";

import { useState } from "react";
import { Plus, Search, Trash2, Pencil, Sparkles, Image as ImageIcon, PackageCheck, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SizesColorsEditor } from "./sizes-colors-editor";
import type { ProductVariant, ProductColor } from "../types";
import { DEFAULT_VARIANT_STOCK } from "../types";
import { generateUniqueSku } from "../utils/sku-generator";
import { getColorPreviewStyle } from "../utils/color-helper";
import { getSizeLineMode, isLargeSize } from "../utils/price-calculator";
import { getAvailableSizesByStyle } from "../utils/size-helpers";
import { toast } from "@/lib/toast";

interface ProductVariantsSubmoduleProps {
  sizes: string[];
  colors: ProductColor[];
  styles?: string[];
  materials?: string[];
  variants: ProductVariant[];
  basePrice: number;
  selectedCategoryNames?: string[];
  /** Catálogo de tallas permitido para el estilo seleccionado. */
  availableSizes?: readonly string[];
  onAddSize: (size: string) => void;
  onRemoveSize: (size: string) => void;
  onAddColor: (color: ProductColor) => void;
  onRemoveColor: (name: string) => void;
  onAddStyle?: (style: string) => void;
  onRemoveStyle?: (style: string) => void;
  onAddMaterial?: (material: string) => void;
  onRemoveMaterial?: (material: string) => void;
  onUpdateVariant: (id: string, patch: Partial<ProductVariant>) => void;
  onBulkUpdateStock?: (stock: number, variantIds?: string[]) => void;
  onBulkUpdateAvailability?: (isAvailable: boolean, variantIds?: string[]) => void;
  onRegenerateAllSkus?: () => void;
}

export function ProductVariantsSubmodule({
  sizes,
  colors,
  styles = [],
  materials = [],
  variants,
  basePrice,
  selectedCategoryNames = [],
  availableSizes,
  onAddSize,
  onRemoveSize,
  onAddColor,
  onRemoveColor,
  onAddStyle,
  onRemoveStyle,
  onAddMaterial,
  onRemoveMaterial,
  onUpdateVariant,
  onBulkUpdateStock,
  onBulkUpdateAvailability,
  onRegenerateAllSkus,
}: ProductVariantsSubmoduleProps) {
  const [colorFilter, setColorFilter] = useState("todos");
  const [sizeFilter, setSizeFilter] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [bulkStock, setBulkStock] = useState(String(DEFAULT_VARIANT_STOCK));
  const [bulkMarkAvailable, setBulkMarkAvailable] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants[0]?.id || null
  );

  // El selector de estilos y tallas se limita a la línea del producto según la
  // categoría: infantil sólo ofrece estilos/tallas infantiles, adulto sólo los
  // de adulto, y "mixed" (ambas categorías seleccionadas) desbloquea ambos.
  const sizeLineMode = getSizeLineMode(selectedCategoryNames);

  // Catálogo de tallas que corresponde a la línea del producto.
  const sizeCatalog = availableSizes ?? getAvailableSizesByStyle(styles[0] ?? null, sizeLineMode);

  const filteredVariants = variants.filter((v) => {
    if (colorFilter !== "todos" && v.colorName !== colorFilter) return false;
    if (sizeFilter !== "todos" && v.size !== sizeFilter) return false;
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase();
      const match =
        v.colorName.toLowerCase().includes(term) ||
        v.size.toLowerCase().includes(term) ||
        v.sku.toLowerCase().includes(term);
      if (!match) return false;
    }
    return true;
  });

  const activeSelectedVariant =
    variants.find((v) => v.id === selectedVariantId) || variants[0] || null;
  const categoryContext = selectedCategoryNames.length > 0 ? selectedCategoryNames : ["Producto base"];

  const hasActiveFilter =
    colorFilter !== "todos" || sizeFilter !== "todos" || searchQuery.trim().length > 0;

  // Las acciones masivas se limitan al alcance del filtro activo para no pisar
  // el stock de combinaciones que la clienta no está viendo.
  const scopeIds = hasActiveFilter ? filteredVariants.map((v) => v.id) : undefined;

  const scopeLabel = hasActiveFilter
    ? `la selección filtrada (${filteredVariants.length} de ${variants.length})`
    : `todas las variantes (${variants.length})`;

  const handleApplyBulkStock = () => {
    const parsed = parseInt(bulkStock, 10);
    if (!Number.isFinite(parsed) || parsed < 0) {
      toast.error("Ingresa un stock masivo válido (número entero >= 0).");
      return;
    }
    if (variants.length === 0) {
      toast.error("No hay variantes para actualizar.");
      return;
    }
    onBulkUpdateStock?.(parsed, scopeIds);
    toast.success(`Stock de ${parsed} unidades aplicado a ${scopeLabel}.`);
  };

  const handleApplyBulkAvailability = (checked: boolean) => {
    setBulkMarkAvailable(checked);
    if (variants.length === 0) return;
    onBulkUpdateAvailability?.(checked, scopeIds);
    toast.success(`Variantes marcadas como ${checked ? "disponibles" : "no disponibles"} en ${scopeLabel}.`);
  };

  const resetFilters = () => {
    setColorFilter("todos");
    setSizeFilter("todos");
    setSearchQuery("");
  };

  const formatCOP = (num: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  const getPriceHint = (price: number | null | undefined) => {
    if (price == null) return `Hereda ${formatCOP(basePrice)}`;

    const difference = price - basePrice;
    if (difference === 0) return "Igual al precio base";

    const prefix = difference > 0 ? "+" : "-";
    return `${prefix} ${formatCOP(Math.abs(difference))} sobre el base`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Columna Izquierda (Tabla de Variantes - 7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Editor de Tallas y Colores */}
        <Card className="border-[#EBE9DF] shadow-xs bg-white">
          <CardHeader className="border-b border-[#FAF9F5] pb-4">
            <CardTitle className="font-heading font-serif text-lg font-bold text-[#34351f]">
              Opciones de Tallas y Colores
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Define los atributos simples o combinados para generar la matriz de combinaciones del producto
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <SizesColorsEditor
              sizes={sizes}
              colors={colors}
              styles={styles}
              materials={materials}
              sizeLineMode={sizeLineMode}
              availableSizes={sizeCatalog}
              onAddSize={onAddSize}
              onRemoveSize={onRemoveSize}
              onAddColor={onAddColor}
              onRemoveColor={onRemoveColor}
              onAddStyle={onAddStyle}
              onRemoveStyle={onRemoveStyle}
              onAddMaterial={onAddMaterial}
              onRemoveMaterial={onRemoveMaterial}
            />
          </CardContent>
        </Card>

        {/* Card: Tabla de Variantes Generadas */}
        <Card className="border-[#EBE9DF] shadow-xs bg-white">
          <CardHeader className="border-b border-[#FAF9F5] pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-heading font-serif text-lg font-bold text-[#34351f]">
                Variantes del producto
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Total combinaciones: {variants.length}
              </CardDescription>
            </div>
            {onRegenerateAllSkus && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onRegenerateAllSkus}
                title="Autogenerar SKUs únicos para todas las variantes"
                className="border-[#EBE9DF] text-[#555829] hover:bg-[#FAF9F5] text-xs h-8 px-2.5 gap-1.5 font-medium"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#555829]" />
                Autogenerar SKUs
              </Button>
            )}
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar variante por SKU, color o talla..."
                  className="pl-8 h-8 text-xs bg-white border-[#EBE9DF]"
                />
              </div>

              <Select value={colorFilter} onValueChange={setColorFilter}>
                <SelectTrigger className="w-[150px] h-8 text-xs bg-white border-[#EBE9DF]">
                  <SelectValue placeholder="Color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos colores</SelectItem>
                  {colors.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="h-2.5 w-2.5 rounded-full border border-black/10 shrink-0"
                          style={getColorPreviewStyle(c)}
                        />
                        <span className="truncate">{c.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sizeFilter} onValueChange={setSizeFilter}>
                <SelectTrigger className="w-[110px] h-8 text-xs bg-white border-[#EBE9DF]">
                  <SelectValue placeholder="Talla" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas tallas</SelectItem>
                  {sizes.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilter && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-8 text-xs text-[#555829] hover:bg-[#FAF9F5]"
                >
                  <Search className="h-3 w-3 rotate-45" />
                  Limpiar filtros
                </Button>
              )}
            </div>

            {/* Acciones masivas de stock */}
            <div className="rounded-lg border border-[#555829]/25 bg-[#FAF9F5] p-3 space-y-3">
              <div className="flex items-center gap-2">
                <Layers className="h-3.5 w-3.5 text-[#555829]" />
                <p className="text-xs font-semibold text-[#34351f]">Acciones masivas de stock</p>
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-1.5">
                  <Label htmlFor="bulk-stock" className="text-[11px] font-medium text-[#34351f]">
                    Stock masivo
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="bulk-stock"
                      type="number"
                      min={0}
                      value={bulkStock}
                      onChange={(e) => setBulkStock(e.target.value)}
                      className="w-24 h-8 text-xs bg-white border-[#EBE9DF]"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleApplyBulkStock}
                      disabled={!onBulkUpdateStock || variants.length === 0}
                      className="h-8 text-xs gap-1.5 font-medium bg-[#555829] text-white hover:bg-[#4a4d24]"
                    >
                      <PackageCheck className="h-3.5 w-3.5" />
                      Aplicar a {hasActiveFilter ? "la selección" : "todas las variantes"}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pb-1">
                  <Switch
                    id="bulk-available"
                    checked={bulkMarkAvailable}
                    onCheckedChange={handleApplyBulkAvailability}
                    disabled={!onBulkUpdateAvailability || variants.length === 0}
                  />
                  <Label
                    htmlFor="bulk-available"
                    className="text-[11px] font-medium text-[#34351f] cursor-pointer"
                  >
                    Marcar todas como Disponibles / En Stock
                  </Label>
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground">
                {hasActiveFilter
                  ? `El alcance es ${scopeLabel}. Ajusta los filtros de color o talla para cambiar la selección.`
                  : `El alcance es ${scopeLabel}. Usa los filtros de color o talla para aplicar solo a una selección.`}
              </p>
            </div>

            {/* Tabla */}
            <div className="rounded-lg border border-[#EBE9DF] overflow-hidden">
              <Table>
                <TableHeader className="bg-[#FAF9F5]">
                  <TableRow className="border-[#EBE9DF]">
                    <TableHead className="w-[140px] text-xs font-semibold text-[#34351f]">Color</TableHead>
                    <TableHead className="text-xs font-semibold text-[#34351f]">Talla</TableHead>
                    <TableHead className="text-xs font-semibold text-[#34351f]">Categoría / tipo</TableHead>
                    <TableHead className="text-xs font-semibold text-[#34351f]">SKU</TableHead>
                    <TableHead className="text-xs font-semibold text-[#34351f]">Stock</TableHead>
                    <TableHead className="text-xs font-semibold text-[#34351f]">Precio</TableHead>
                    <TableHead className="text-xs text-right font-semibold text-[#34351f]">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVariants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-xs text-muted-foreground">
                        No hay variantes agregadas o coincidentes con el filtro.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVariants.map((v) => {
                      const isSelected = activeSelectedVariant?.id === v.id;
                      const isAvailable = v.isAvailable ?? true;
                      const hasStock = v.stock > 0;

                      return (
                        <TableRow
                          key={v.id}
                          onClick={() => setSelectedVariantId(v.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? "bg-[#555829]/10 font-medium" : "hover:bg-[#FAF9F5]"
                          }`}
                        >
                          {/* Dot cromático + Nombre color */}
                          <TableCell className="py-2">
                            <div className="flex items-center gap-2">
                              <span
                                className="h-3.5 w-3.5 rounded-full border border-black/10 shrink-0 shadow-2xs"
                                style={getColorPreviewStyle({
                                  primaryHex: v.primaryHex || v.colorHex,
                                  secondaryHex: v.secondaryHex,
                                  isCombined: v.isCombined,
                                })}
                              />
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs text-[#34351f] truncate font-medium">{v.colorName}</span>
                                {v.isCombined && (
                                  <span className="text-[9px] text-[#555829] font-normal">
                                    Combinado
                                  </span>
                                )}
                              </div>
                            </div>
                          </TableCell>

                          {/* Talla */}
                          <TableCell className="py-2 text-xs font-bold text-[#34351f]">
                            <div className="flex flex-col items-start gap-0.5">
                              <span>{v.size}</span>
                              {isLargeSize(v.size) && (
                                <Badge variant="outline" className="border-[#555829] text-[#555829] text-[9px] px-1 py-0 font-normal bg-[#555829]/5">
                                  +$10k Talla XL+
                                </Badge>
                              )}
                            </div>
                          </TableCell>

                          {/* Categoría / Tipo */}
                          <TableCell className="py-2">
                            <div className="flex max-w-44 flex-wrap gap-1">
                              {categoryContext.slice(0, 2).map((name) => (
                                <Badge
                                  key={name}
                                  variant="outline"
                                  className="border-[#EBE9DF] bg-white text-[10px] font-medium text-[#555829]"
                                >
                                  {name}
                                </Badge>
                              ))}
                              {categoryContext.length > 2 && (
                                <Badge
                                  variant="outline"
                                  className="border-[#EBE9DF] bg-white text-[10px] font-medium text-muted-foreground"
                                >
                                  +{categoryContext.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>

                          {/* SKU */}
                          <TableCell className="py-2 text-xs text-muted-foreground font-mono">
                            <div className="flex items-center gap-1">
                              <Input
                                value={v.sku}
                                onChange={(e) => onUpdateVariant(v.id, { sku: e.target.value })}
                                className="h-7 text-xs bg-white border-[#EBE9DF]"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                title="Autogenerar SKU único"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onUpdateVariant(v.id, { sku: generateUniqueSku(v.size, v.colorName) });
                                }}
                                className="h-7 w-7 text-[#555829] hover:bg-[#FAF9F5] shrink-0"
                              >
                                <Sparkles className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>

                          {/* Stock */}
                          <TableCell className="py-2 text-xs">
                            <Input
                              type="number"
                              min={0}
                              value={v.stock}
                              onChange={(e) =>
                                onUpdateVariant(v.id, { stock: parseInt(e.target.value, 10) || 0 })
                              }
                              className="h-7 w-20 text-xs bg-white border-[#EBE9DF]"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </TableCell>

                          {/* Precio (Inmutable / Auto-calculado) */}
                          <TableCell className="py-2 text-xs">
                            {(() => {
                              const isPlus = isLargeSize(v.size);
                              const computedPrice = v.price ?? (isPlus ? basePrice + 10000 : basePrice);

                              return (
                                <>
                                  <Input
                                    type="number"
                                    min={0}
                                    step={100}
                                    value={computedPrice || ""}
                                    readOnly
                                    disabled
                                    className="h-7 w-32 text-xs bg-[#FAF9F5] border-[#EBE9DF] font-bold text-[#555829] cursor-not-allowed"
                                    onClick={(e) => e.stopPropagation()}
                                    title="Precio inmutable auto-calculado por regla de estilo y talla."
                                  />
                                  <p className="mt-1 text-[10px] font-medium text-[#555829]">
                                    {isPlus
                                      ? `+$10k Talla XL+ (${formatCOP(computedPrice)})`
                                      : `Base estilo (${formatCOP(computedPrice)})`}
                                  </p>
                                </>
                              );
                            })()}
                          </TableCell>

                          {/* Estado Badge */}
                          <TableCell className="py-2 text-right">
                            {hasStock && isAvailable ? (
                              <Badge className="bg-[#555829] text-white text-[10px] py-0 px-2">
                                Disponible
                              </Badge>
                            ) : (
                              <Badge className="bg-[#EBE9DF] text-[#666459] text-[10px] py-0 px-2">
                                {hasStock ? "No disponible" : "Sin stock"}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Columna Derecha (Live Preview Variante - 5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        <Card className="border-[#EBE9DF] shadow-xs bg-white overflow-hidden">
          <CardHeader className="border-b border-[#FAF9F5] pb-3 bg-[#FAF9F5]">
            <div className="flex items-center justify-between">
              <CardTitle className="font-heading font-serif text-sm font-bold text-[#34351f] flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#9FA367]" /> Live Preview Variante
              </CardTitle>
              <Badge variant="outline" className="text-[10px] bg-white border-[#EBE9DF]">
                {activeSelectedVariant ? `Talla ${activeSelectedVariant.size}` : "Variante"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 p-4">
            {activeSelectedVariant ? (
              <div className="rounded-xl border border-[#EBE9DF] bg-white overflow-hidden max-w-xs mx-auto shadow-xs">
                <div className="relative aspect-3/4 bg-[#FAF9F5] flex items-center justify-center overflow-hidden">
                  {activeSelectedVariant.image ? (
                    <img
                      src={activeSelectedVariant.image}
                      alt={activeSelectedVariant.colorName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground p-4 text-center">
                      <ImageIcon className="h-10 w-10 text-[#9FA367] opacity-50" />
                      <span className="text-xs">Sin imagen asignada a la variante</span>
                    </div>
                  )}
                  <span
                    className="absolute top-2 right-2 h-5 w-5 rounded-full border border-white shadow-xs"
                    style={getColorPreviewStyle({
                      primaryHex: activeSelectedVariant.primaryHex || activeSelectedVariant.colorHex,
                      secondaryHex: activeSelectedVariant.secondaryHex,
                      isCombined: activeSelectedVariant.isCombined,
                    })}
                    title={activeSelectedVariant.colorName}
                  />
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        className="h-3 w-3 rounded-full border border-black/10 shrink-0 shadow-2xs"
                        style={getColorPreviewStyle({
                          primaryHex: activeSelectedVariant.primaryHex || activeSelectedVariant.colorHex,
                          secondaryHex: activeSelectedVariant.secondaryHex,
                          isCombined: activeSelectedVariant.isCombined,
                        })}
                      />
                      <span className="text-xs font-bold text-[#34351f] truncate">
                        Color: {activeSelectedVariant.colorName}
                      </span>
                    </div>
                    <Badge className="bg-[#FAF9F5] text-[#34351f] border border-[#EBE9DF] text-[10px]">
                      Talla {activeSelectedVariant.size}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-muted-foreground font-mono">
                    SKU: {activeSelectedVariant.sku || "Sin SKU"}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#FAF9F5]">
                    <span className="font-bold text-base text-[#555829]">
                      {formatCOP(activeSelectedVariant.price ?? basePrice)}
                    </span>
                    <Badge
                      className={
                        activeSelectedVariant.stock > 0
                          ? "bg-[#555829] text-white"
                          : "bg-[#EBE9DF] text-[#666459]"
                      }
                    >
                      {activeSelectedVariant.stock > 0
                        ? `${activeSelectedVariant.stock} un. stock`
                        : "Agotado"}
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-60 flex flex-col items-center justify-center text-muted-foreground text-center p-4">
                <Sparkles className="h-8 w-8 text-[#9FA367] opacity-50 mb-2" />
                <p className="text-xs">Selecciona una variante de la tabla para ver su vista previa.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

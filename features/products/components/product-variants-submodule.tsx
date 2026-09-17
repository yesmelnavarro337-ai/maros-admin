"use client";

import { useState } from "react";
import { Plus, Search, Trash2, Pencil, Sparkles, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface ProductVariantsSubmoduleProps {
  sizes: string[];
  colors: ProductColor[];
  variants: ProductVariant[];
  basePrice: number;
  onAddSize: (size: string) => void;
  onRemoveSize: (size: string) => void;
  onAddColor: (color: ProductColor) => void;
  onRemoveColor: (name: string) => void;
  onUpdateVariant: (id: string, patch: Partial<ProductVariant>) => void;
}

export function ProductVariantsSubmodule({
  sizes,
  colors,
  variants,
  basePrice,
  onAddSize,
  onRemoveSize,
  onAddColor,
  onRemoveColor,
  onUpdateVariant,
}: ProductVariantsSubmoduleProps) {
  const [colorFilter, setColorFilter] = useState("todos");
  const [sizeFilter, setSizeFilter] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants[0]?.id || null
  );

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

  const formatCOP = (num: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(num || 0);
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
              Define los atributos para generar la matriz de combinaciones del producto
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <SizesColorsEditor
              sizes={sizes}
              colors={colors}
              onAddSize={onAddSize}
              onRemoveSize={onRemoveSize}
              onAddColor={onAddColor}
              onRemoveColor={onRemoveColor}
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
                <SelectTrigger className="w-[130px] h-8 text-xs bg-white border-[#EBE9DF]">
                  <SelectValue placeholder="Color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos colores</SelectItem>
                  {colors.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      {c.name}
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
            </div>

            {/* Tabla */}
            <div className="rounded-lg border border-[#EBE9DF] overflow-hidden">
              <Table>
                <TableHeader className="bg-[#FAF9F5]">
                  <TableRow className="border-[#EBE9DF]">
                    <TableHead className="w-[60px] text-xs font-semibold text-[#34351f]">Color</TableHead>
                    <TableHead className="text-xs font-semibold text-[#34351f]">Talla</TableHead>
                    <TableHead className="text-xs font-semibold text-[#34351f]">SKU</TableHead>
                    <TableHead className="text-xs font-semibold text-[#34351f]">Stock</TableHead>
                    <TableHead className="text-xs font-semibold text-[#34351f]">Precio</TableHead>
                    <TableHead className="text-xs text-right font-semibold text-[#34351f]">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVariants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-xs text-muted-foreground">
                        No hay variantes agregadas o coincidentes con el filtro.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVariants.map((v) => {
                      const isSelected = activeSelectedVariant?.id === v.id;
                      const variantPrice = v.price || basePrice;
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
                                className="h-3.5 w-3.5 rounded-full border border-black/10 shrink-0"
                                style={{ backgroundColor: v.colorHex }}
                              />
                              <span className="text-xs text-[#34351f] truncate">{v.colorName}</span>
                            </div>
                          </TableCell>

                          {/* Talla */}
                          <TableCell className="py-2 text-xs font-bold text-[#34351f]">
                            {v.size}
                          </TableCell>

                          {/* SKU */}
                          <TableCell className="py-2 text-xs text-muted-foreground font-mono">
                            <Input
                              value={v.sku}
                              onChange={(e) => onUpdateVariant(v.id, { sku: e.target.value })}
                              className="h-7 text-xs bg-white border-[#EBE9DF]"
                              onClick={(e) => e.stopPropagation()}
                            />
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

                          {/* Precio */}
                          <TableCell className="py-2 text-xs text-[#555829] font-medium whitespace-nowrap">
                            {formatCOP(variantPrice)}
                          </TableCell>

                          {/* Estado Badge */}
                          <TableCell className="py-2 text-right">
                            {hasStock ? (
                              <Badge className="bg-[#555829] text-white text-[10px] py-0 px-2">
                                Disponible
                              </Badge>
                            ) : (
                              <Badge className="bg-[#EBE9DF] text-[#666459] text-[10px] py-0 px-2">
                                Sin stock
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
                    style={{ backgroundColor: activeSelectedVariant.colorHex }}
                  />
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#34351f]">
                      Color: {activeSelectedVariant.colorName}
                    </span>
                    <Badge className="bg-[#FAF9F5] text-[#34351f] border border-[#EBE9DF] text-[10px]">
                      Talla {activeSelectedVariant.size}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-muted-foreground font-mono">
                    SKU: {activeSelectedVariant.sku || "Sin SKU"}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#FAF9F5]">
                    <span className="font-bold text-base text-[#555829]">
                      {formatCOP(activeSelectedVariant.price || basePrice)}
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

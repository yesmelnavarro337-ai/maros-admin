"use client";

import { Layers, Lightbulb, Sparkles, Tag, Plus, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/features/categories/types";
import type { Collection } from "@/features/collections/types";

interface ProductCollectionSubmoduleProps {
  categoryId: string;
  setCategoryId: (val: string) => void;
  collectionIds: string[];
  setCollectionIds: React.Dispatch<React.SetStateAction<string[]>>;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  brand: string;
  setBrand: (val: string) => void;
  categories: Category[];
  collections: Collection[];
  loadingCategories?: boolean;
  loadingCollections?: boolean;
}

export function ProductCollectionSubmodule({
  categoryId,
  setCategoryId,
  collectionIds,
  setCollectionIds,
  tags,
  setTags,
  brand,
  setBrand,
  categories,
  collections,
  loadingCategories,
  loadingCollections,
}: ProductCollectionSubmoduleProps) {
  const toggleCollection = (id: string) => {
    setCollectionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const activeCollections = collections.filter((c) => collectionIds.includes(c.id));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Columna Izquierda (Asignación Avanzada - 7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        <Card className="border-[#EBE9DF] shadow-xs bg-white">
          <CardHeader className="border-b border-[#FAF9F5] pb-4">
            <CardTitle className="font-heading font-serif text-lg font-bold text-[#34351f] flex items-center gap-2">
              <Layers className="h-5 w-5 text-[#555829]" /> Asignación a Colecciones y Categoría
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Agrupa el producto en catálogos de temporada, colecciones especiales o líneas de producto
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-5">
            {/* Select Categoría Principal */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#34351f]">
                Categoría Principal <span className="text-red-500">*</span>
              </Label>
              <Select value={categoryId} onValueChange={setCategoryId} disabled={loadingCategories}>
                <SelectTrigger className="bg-white border-[#EBE9DF] focus:ring-[#555829]">
                  <SelectValue placeholder="Selecciona categoría principal" />
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

            {/* Checkboxes / Lista de Colecciones Disponibles */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-[#34351f]">
                  Colecciones Disponibles
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  {collectionIds.length} seleccionada(s)
                </span>
              </div>

              {loadingCollections ? (
                <p className="text-xs text-muted-foreground py-4">Cargando colecciones...</p>
              ) : collections.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4">No hay colecciones registradas.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {collections.map((c) => {
                    const isChecked = collectionIds.includes(c.id);
                    return (
                      <div
                        key={c.id}
                        onClick={() => toggleCollection(c.id)}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                          isChecked
                            ? "border-[#555829] bg-[#555829]/5"
                            : "border-[#EBE9DF] bg-white hover:bg-[#FAF9F5]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Checkbox checked={isChecked} onCheckedChange={() => toggleCollection(c.id)} />
                          <span
                            className="h-3 w-3 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: c.accentHex }}
                          />
                          <span className="text-xs font-medium text-[#34351f] truncate">{c.name}</span>
                        </div>
                        {isChecked && <Check className="h-4 w-4 text-[#555829] shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Marca */}
            <div className="space-y-1.5 pt-2 border-t border-[#FAF9F5]">
              <Label className="text-xs font-semibold text-[#34351f]">Marca de la línea</Label>
              <Input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Maro's Pijamas - Colección Exclusiva"
                className="bg-white border-[#EBE9DF] focus-visible:ring-[#555829]"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Columna Derecha (Live Preview & Consejos - 5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        {/* Card: Live Preview Colecciones */}
        <Card className="border-[#EBE9DF] shadow-xs bg-white overflow-hidden">
          <CardHeader className="border-b border-[#FAF9F5] pb-3 bg-[#FAF9F5]">
            <CardTitle className="font-heading font-serif text-sm font-bold text-[#34351f] flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#9FA367]" /> Colecciones Asignadas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {activeCollections.length > 0 ? (
              <div className="space-y-2">
                {activeCollections.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-lg border border-[#EBE9DF] bg-[#FAF9F5] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-black/10"
                        style={{ backgroundColor: c.accentHex }}
                      />
                      <span className="text-xs font-bold text-[#34351f]">{c.name}</span>
                    </div>
                    <Badge className="bg-[#555829] text-white text-[10px]">Activa</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-muted-foreground">
                No has seleccionado ninguna colección aún.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card: Consejos de Agrupación */}
        <Card className="border-[#EBE9DF] bg-[#FAF9F5] shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading font-serif text-sm font-bold text-[#34351f] flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-[#9FA367]" /> Consejos de Agrupación
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-2">
            <p>
              • Las <strong>Colecciones</strong> te permiten agrupar productos para lanzamientos por temporada (ej. Otoño - Invierno, Navidad, San Valentín).
            </p>
            <p>
              • Un mismo producto puede pertenecer a múltiples colecciones simultáneamente.
            </p>
            <p>
              • Utiliza las <strong>Etiquetas</strong> para filtrar rápidamente por características de la prenda (satín, encaje, pijama 2 piezas).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

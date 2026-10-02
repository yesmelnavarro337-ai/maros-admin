"use client";

import { useState } from "react";
import { X, Plus, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { ProductColor } from "../types";
import { getColorPreviewStyle } from "../utils/color-helper";

interface SizesColorsEditorProps {
  sizes: string[];
  colors: ProductColor[];
  onAddSize: (size: string) => void;
  onRemoveSize: (size: string) => void;
  onAddColor: (color: ProductColor) => void;
  onRemoveColor: (colorName: string) => void;
}

export function SizesColorsEditor({
  sizes,
  colors,
  onAddSize,
  onRemoveSize,
  onAddColor,
  onRemoveColor,
}: SizesColorsEditorProps) {
  // Estado para tallas
  const [newSize, setNewSize] = useState("");

  // Estado para color simple
  const [isCombined, setIsCombined] = useState(false);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#6B6832");

  // Estado para color combinado
  const [primaryName, setPrimaryName] = useState("");
  const [primaryHex, setPrimaryHex] = useState("#6B6832");
  const [secondaryName, setSecondaryName] = useState("");
  const [secondaryHex, setSecondaryHex] = useState("#FFFFFF");

  const combinedAutoName =
    primaryName.trim() && secondaryName.trim()
      ? `${primaryName.trim()} / ${secondaryName.trim()}`
      : primaryName.trim() || secondaryName.trim();

  const handleAddSingleColor = () => {
    if (!newColorName.trim()) return;
    onAddColor({
      name: newColorName.trim(),
      hex: newColorHex,
      primaryHex: newColorHex,
      secondaryHex: null,
      isCombined: false,
    });
    setNewColorName("");
  };

  const handleAddCombinedColor = () => {
    if (!primaryName.trim() || !secondaryName.trim()) return;
    const finalName = combinedAutoName;
    onAddColor({
      name: finalName,
      hex: primaryHex,
      primaryHex,
      secondaryHex,
      isCombined: true,
    });
    setPrimaryName("");
    setSecondaryName("");
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* SECCIÓN DE TALLAS */}
      <div className="border-b border-[#FAF9F5] pb-5">
        <p className="text-sm font-semibold text-[#34351f] mb-2">Tallas</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {sizes.length === 0 ? (
            <span className="text-xs text-muted-foreground italic">No hay tallas agregadas</span>
          ) : (
            sizes.map((size) => (
              <span
                key={size}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#FAF9F5] border border-[#EBE9DF] px-2.5 py-1 text-xs font-semibold text-[#34351f]"
              >
                {size}
                <button
                  type="button"
                  onClick={() => onRemoveSize(size)}
                  className="text-muted-foreground hover:text-rose-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          )}
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Ej. S, M, L, XL"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (newSize.trim()) {
                  onAddSize(newSize.trim().toUpperCase());
                  setNewSize("");
                }
              }
            }}
            className="w-32 h-8 text-xs bg-white border-[#EBE9DF]"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (newSize.trim()) {
                onAddSize(newSize.trim().toUpperCase());
                setNewSize("");
              }
            }}
            className="h-8 text-xs bg-[#FAF9F5] hover:bg-[#EBE9DF] text-[#34351f] border-[#EBE9DF]"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Agregar talla
          </Button>
        </div>
      </div>

      {/* SECCIÓN DE COLORES */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <p className="text-sm font-semibold text-[#34351f]">Colores disponibles</p>
          <div className="flex items-center gap-2 bg-[#FAF9F5] px-3 py-1.5 rounded-lg border border-[#EBE9DF]">
            <Switch
              id="is-combined-switch"
              checked={isCombined}
              onCheckedChange={setIsCombined}
              size="sm"
            />
            <Label
              htmlFor="is-combined-switch"
              className="text-xs font-medium text-[#34351f] cursor-pointer select-none"
            >
              ¿Es un color combinado?
            </Label>
          </div>
        </div>

        {/* LISTADO DE COLORES REGISTRADOS */}
        <div className="flex flex-wrap gap-2 mb-4">
          {colors.length === 0 ? (
            <span className="text-xs text-muted-foreground italic">No hay colores agregados</span>
          ) : (
            colors.map((color) => (
              <span
                key={color.name}
                className="inline-flex items-center gap-2 rounded-lg bg-[#FAF9F5] border border-[#EBE9DF] px-2.5 py-1.5 text-xs text-[#34351f]"
              >
                <span
                  className="h-3.5 w-3.5 rounded-full border border-black/10 shrink-0 shadow-2xs"
                  style={getColorPreviewStyle(color)}
                />
                <span className="font-medium">{color.name}</span>
                {color.isCombined && (
                  <span className="text-[10px] bg-white border border-[#EBE9DF] text-[#555829] px-1 py-0.2 rounded">
                    Combinado
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onRemoveColor(color.name)}
                  className="text-muted-foreground hover:text-rose-600 transition-colors ml-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          )}
        </div>

        {/* FORMULARIO CREADOR DE COLOR: SIMPLE O COMBINADO */}
        {!isCombined ? (
          /* MODO COLOR INDIVIDUAL */
          <div className="p-3.5 rounded-xl border border-[#EBE9DF] bg-white space-y-3">
            <p className="text-xs font-medium text-muted-foreground">Agregar color único / sólido</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 shrink-0">
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="h-8 w-8 rounded-md border border-[#EBE9DF] cursor-pointer p-0.5 bg-white"
                  title="Seleccionar color"
                />
                {/* PREVIEW BADGE */}
                <span
                  className="h-7 w-7 rounded-full border border-black/10 shadow-2xs shrink-0"
                  style={getColorPreviewStyle({ primaryHex: newColorHex, isCombined: false })}
                  title={`Vista previa: ${newColorHex}`}
                />
              </div>

              <Input
                placeholder="Nombre del color (ej: Verde Oliva)"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSingleColor();
                  }
                }}
                className="flex-1 h-8 text-xs bg-white border-[#EBE9DF]"
              />

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSingleColor}
                disabled={!newColorName.trim()}
                className="h-8 text-xs bg-[#555829] hover:bg-[#444620] text-white border-0"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Agregar
              </Button>
            </div>
          </div>
        ) : (
          /* MODO COLOR COMBINADO */
          <div className="p-3.5 rounded-xl border border-[#EBE9DF] bg-[#FAF9F5] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#555829]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Configurar color combinado (Base + Detalle/Vivo)</span>
              </div>
              {/* PREVIEW BADGE DIAGONAL 50/50 */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground font-medium">Vista previa:</span>
                <span
                  className="h-6 w-6 rounded-full border border-black/15 shadow-2xs shrink-0"
                  style={getColorPreviewStyle({
                    primaryHex,
                    secondaryHex,
                    isCombined: true,
                  })}
                  title={`Combinado: ${primaryHex} / ${secondaryHex}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Color Principal / Base */}
              <div className="space-y-1.5 bg-white p-2.5 rounded-lg border border-[#EBE9DF]">
                <Label className="text-[11px] font-medium text-[#34351f]">
                  Color Principal (Base)
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryHex}
                    onChange={(e) => setPrimaryHex(e.target.value)}
                    className="h-7 w-7 rounded-md border border-[#EBE9DF] cursor-pointer p-0.5 shrink-0 bg-white"
                    title="Color base"
                  />
                  <Input
                    placeholder="Ej: Rojo Pasión"
                    value={primaryName}
                    onChange={(e) => setPrimaryName(e.target.value)}
                    className="h-7 text-xs bg-white border-[#EBE9DF]"
                  />
                </div>
              </div>

              {/* Color Secundario / Detalle */}
              <div className="space-y-1.5 bg-white p-2.5 rounded-lg border border-[#EBE9DF]">
                <Label className="text-[11px] font-medium text-[#34351f]">
                  Color Secundario (Detalle / Vivo)
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryHex}
                    onChange={(e) => setSecondaryHex(e.target.value)}
                    className="h-7 w-7 rounded-md border border-[#EBE9DF] cursor-pointer p-0.5 shrink-0 bg-white"
                    title="Color de detalles"
                  />
                  <Input
                    placeholder="Ej: Blanco Nieve"
                    value={secondaryName}
                    onChange={(e) => setSecondaryName(e.target.value)}
                    className="h-7 text-xs bg-white border-[#EBE9DF]"
                  />
                </div>
              </div>
            </div>

            {/* Nombre autogenerado y botón agregar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
              <div className="text-xs text-muted-foreground truncate">
                Nombre combinado generado:{" "}
                <span className="font-semibold text-[#34351f]">
                  {combinedAutoName || "(Ingresa el nombre del color base y detalle)"}
                </span>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCombinedColor}
                disabled={!primaryName.trim() || !secondaryName.trim()}
                className="h-8 text-xs bg-[#555829] hover:bg-[#444620] text-white border-0 shrink-0"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Agregar color combinado
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { X, Plus, Sparkles, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductColor } from "../types";
import { getColorPreviewStyle } from "../utils/color-helper";
import { FIXED_STYLES, INFANTIL_STYLES, type SizeLineMode } from "../utils/price-calculator";
import { ADULT_SIZES, INFANT_SIZES } from "../utils/size-helpers";

interface SizesColorsEditorProps {
  sizes: string[];
  colors: ProductColor[];
  styles?: string[];
  materials?: string[];
  /**
   * Línea del producto según las categorías seleccionadas:
   * - "infantil": sólo estilos/tallas infantiles
   * - "adulto": sólo estilos/tallas de adulto
   * - "mixed": ambas líneas desbloqueadas
   */
  sizeLineMode?: SizeLineMode;
  /** Catálogo de tallas permitido según el estilo seleccionado. */
  availableSizes?: readonly string[];
  onAddSize: (size: string) => void;
  onRemoveSize: (size: string) => void;
  onAddColor: (color: ProductColor) => void;
  onRemoveColor: (colorName: string) => void;
  onAddStyle?: (style: string) => void;
  onRemoveStyle?: (style: string) => void;
  onAddMaterial?: (material: string) => void;
  onRemoveMaterial?: (material: string) => void;
}

export function SizesColorsEditor({
  sizes,
  colors,
  styles = [],
  materials = [],
  sizeLineMode = "adulto",
  availableSizes,
  onAddSize,
  onRemoveSize,
  onAddColor,
  onRemoveColor,
  onAddStyle,
  onRemoveStyle,
  onAddMaterial,
  onRemoveMaterial,
}: SizesColorsEditorProps) {
  // Estado para tallas
  const [newSize, setNewSize] = useState("");

  // Estado para estilo y material
  const [selectedStyle, setSelectedStyle] = useState("");
  const [newMaterial, setNewMaterial] = useState("");

  // Estado para color simple
  const [isCombined, setIsCombined] = useState(false);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#6B6832");

  // Estado para color combinado
  const [primaryName, setPrimaryName] = useState("");
  const [primaryHex, setPrimaryHex] = useState("#6B6832");
  const [secondaryName, setSecondaryName] = useState("");
  const [secondaryHex, setSecondaryHex] = useState("#FFFFFF");

  // El selector ofrece los estilos de la línea del producto: en modo "mixed"
  // (categorías de adulto e infantil a la vez) se desbloquean ambos catálogos.
  const availableStyles =
    sizeLineMode === "infantil"
      ? INFANTIL_STYLES
      : sizeLineMode === "mixed"
        ? [...FIXED_STYLES, ...INFANTIL_STYLES]
        : FIXED_STYLES;
  const lineLabel =
    sizeLineMode === "mixed" ? "adulto + infantil" : sizeLineMode;

  // Catálogo de tallas de la línea del producto. Si el estilo aún no está
  // elegido se ofrece el de la línea por defecto de la categoría.
  const sizeCatalog =
    availableSizes ??
    (sizeLineMode === "infantil"
      ? undefined
      : sizeLineMode === "mixed"
        ? [...ADULT_SIZES, ...INFANT_SIZES]
        : ADULT_SIZES);
  const sizeCatalogHint =
    sizeCatalog == null
      ? "Selecciona un estilo para ver el rango de tallas"
      : `Rango de tallas ${lineLabel}`;

  // Tallas ya agregadas que quedaron fuera del catálogo de la línea actual
  // (sólo posible con datos heredados): se señalan para que el usuario las revise.
  const outOfCatalogSizes =
    sizeCatalog == null
      ? []
      : sizes.filter(
          (s) =>
            !sizeCatalog.some(
              (allowed) => allowed.toUpperCase().replace(/\s+/g, "") === s.toUpperCase().replace(/\s+/g, "")
            )
        );

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
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-sm font-semibold text-[#34351f]">Tallas</p>
          <p className="text-[11px] text-muted-foreground italic">{sizeCatalogHint}</p>
        </div>

        {/* Catálogo de tallas de la línea del estilo seleccionado */}
        {sizeCatalog != null ? (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {sizeCatalog.map((size) => {
              const isSelected = sizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  onClick={() =>
                    isSelected ? onRemoveSize(size) : onAddSize(size)
                  }
                  className={`min-w-11 px-2.5 py-1.5 rounded-md border text-xs font-semibold transition-colors ${
                    isSelected
                      ? "bg-[#555829] text-white border-[#555829]"
                      : "bg-white text-[#34351f] border-[#EBE9DF] hover:border-[#555829]"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        ) : null}

        {/* Tallas ya agregadas */}
        <div className="flex flex-wrap gap-2 mb-3">
          {sizes.length === 0 ? (
            <span className="text-xs text-muted-foreground italic">No hay tallas agregadas</span>
          ) : (
            sizes.map((size) => {
              const isOutOfCatalog = outOfCatalogSizes.includes(size);
              return (
                <span
                  key={size}
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold ${
                    isOutOfCatalog
                      ? "bg-amber-50 text-amber-900 border-amber-200"
                      : "bg-[#FAF9F5] text-[#34351f] border-[#EBE9DF]"
                  }`}
                  title={
                    isOutOfCatalog
                      ? "Talla fuera del rango del estilo seleccionado"
                      : undefined
                  }
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
              );
            })
          )}
        </div>

        {outOfCatalogSizes.length > 0 && (
          <p className="text-[11px] text-amber-800 mb-3">
            Las tallas resaltadas están fuera del rango del estilo seleccionado y no
            deberían generar combinaciones.
          </p>
        )}

        <div className="flex items-center gap-2">
          <Input
            placeholder={
              sizeLineMode === "infantil"
                ? "Ej. 0-3M, 2T, 8, 16"
                : sizeLineMode === "mixed"
                  ? "Ej. S, M, L, XL, 2T, 8"
                  : "Ej. S, M, L, XL"
            }
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
            className="w-40 h-8 text-xs bg-white border-[#EBE9DF]"
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

      {/* SECCIÓN DE ESTILOS FIJOS (LISTA CERRADA) */}
      <div className="border-b border-[#FAF9F5] pb-5">
        <div className="flex items-center gap-1.5 mb-1">
          <Lock className="h-3.5 w-3.5 text-[#555829]" />
          <p className="text-sm font-semibold text-[#34351f]">Estilos Fijos Predefinidos</p>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Selecciona únicamente uno o varios de los 9 modelos oficiales de Maro's Pijamas con precios fijos inmutables.
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {styles.length === 0 ? (
            <span className="text-xs text-muted-foreground italic">No hay estilos seleccionados de la lista fija</span>
          ) : (
            styles.map((style) => (
              <span
                key={style}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#555829]/10 border border-[#555829]/30 px-2.5 py-1 text-xs font-semibold text-[#555829]"
              >
                {style}
                {onRemoveStyle && (
                  <button
                    type="button"
                    onClick={() => onRemoveStyle(style)}
                    className="text-muted-foreground hover:text-rose-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </span>
            ))
          )}
        </div>

        {onAddStyle && (
          <div className="flex items-center gap-2">
            <Select
              value={selectedStyle}
              onValueChange={(val) => {
                if (val && onAddStyle) {
                  onAddStyle(val);
                  setSelectedStyle("");
                }
              }}
            >
              <SelectTrigger className="w-[340px] h-8 text-xs bg-white border-[#EBE9DF] focus:ring-[#555829]">
                <SelectValue placeholder="Seleccionar estilo predefinido..." />
              </SelectTrigger>
              <SelectContent>
                {availableStyles.map((st) => {
                  const isAdded = styles.includes(st.name);
                  return (
                    <SelectItem key={st.name} value={st.name} disabled={isAdded}>
                      <div className="flex items-center justify-between w-full gap-4 text-xs">
                        <span className={isAdded ? "text-muted-foreground line-through" : "font-medium"}>
                          {st.name}
                        </span>
                        <span className="font-bold text-[#555829] shrink-0">
                          ${st.price.toLocaleString("es-CO")} COP
                        </span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground italic shrink-0">
              Estilos de línea {lineLabel}
            </p>
          </div>
        )}
      </div>

      {/* SECCIÓN DE MATERIALES / TELAS */}
      <div className="border-b border-[#FAF9F5] pb-5">
        <p className="text-sm font-semibold text-[#34351f] mb-2">Materiales / Telas</p>
        <p className="text-xs text-muted-foreground mb-2">Ej. Seda Licrada Peach, Algodón Pima, Satín Strech</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {materials.length === 0 ? (
            <span className="text-xs text-muted-foreground italic">No hay materiales específicos (se usará tela base)</span>
          ) : (
            materials.map((mat) => (
              <span
                key={mat}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#FAF9F5] border border-[#EBE9DF] px-2.5 py-1 text-xs font-semibold text-[#8B7D4E]"
              >
                {mat}
                {onRemoveMaterial && (
                  <button
                    type="button"
                    onClick={() => onRemoveMaterial(mat)}
                    className="text-muted-foreground hover:text-rose-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </span>
            ))
          )}
        </div>
        {onAddMaterial && (
          <div className="flex items-center gap-2">
            <Input
              placeholder="Ej. Algodón Peach"
              value={newMaterial}
              onChange={(e) => setNewMaterial(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (newMaterial.trim()) {
                    onAddMaterial(newMaterial.trim());
                    setNewMaterial("");
                  }
                }
              }}
              className="w-56 h-8 text-xs bg-white border-[#EBE9DF]"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (newMaterial.trim()) {
                  onAddMaterial(newMaterial.trim());
                  setNewMaterial("");
                }
              }}
              className="h-8 text-xs bg-[#FAF9F5] hover:bg-[#EBE9DF] text-[#34351f] border-[#EBE9DF]"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Agregar material
            </Button>
          </div>
        )}
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
"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, ExternalLink, Sparkles, Shirt, Palette, Scissors, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CatalogItem, CustomizationCatalogs } from "../services/customization.service";

interface CustomizationPreviewSidebarProps {
  catalogs?: CustomizationCatalogs | null;
}

export function CustomizationPreviewSidebar({ catalogs }: CustomizationPreviewSidebarProps) {
  const models = catalogs?.modelos || [];
  const colors = catalogs?.colores || [
    { id: "1", catalog: "colores", name: "Rosa Pastel", hex: "#F8D7DA" },
    { id: "2", catalog: "colores", name: "Verde Oliva", hex: "#6B8E23" },
    { id: "3", catalog: "colores", name: "Negro Corporativo", hex: "#1A1A1A" },
  ];
  const fabrics = catalogs?.telas || [
    { id: "f1", catalog: "telas", name: "Satin Silk", image: undefined },
    { id: "f2", catalog: "telas", name: "Algodón Suave", image: undefined },
  ];

  const [selectedModel, setSelectedModel] = useState<CatalogItem | undefined>(models[0]);
  const [selectedColor, setSelectedColor] = useState<CatalogItem | undefined>(colors[0]);
  const [selectedFabric, setSelectedFabric] = useState<CatalogItem | undefined>(fabrics[0]);
  const [embroideryText, setEmbroideryText] = useState("J.M.");

  const modelImg = selectedModel?.image || models[0]?.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop";

  return (
    <div className="bg-card border border-border/60 rounded-xl p-5 shadow-2xs space-y-5 sticky top-6">
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#555A2B]" />
          <h2 className="font-serif text-base font-bold text-[#1C1917]">
            Vista previa del personalizador
          </h2>
        </div>

        <Button
          asChild
          size="sm"
          variant="outline"
          className="h-7 text-[11px] border-[#E6DBB8] text-[#555A2B] bg-[#FAF5E6]/60 hover:bg-[#FAF5E6]"
        >
          <Link href="/personaliza" target="_blank">
            <Eye className="h-3 w-3 mr-1" />
            Ver personalizador
            <ExternalLink className="h-3 w-3 ml-1" />
          </Link>
        </Button>
      </div>

      {/* Model Mockup Preview */}
      <div className="space-y-3">
        <div className="aspect-[3/4] w-full rounded-lg overflow-hidden border border-border/60 bg-[#FAF9F5] relative flex items-center justify-center group shadow-2xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={modelImg}
            alt={selectedModel?.name || "Modelo Pijama"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Color Overlay Filter */}
          {selectedColor?.hex && (
            <div
              className="absolute inset-0 mix-blend-color opacity-25 pointer-events-none transition-colors duration-300"
              style={{ backgroundColor: selectedColor.hex }}
            />
          )}

          {/* Floating Embroidery initials preview */}
          {embroideryText && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs border border-border/60 px-2.5 py-1 rounded-md shadow-xs text-xs font-serif font-bold text-[#1C1917]">
              Bordado: <span className="text-[#555A2B]">{embroideryText}</span>
            </div>
          )}

          {/* Model Name pill */}
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-full font-medium">
            {selectedModel?.name || models[0]?.name || "Pijama Satén Seda"}
          </div>
        </div>
      </div>

      {/* Interactive Swatches Section */}
      <div className="space-y-4 pt-1">
        {/* Color Swatches */}
        <div>
          <label className="text-[11px] uppercase font-semibold text-muted-foreground flex items-center gap-1.5 mb-2">
            <Palette className="h-3.5 w-3.5 text-[#555A2B]" />
            Color seleccionado ({selectedColor?.name || "Verde Oliva"})
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {colors.slice(0, 6).map((col) => {
              const isSel = selectedColor?.id === col.id || (!selectedColor && col.hex === "#6B8E23");
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setSelectedColor(col)}
                  className={`h-7 w-7 rounded-full border-2 transition-all shadow-2xs flex items-center justify-center ${
                    isSel ? "border-[#555A2B] ring-2 ring-[#555A2B]/20 scale-110" : "border-white"
                  }`}
                  style={{ backgroundColor: col.hex || "#6B8E23" }}
                  title={col.name}
                />
              );
            })}
          </div>
        </div>

        {/* Fabric Swatches */}
        <div>
          <label className="text-[11px] uppercase font-semibold text-muted-foreground flex items-center gap-1.5 mb-2">
            <Scissors className="h-3.5 w-3.5 text-[#555A2B]" />
            Tela ({selectedFabric?.name || "Satin Silk"})
          </label>
          <div className="flex items-center gap-1.5 flex-wrap">
            {fabrics.slice(0, 4).map((f) => {
              const isSel = selectedFabric?.id === f.id || (!selectedFabric && f.name.includes("Satin"));
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFabric(f)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                    isSel
                      ? "bg-[#555A2B] text-white border-[#555A2B]"
                      : "bg-[#FAF9F5] text-foreground border-border/60 hover:bg-secondary"
                  }`}
                >
                  {f.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Embroidery text input preview */}
        <div>
          <label className="text-[11px] uppercase font-semibold text-muted-foreground flex items-center gap-1.5 mb-1.5">
            <Layers className="h-3.5 w-3.5 text-[#555A2B]" />
            Muestra de bordado
          </label>
          <input
            type="text"
            maxLength={6}
            value={embroideryText}
            onChange={(e) => setEmbroideryText(e.target.value)}
            placeholder="Ej. J.M."
            className="w-full text-xs px-2.5 py-1.5 rounded-md border border-border/60 bg-[#FAF9F5]/60 font-mono"
          />
        </div>
      </div>
    </div>
  );
}

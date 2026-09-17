"use client";

import Link from "next/link";
import { ImageOff, Pencil, Trash2, Shirt, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CatalogItem, CatalogConfig } from "../types";

interface CatalogItemCardProps {
  item: CatalogItem;
  config: CatalogConfig;
  onEdit: () => void;
  onDelete: () => void;
}

export function CatalogItemCard({ item, config, onEdit, onDelete }: CatalogItemCardProps) {
  const isModel = config.key === "modelos";
  const isColor = config.key === "colores";
  const isTalla = config.key === "tallas";

  const formatPrice = (val?: number) => {
    if (!val) return "Sin recargo";
    return `+$${val.toLocaleString("es-CO")}`;
  };

  return (
    <Card className="overflow-hidden bg-card border border-border/60 rounded-xl shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group relative">
      {/* Top Visual Area */}
      {isColor ? (
        <div className="p-4 bg-[#FAF9F5] border-b border-border/40 flex items-center justify-center gap-3">
          <div
            className="h-14 w-14 rounded-full border-4 border-white shadow-xs transition-transform group-hover:scale-110 flex items-center justify-center"
            style={{ backgroundColor: item.hex || "#6B8E23" }}
          />
        </div>
      ) : isTalla ? (
        <div className="p-6 bg-[#FAF9F5] border-b border-border/40 flex items-center justify-center">
          <span className="font-serif text-3xl font-bold text-[#555A2B] bg-[#FAF5E6] border border-[#E6DBB8] px-4 py-2 rounded-xl shadow-2xs">
            {item.name}
          </span>
        </div>
      ) : (
        <div className="aspect-[4/3] w-full bg-[#FAF9F5] relative flex items-center justify-center overflow-hidden border-b border-border/40">
          {item.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground p-4">
              {isModel ? (
                <Shirt className="h-8 w-8 text-[#555A2B] opacity-50 mb-1" />
              ) : (
                <ImageOff className="h-8 w-8 text-[#555A2B] opacity-50 mb-1" />
              )}
              <span className="text-[11px] opacity-60">Sin imagen</span>
            </div>
          )}

          {/* Model Status Badge */}
          {isModel && (
            <span className="absolute top-2 left-2 bg-[#E8F5E9] text-[#166534] text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
              Activo
            </span>
          )}

          {/* Quick Edit/Delete overlay */}
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 p-1 rounded-md backdrop-blur-xs">
            {isModel ? (
              <Button asChild size="icon" variant="ghost" className="h-7 w-7 text-white hover:bg-white/20">
                <Link href={`/admin/personalizacion/modelos/${item.id}`}>
                  <Pencil className="h-3.5 w-3.5" />
                </Link>
              </Button>
            ) : (
              <Button size="icon" variant="ghost" className="h-7 w-7 text-white hover:bg-white/20" onClick={onEdit}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}

            <Button size="icon" variant="ghost" className="h-7 w-7 text-red-300 hover:bg-red-500/30" onClick={onDelete}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Card Content & Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1">
            <h4 className="font-medium text-sm text-foreground truncate group-hover:text-[#555A2B] transition-colors">
              {item.name}
            </h4>
            {isModel && (
              <Link href={`/admin/personalizacion/modelos/${item.id}`} className="text-[#555A2B] hover:text-[#3E451E]">
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {/* Color Hex code */}
          {isColor && item.hex && (
            <p className="text-xs font-mono text-muted-foreground mt-0.5 uppercase">
              {item.hex}
            </p>
          )}

          {/* Price Modifier */}
          {config.hasPriceModifier && (
            <p className="text-xs text-[#555A2B] font-medium mt-1">
              {formatPrice(item.priceModifier)}
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 mt-2 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
          {isModel ? (
            <Link
              href={`/admin/personalizacion/modelos/${item.id}`}
              className="text-xs text-[#555A2B] font-medium hover:underline"
            >
              Editar modelo & opciones →
            </Link>
          ) : (
            <div className="flex items-center justify-end w-full gap-2">
              <button
                type="button"
                onClick={onEdit}
                className="text-[11px] font-medium text-[#555A2B] hover:underline"
              >
                Editar
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={onDelete}
                className="text-[11px] font-medium text-red-600 hover:underline"
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
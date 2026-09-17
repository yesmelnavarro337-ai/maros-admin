"use client";

import Link from "next/link";
import { ImageOff, Eye, Pencil, Trash2, MoreHorizontal, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductStatusBadge } from "./product-status-badge";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onQuickView: () => void;
  onDelete: () => void;
}

export function ProductCard({
  product,
  isSelected = false,
  onToggleSelect,
  onQuickView,
  onDelete,
}: ProductCardProps) {
  const stock = product.totalStock ?? product.variants.reduce((sum, v) => sum + v.stock, 0);
  const imageUrl = product.imageUrl || product.images[0];

  const getStockColor = (count: number) => {
    if (count === 0) return "text-rose-600 bg-rose-50 border-rose-100";
    if (count <= 3) return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-emerald-700 bg-emerald-50 border-emerald-100";
  };

  return (
    <Card className={`overflow-hidden border border-border/80 shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between ${isSelected ? "ring-2 ring-[#5C5232] bg-[#FAF8F5]" : "bg-card"}`}>
      <div>
        {/* Top Image Container */}
        <div className="aspect-[4/3] bg-muted/40 relative flex items-center justify-center overflow-hidden cursor-pointer" onClick={onQuickView}>
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <ImageOff className="h-8 w-8 text-muted-foreground/60" />
          )}

          {/* Top Left Checkbox */}
          <div
            className="absolute top-2.5 left-2.5 z-10"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect?.();
            }}
          >
            <div className="bg-white/90 backdrop-blur-xs p-1 rounded-md shadow-2xs flex items-center justify-center border border-border/50">
              <Checkbox checked={isSelected} onCheckedChange={() => onToggleSelect?.()} />
            </div>
          </div>

          {/* Top Right Status Badge Overlay */}
          <div className="absolute top-2.5 right-2.5 z-10" onClick={(e) => e.stopPropagation()}>
            <ProductStatusBadge status={product.displayStatus || product.status} />
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3.5 space-y-2">
          <div>
            <h3 className="font-heading font-semibold text-sm text-foreground truncate leading-snug" title={product.name}>
              {product.name}
            </h3>
            <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
              SKU: {product.sku}
            </p>
          </div>

          {/* Category Chip */}
          <div>
            <span className="inline-block bg-[#F4EFE6] text-[#6E613B] text-[10px] font-medium px-2 py-0.5 rounded-md border border-[#E8DFC9]">
              {product.categoryName}
            </span>
          </div>

          {/* Price & Stock Row */}
          <div className="flex items-center justify-between pt-1">
            <span className="font-heading font-semibold text-base text-foreground">
              $ {product.basePrice.toLocaleString("es-CO")}
            </span>
            <div className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md border ${getStockColor(stock)}`}>
              <Package className="h-3 w-3" />
              <span>{stock} en stock</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="px-3.5 py-2 border-t border-border/50 flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={onQuickView}
            title="Ver detalle"
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button
            asChild
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            title="Editar"
          >
            <Link href={`/admin/productos/${product.id}`}>
              <Pencil className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-muted-foreground hover:text-rose-600"
            onClick={onDelete}
            title="Eliminar"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onQuickView}>
              <Eye className="h-3.5 w-3.5 mr-2" />
              Ver detalle
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/productos/${product.id}`}>
                <Pencil className="h-3.5 w-3.5 mr-2" />
                Editar producto
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-rose-600">
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Eliminar producto
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
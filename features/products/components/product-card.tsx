"use client";

import Link from "next/link";
import { ImageOff, Eye, Pencil, Trash2, MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  onQuickView: () => void;
  onDelete: () => void;
}

export function ProductCard({ product, onQuickView, onDelete }: ProductCardProps) {
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full group relative">
      <div className="aspect-square bg-secondary flex items-center justify-center relative cursor-pointer" onClick={onQuickView}>
        {product.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <ImageOff className="h-8 w-8 text-muted-foreground" />
        )}

        <div className="hidden sm:flex absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-2">
          <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); onQuickView(); }}>
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            Ver
          </Button>
          <Button asChild size="sm" variant="secondary" onClick={(e) => e.stopPropagation()}>
            <Link href={`/admin/productos/${product.id}`}>
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Editar
            </Link>
          </Button>
          <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="sm:hidden absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="secondary" className="h-7 w-7">
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onQuickView}>
                <Eye className="h-3.5 w-3.5 mr-2" />
                Ver
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/productos/${product.id}`}>
                  <Pencil className="h-3.5 w-3.5 mr-2" />
                  Editar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete}>
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.categoryId}</p>
          </div>
          <ProductStatusBadge status={product.status} />
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="font-heading text-lg text-foreground">
            ${product.basePrice.toLocaleString("es-CO")}
          </span>
          <span className="text-xs text-muted-foreground">{totalStock} en stock</span>
        </div>
      </CardContent>
    </Card>
  );
}
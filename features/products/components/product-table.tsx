"use client";

import Link from "next/link";
import { ImageOff, Eye, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

interface ProductTableProps {
  products: Product[];
  selectedIds?: string[];
  onToggleSelectAll?: () => void;
  onToggleSelect?: (id: string) => void;
  onQuickView: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({
  products,
  selectedIds = [],
  onToggleSelectAll,
  onToggleSelect,
  onQuickView,
  onDelete,
}: ProductTableProps) {
  const selectedSet = new Set(selectedIds);
  const allSelected = products.length > 0 && products.every((p) => selectedSet.has(p.id));

  return (
    <div className="border border-border/70 rounded-xl overflow-hidden shadow-2xs bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-border/70 bg-muted/30">
            <TableHead className="w-[40px] text-center">
              <Checkbox checked={allSelected} onCheckedChange={() => onToggleSelectAll?.()} />
            </TableHead>
            <TableHead className="w-[70px] text-xs font-semibold text-muted-foreground">Imagen</TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">Producto</TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">SKU</TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">Categoría</TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">Precio</TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">Stock</TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">Estado</TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">Temporada</TableHead>
            <TableHead className="text-right text-xs font-semibold text-muted-foreground">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const isSelected = selectedSet.has(product.id);
            const stock = product.totalStock ?? product.variants.reduce((sum, v) => sum + v.stock, 0);
            const imageUrl = product.imageUrl || product.images[0];

            return (
              <TableRow key={product.id} className={`hover:bg-muted/30 border-b border-border/40 ${isSelected ? "bg-[#FAF8F5]" : ""}`}>
                <TableCell className="text-center">
                  <Checkbox checked={isSelected} onCheckedChange={() => onToggleSelect?.(product.id)} />
                </TableCell>
                <TableCell>
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-border/50 shrink-0">
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <button onClick={() => onQuickView(product)} className="text-left group">
                    <p className="font-heading text-xs font-semibold text-foreground group-hover:text-[#5C5232] transition-colors leading-tight">
                      {product.name}
                    </p>
                    <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                      SKU: {product.sku}
                    </p>
                  </button>
                </TableCell>
                <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                  {product.sku}
                </TableCell>
                <TableCell>
                  <span className="inline-block bg-[#F4EFE6] text-[#6E613B] text-[10px] font-medium px-2 py-0.5 rounded-md border border-[#E8DFC9]">
                    {product.categoryName}
                  </span>
                </TableCell>
                <TableCell className="font-heading font-semibold text-xs text-foreground">
                  $ {product.basePrice.toLocaleString("es-CO")}
                </TableCell>
                <TableCell className="font-mono text-xs font-semibold text-foreground">
                  {stock}
                </TableCell>
                <TableCell>
                  <ProductStatusBadge status={product.displayStatus || product.status} />
                </TableCell>
                <TableCell>
                  <span className="inline-block bg-muted/60 text-muted-foreground text-[10px] font-medium px-2 py-0.5 rounded-md">
                    {product.seasonName || "Otoño - Invierno"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => onQuickView(product)}
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onQuickView(product)}>
                          <Eye className="h-3.5 w-3.5 mr-2" />
                          Ver detalle
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/productos/${product.id}`}>
                            <Pencil className="h-3.5 w-3.5 mr-2" />
                            Editar producto
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(product)} className="text-rose-600">
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Eliminar producto
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
import Link from "next/link";
import { ImageOff, Eye, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ProductStatusBadge } from "./product-status-badge";
import type { Product } from "../types";

interface ProductTableProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({ products, onQuickView, onDelete }: ProductTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Producto</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead>Precio</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => {
          const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
          return (
            <TableRow key={product.id}>
              <TableCell>
                <button onClick={() => onQuickView(product)} className="flex items-center gap-3 text-left">
                  <div className="h-9 w-9 rounded-md bg-secondary flex items-center justify-center shrink-0">
                    {product.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.images[0]} alt="" className="w-full h-full object-cover rounded-md" />
                    ) : (
                      <ImageOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <span className="font-medium text-foreground">{product.name}</span>
                </button>
              </TableCell>
              <TableCell className="text-muted-foreground">{product.categoryName}</TableCell>
              <TableCell>${product.basePrice.toLocaleString("es-CO")}</TableCell>
              <TableCell className="text-muted-foreground">{totalStock}</TableCell>
              <TableCell>
                <ProductStatusBadge status={product.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onQuickView(product)} title="Vista rápida">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button asChild size="icon" variant="ghost" className="h-8 w-8" title="Editar">
                    <Link href={`/admin/productos/${product.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 hover:text-destructive"
                    onClick={() => onDelete(product)}
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
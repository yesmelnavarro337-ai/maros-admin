import { AlertTriangle, ImageOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LowStockProduct } from "../types";

export function LowStockProductsCard({ products }: { products: LowStockProduct[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Productos con menor stock</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {products.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay productos activos todavía.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
              <div className="h-9 w-9 rounded-md bg-secondary flex items-center justify-center shrink-0">
                {product.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.thumbnailUrl} alt={product.name} className="w-full h-full object-cover rounded-md" />
                ) : (
                  <ImageOff className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <p className="text-sm text-foreground truncate flex-1">{product.name}</p>
              <span
                className={`flex items-center gap-1 text-xs shrink-0 ${
                  product.totalStock <= 3 ? "text-destructive" : "text-muted-foreground"
                }`}
              >
                {product.totalStock <= 3 && <AlertTriangle className="h-3.5 w-3.5" />}
                {product.totalStock} en stock
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
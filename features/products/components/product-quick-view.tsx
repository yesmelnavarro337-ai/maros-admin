"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ProductStatusBadge } from "./product-status-badge";
import { getCollections } from "@/features/collections/services/collections.service";
import type { Product } from "../types";

interface ProductQuickViewProps {
  product: Product | null;
  onOpenChange: (open: boolean) => void;
}

export function ProductQuickView({ product, onOpenChange }: ProductQuickViewProps) {
  const [collectionNames, setCollectionNames] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      getCollections().then((all) => {
        setCollectionNames(
          all.filter((c) => product.collectionIds?.includes(c.id)).map((c) => c.name)
        );
      });
    }
  }, [product]);

  if (!product) return null;

  return (
    <Sheet open={!!product} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-heading">Vista rápida</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4 pb-4">
          <div className="aspect-square rounded-lg bg-secondary flex items-center justify-center overflow-hidden">
            {product.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <ImageOff className="h-8 w-8 text-muted-foreground" />
            )}
          </div>

          <div>
            <p className="font-heading text-xl text-foreground">{product.name}</p>
            <p className="font-heading text-lg text-primary mt-1">
              ${product.basePrice.toLocaleString("es-CO")}
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Categoría</span>
              <span className="text-foreground">{product.categoryId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Colecciones</span>
              <span className="text-foreground text-right">
                {collectionNames.length > 0 ? collectionNames.join(", ") : "Sin asignar"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Estado</span>
              <ProductStatusBadge status={product.status} />
            </div>
          </div>

          <Button asChild className="mt-2">
            <Link href={`/admin/productos/${product.id}`}>Editar producto completo</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
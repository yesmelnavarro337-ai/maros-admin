"use client";

import { useEffect, useState } from "react";
import { Eye, ImageOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/features/products/services/products.service";
import type { Product } from "@/features/products/types";
import type { Season } from "../types";

export function SeasonPreviewModal({ season }: { season: Season }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      getProducts().then((all) =>
        setProducts(all.filter((p) => season.featuredProductIds.includes(p.id)))
      );
    }
  }, [open, season.featuredProductIds]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
<DialogTrigger asChild>
  <Button variant="ghost" className="text-muted-foreground">
    <Eye className="h-4 w-4 mr-1.5" />
    Vista previa
  </Button>
</DialogTrigger>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>Vista previa — {season.name}</DialogTitle>
        </DialogHeader>

        <div style={{ backgroundColor: season.colors.background }} className="max-h-[70vh] overflow-y-auto">
          {/* Hero */}
          <div
            className="relative aspect-[21/9] flex flex-col items-center justify-center text-center px-6"
            style={{ backgroundColor: season.colors.primary }}
          >
            {season.heroImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={season.heroImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-40"
              />
            )}
            <div className="relative z-10">
              <h2 className="font-heading text-2xl sm:text-3xl text-white">{season.heroTitle}</h2>
              <p className="text-sm text-white/85 mt-2">{season.heroSubtitle}</p>
              <button
                className="mt-4 rounded-md px-4 py-2 text-sm font-medium"
                style={{ backgroundColor: season.colors.accent, color: season.colors.primary }}
              >
                {season.ctaText}
              </button>
            </div>
          </div>

          {/* Banner */}
          {season.bannerImage && (
            <div className="aspect-[4/1]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={season.bannerImage} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Productos destacados */}
          <div className="p-6">
            <p
              className="text-xs uppercase tracking-wide mb-3"
              style={{ color: season.colors.primary }}
            >
              Productos destacados
            </p>
            {products.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Sin productos destacados asignados todavía.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {products.map((p) => (
                  <div key={p.id} className="rounded-md overflow-hidden bg-white border border-border">
                    <div className="aspect-square bg-secondary flex items-center justify-center">
                      {p.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageOff className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-xs p-2 truncate">{p.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
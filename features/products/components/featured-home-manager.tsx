"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronLeft,
  Home,
  ImageOff,
  Loader2,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import {
  getFeaturedHomeSelection,
  getProductsPaged,
  saveFeaturedHome,
} from "../services/products.service";
import type { Product } from "../types";

const MAX_FEATURED = 4;

export function FeaturedHomeManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    try {
      const [paged, featured] = await Promise.all([
        getProductsPaged({ status: "activo", pageSize: 100 }),
        getFeaturedHomeSelection(),
      ]);
      setProducts(paged.items);
      const ordered = [...featured].sort(
        (a, b) => (a.featuredHomeOrder ?? 0) - (b.featuredHomeOrder ?? 0)
      );
      setSelectedIds(ordered.map((f) => f.id));
    } catch (error) {
      console.error("Error al cargar los productos destacados del home:", error);
      toast.error("No se pudieron cargar los productos destacados del Home");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const selectedMap = useMemo(() => new Set(selectedIds), [selectedIds]);

  const available = useMemo(() => {
    const term = query.trim().toLowerCase();
    return products.filter(
      (p) => !selectedMap.has(p.id) && (!term || p.name.toLowerCase().includes(term))
    );
  }, [products, selectedMap, query]);

  const selected = useMemo(() => {
    return selectedIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
  }, [selectedIds, products]);

  const toggle = (id: string) => {
    setDirty(true);
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_FEATURED) {
        toast.error(`La vitrina del Home admite exactamente hasta ${MAX_FEATURED} productos`);
        return prev;
      }
      return [...prev, id];
    });
  };

  const move = (index: number, direction: -1 | 1) => {
    setDirty(true);
    setSelectedIds((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const remove = (index: number) => {
    setDirty(true);
    setSelectedIds((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await saveFeaturedHome(selectedIds);
      const ordered = [...updated].sort(
        (a, b) => (a.featuredHomeOrder ?? 0) - (b.featuredHomeOrder ?? 0)
      );
      setSelectedIds(ordered.map((f) => f.id));
      setDirty(false);
      toast.success("Vitrina del Home actualizada exitosamente");
    } catch (error: any) {
      console.error("Error al guardar la vitrina del home:", error);
      toast.error(error?.message || "No se pudo guardar la selección del Home");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button asChild variant="ghost" size="sm" className="h-7 px-2 -ml-2 text-muted-foreground">
              <Link href="/admin/productos">
                <ChevronLeft className="h-4 w-4 mr-0.5" />
                Volver a productos
              </Link>
            </Button>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#34351F] flex items-center gap-2">
            <Home className="h-6 w-6 text-[#8C7A3E]" />
            Vitrina del Home (4 Destacados)
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Selecciona y ordena los exactamente {MAX_FEATURED} productos que se mostrarán en la
            sección principal de la página de inicio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5",
              selectedIds.length === MAX_FEATURED
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-amber-50 text-amber-800 border-amber-200"
            )}
          >
            <span>{selectedIds.length} / {MAX_FEATURED} seleccionados</span>
            {selectedIds.length === MAX_FEATURED && <Check className="h-3.5 w-3.5" />}
          </div>

          <Button
            onClick={handleSave}
            disabled={saving || !dirty}
            className="bg-[#34351F] hover:bg-[#34351F]/90 text-white gap-2 font-medium"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>Guardar cambios</span>
          </Button>
        </div>
      </div>

      {/* Grid de los 4 slots de la vitrina */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-[#8C7A3E]" />
          Orden de aparición en el Home (1 a 4)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: MAX_FEATURED }).map((_, slotIndex) => {
            const product = selected[slotIndex];

            if (!product) {
              return (
                <div
                  key={slotIndex}
                  className="rounded-2xl border-2 border-dashed border-border/80 bg-muted/20 p-6 flex flex-col items-center justify-center text-center min-h-[220px]"
                >
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground mb-2">
                    #{slotIndex + 1}
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground">Posición {slotIndex + 1} vacía</p>
                  <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                    Elige un producto de la lista inferior
                  </p>
                </div>
              );
            }

            const imageUrl = product.imageUrl || product.images[0];

            return (
              <Card
                key={product.id}
                className="overflow-hidden border border-border/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative group bg-card"
              >
                {/* Badge de posición */}
                <div className="absolute top-2.5 left-2.5 z-10 bg-[#34351F] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                  <span>Posición #{slotIndex + 1}</span>
                </div>

                {/* Acciones de reordenar */}
                <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1">
                  {slotIndex > 0 && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-7 w-7 rounded-full bg-white/90 hover:bg-white shadow-xs"
                      onClick={() => move(slotIndex, -1)}
                      title="Mover hacia la izquierda / antes"
                    >
                      <ArrowUp className="h-3.5 w-3.5 rotate-[-90deg] lg:rotate-0" />
                    </Button>
                  )}
                  {slotIndex < selected.length - 1 && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-7 w-7 rounded-full bg-white/90 hover:bg-white shadow-xs"
                      onClick={() => move(slotIndex, 1)}
                      title="Mover hacia la derecha / después"
                    >
                      <ArrowDown className="h-3.5 w-3.5 rotate-[-90deg] lg:rotate-0" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-7 w-7 rounded-full shadow-xs"
                    onClick={() => remove(slotIndex)}
                    title="Quitar del Home"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div>
                  <div className="aspect-[4/3] bg-muted/40 relative flex items-center justify-center overflow-hidden">
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageOff className="h-8 w-8 text-muted-foreground/60" />
                    )}
                  </div>

                  <div className="p-3.5 space-y-1.5">
                    <h3 className="font-heading font-semibold text-xs text-foreground truncate" title={product.name}>
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">{product.categoryName}</span>
                      <span className="font-semibold text-foreground">
                        ${product.basePrice.toLocaleString("es-CO")}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Catálogo de productos disponibles para añadir */}
      <div className="space-y-3 pt-4 border-t border-border/70">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-foreground">Catálogo de productos activos</h2>
            <p className="text-xs text-muted-foreground">
              Haz clic en "Destacar en Home" para agregarlo a uno de los 4 espacios de la vitrina.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre..."
              className="pl-8 h-8 text-xs bg-background"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {available.map((product) => {
            const imageUrl = product.imageUrl || product.images[0];
            const isFull = selectedIds.length >= MAX_FEATURED;

            return (
              <div
                key={product.id}
                className={cn(
                  "group rounded-xl border border-border/70 bg-card p-2.5 flex flex-col justify-between transition-all hover:border-[#34351F]/40 hover:shadow-xs",
                  isFull && "opacity-60"
                )}
              >
                <div>
                  <div className="aspect-square rounded-lg bg-muted/40 overflow-hidden relative mb-2 flex items-center justify-center">
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <ImageOff className="h-6 w-6 text-muted-foreground/60" />
                    )}
                  </div>
                  <p className="text-xs font-semibold text-foreground truncate" title={product.name}>
                    {product.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">{product.categoryName}</p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggle(product.id)}
                  disabled={isFull}
                  className="mt-2.5 h-7 text-[11px] font-semibold gap-1 border-[#34351F]/30 hover:bg-[#34351F] hover:text-white"
                >
                  <Plus className="h-3 w-3" />
                  <span>Destacar</span>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


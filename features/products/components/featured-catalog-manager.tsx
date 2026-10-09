"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ImageOff,
  Loader2,
  Plus,
  Save,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import {
  getFeaturedCatalogSelection,
  getProductsPaged,
  saveFeaturedCatalog,
} from "../services/products.service";
import type { Product } from "../types";

const MAX_FEATURED = 12;

export function FeaturedCatalogManager() {
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
        getFeaturedCatalogSelection(),
      ]);
      setProducts(paged.items);
      const ordered = [...featured].sort((a, b) => (a.catalogOrder ?? 0) - (b.catalogOrder ?? 0));
      setSelectedIds(ordered.map((f) => f.id));
    } catch (error) {
      console.error("Error al cargar el catálogo destacado:", error);
      toast.error("No se pudieron cargar los productos destacados");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
        toast.error(`El catálogo destacado admite máximo ${MAX_FEATURED} productos`);
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
      const updated = await saveFeaturedCatalog(selectedIds);
      const ordered = [...updated].sort((a, b) => (a.catalogOrder ?? 0) - (b.catalogOrder ?? 0));
      setSelectedIds(ordered.map((f) => f.id));
      setDirty(false);
      toast.success("Catálogo destacado actualizado");
    } catch (error) {
      console.error("Error al guardar el catálogo destacado:", error);
      toast.error("No se pudo guardar el catálogo destacado");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl text-[#8C7A4A]">⭐</span>
            <h1 className="font-heading font-serif text-3xl font-semibold text-foreground tracking-tight">
              Destacados del catálogo
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Elige hasta {MAX_FEATURED} productos que aparecerán en la primera sección de /catalogo en la tienda.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={!dirty || saving || selectedIds.length === 0}
          className="bg-[#5C5232] text-white hover:bg-[#4A4228] font-medium text-xs rounded-xl h-10 px-4"
        >
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Guardar selección
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Panel izquierdo: productos seleccionados (con reorden) */}
        <div className="flex-1 min-w-0">
          <Card className="border border-border/80 shadow-2xs overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 bg-[#F9F5EC]">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-[#8C7A4A] text-[#8C7A4A]" />
                <h2 className="font-heading font-serif text-lg font-medium text-foreground">
                  Seleccionados
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DFC9] bg-white px-2.5 py-1 text-xs font-medium text-[#6E613B]">
                {selectedIds.length} / {MAX_FEATURED}
              </span>
            </div>

            {selected.length === 0 ? (
              <div className="p-10 text-center space-y-1.5">
                <Star className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                <p className="text-sm font-medium text-foreground">Aún no hay productos destacados</p>
                <p className="text-xs text-muted-foreground">
                  Agrega productos desde el panel derecho; el primero de la lista se mostrará primero.
                </p>
              </div>
            ) : (
              <ol className="divide-y divide-border/60">
                {selected.map((product, index) => (
                  <li key={product.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="w-7 text-center font-mono text-xs text-muted-foreground shrink-0">
                      {index + 1}
                    </span>
                    <span className="relative h-12 w-12 rounded-lg bg-muted/60 overflow-hidden shrink-0">
                      {product.imageUrl || product.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.imageUrl || product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center">
                          <ImageOff className="h-4 w-4 text-muted-foreground/50" />
                        </span>
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {product.categoryName} · ${product.basePrice.toLocaleString("es-CO")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        disabled={index === 0}
                        onClick={() => move(index, -1)}
                        title="Subir"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        disabled={index === selected.length - 1}
                        onClick={() => move(index, 1)}
                        title="Bajar"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-rose-600"
                        onClick={() => remove(index)}
                        title="Quitar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>

        {/* Panel derecho: productos disponibles */}
        <div className="w-full lg:w-96 shrink-0">
          <Card className="border border-border/80 shadow-2xs overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-border/60">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar productos activos…"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex-1 max-h-[560px] overflow-y-auto p-3 space-y-2">
              {available.length === 0 ? (
                <p className="py-8 text-center text-xs text-muted-foreground">
                  No hay productos disponibles.
                </p>
              ) : (
                available.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => toggle(product.id)}
                    className="w-full flex items-center gap-3 rounded-lg border border-border/60 bg-card p-2 text-left hover:border-[#8C7A4A]/50 hover:bg-muted/40 transition-colors group"
                  >
                    <span className="relative h-11 w-11 rounded-md bg-muted/60 overflow-hidden shrink-0">
                      {product.imageUrl || product.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.imageUrl || product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center">
                          <ImageOff className="h-3.5 w-3.5 text-muted-foreground/50" />
                        </span>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium text-foreground">
                        {product.name}
                      </span>
                      <span className="block truncate text-[10px] text-muted-foreground">
                        ${product.basePrice.toLocaleString("es-CO")} · {product.categoryName}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-md border shrink-0 transition-colors",
                        selectedMap.has(product.id)
                          ? "bg-[#5C5232] border-[#5C5232] text-white"
                          : "border-border text-transparent group-hover:text-muted-foreground/40"
                      )}
                    >
                      {selectedMap.has(product.id) && <Check className="h-3.5 w-3.5" />}
                      {!selectedMap.has(product.id) && <Plus className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                ))
              )}
            </div>

            <div className="px-4 py-3 border-t border-border/60 text-[11px] text-muted-foreground">
              Los productos en gris ya están en la selección. Busca para filtrar la lista.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
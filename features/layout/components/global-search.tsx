"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Package, Users, ClipboardList, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getProducts } from "@/features/products/services/products.service";
import { getClients } from "@/features/clients/services/clients.service";
import { getQuotations } from "@/features/quotations/services/quotations.service";
import { getCollections } from "@/features/collections/services/collections.service";

interface SearchResult {
  id: string;
  label: string;
  sublabel: string;
  href: string;
  icon: typeof Package;
}

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const timeout = setTimeout(async () => {
      const [products, clients, quotations, collections] = await Promise.all([
        getProducts({ search: query }),
        getClients(query),
        getQuotations({ search: query }),
        getCollections(),
      ]);

      const productResults: SearchResult[] = products
        .slice(0, 4)
        .map((p) => ({ id: p.id, label: p.name, sublabel: "Producto", href: `/admin/productos/${p.id}`, icon: Package }));

      const clientResults: SearchResult[] = clients
        .filter((c) => c.name.toLowerCase().includes(q))
        .slice(0, 4)
        .map((c) => ({ id: c.id, label: c.name, sublabel: "Cliente", href: `/admin/clientes/${c.id}`, icon: Users }));

      const quotationResults: SearchResult[] = quotations
        .filter((qq) => qq.clientName.toLowerCase().includes(q))
        .slice(0, 4)
        .map((qq) => ({
          id: qq.id,
          label: `Cotización de ${qq.clientName}`,
          sublabel: "Cotización",
          href: `/admin/cotizaciones`,
          icon: ClipboardList,
        }));

      const collectionResults: SearchResult[] = collections
        .filter((c) => c.name.toLowerCase().includes(q))
        .slice(0, 4)
        .map((c) => ({ id: c.id, label: c.name, sublabel: "Colección", href: `/admin/colecciones/${c.id}`, icon: Layers }));

      setResults([...productResults, ...clientResults, ...quotationResults, ...collectionResults]);
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  function handleSelect(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <div ref={ref} className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar productos, clientes, cotizaciones..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="pl-9"
      />
      {open && results.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-card border border-border rounded-md shadow-md z-20 max-h-80 overflow-y-auto">
          {results.map((r) => {
            const Icon = r.icon;
            return (
              <button
                key={`${r.sublabel}-${r.id}`}
                onClick={() => handleSelect(r.href)}
                className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-secondary transition-colors"
              >
                <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-foreground truncate">{r.label}</p>
                  <p className="text-xs text-muted-foreground">{r.sublabel}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
      {open && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full mt-1 w-full bg-card border border-border rounded-md shadow-md z-20 p-3">
          <p className="text-sm text-muted-foreground">Sin resultados para &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, ImageOff, Trash2, Plus, PackageCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getProducts } from "@/features/products/services/products.service";
import type { Product } from "@/features/products/types";

interface AssignedProductsTableProps {
  assignedProductIds: string[];
  onChange: (ids: string[]) => void;
}

export function AssignedProductsTable({ assignedProductIds, onChange }: AssignedProductsTableProps) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInTable, setSelectedInTable] = useState<string[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState("");

  useEffect(() => {
    getProducts({ pageSize: 100 })
      .then((data) => setAllProducts(data))
      .catch(() => setAllProducts([]))
      .finally(() => setLoading(false));
  }, []);

  // Products assigned to this collection
  const assignedProducts = useMemo(() => {
    const idSet = new Set(assignedProductIds);
    return allProducts.filter((p) => idSet.has(p.id));
  }, [allProducts, assignedProductIds]);

  // Filtered assigned products in table
  const filteredAssignedProducts = useMemo(() => {
    if (!searchQuery.trim()) return assignedProducts;
    const q = searchQuery.toLowerCase();
    return assignedProducts.filter(
      (p) => p.name.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q)
    );
  }, [assignedProducts, searchQuery]);

  // Unassigned products available to add
  const unassignedProducts = useMemo(() => {
    const idSet = new Set(assignedProductIds);
    const unassigned = allProducts.filter((p) => !idSet.has(p.id));
    if (!modalSearch.trim()) return unassigned;
    const q = modalSearch.toLowerCase();
    return unassigned.filter(
      (p) => p.name.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q)
    );
  }, [allProducts, assignedProductIds, modalSearch]);

  const handleRemoveOne = (id: string) => {
    onChange(assignedProductIds.filter((x) => x !== id));
    setSelectedInTable((prev) => prev.filter((x) => x !== id));
  };

  const handleToggleSelectAllTable = () => {
    if (selectedInTable.length === filteredAssignedProducts.length) {
      setSelectedInTable([]);
    } else {
      setSelectedInTable(filteredAssignedProducts.map((p) => p.id));
    }
  };

  const handleToggleSelectTableOne = (id: string) => {
    setSelectedInTable((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleRemoveSelected = () => {
    const setToRemove = new Set(selectedInTable);
    onChange(assignedProductIds.filter((id) => !setToRemove.has(id)));
    setSelectedInTable([]);
  };

  const handleAddProduct = (id: string) => {
    if (!assignedProductIds.includes(id)) {
      onChange([...assignedProductIds, id]);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (loading) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Cargando listado de productos...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search Bar & Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar productos..."
            className="pl-9 bg-[#FAF9F5]/60 border-border/60 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {selectedInTable.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveSelected}
              className="text-red-600 border-red-200 hover:bg-red-50 text-xs"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Quitar seleccionados ({selectedInTable.length})
            </Button>
          )}

          {/* Dialog to add products */}
          <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-[#555A2B] hover:bg-[#454A23] text-white text-xs">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Agregar productos
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[85vh] flex flex-col">
              <DialogHeader>
                <DialogTitle className="font-serif text-xl">Agregar productos a la colección</DialogTitle>
              </DialogHeader>

              <div className="relative my-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  placeholder="Buscar productos disponibles..."
                  className="pl-9 text-xs"
                />
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-96">
                {unassignedProducts.length === 0 ? (
                  <p className="text-center py-8 text-sm text-muted-foreground">
                    No hay productos adicionales para agregar.
                  </p>
                ) : (
                  unassignedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-secondary/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-md bg-secondary shrink-0 overflow-hidden border border-border/40 flex items-center justify-center">
                          {product.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ImageOff className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.categoryName} · {formatCurrency(product.basePrice)}</p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddProduct(product.id)}
                        className="text-xs shrink-0 ml-2"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Agregar
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Products Table */}
      {filteredAssignedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border/60 rounded-lg text-center bg-[#FAF9F5]/50">
          <PackageCheck className="h-8 w-8 text-muted-foreground/40 mb-2" />
          <p className="text-sm font-medium text-foreground">Sin productos asignados</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {searchQuery
              ? "No se encontraron productos coincidentes."
              : "Haz clic en 'Agregar productos' para vincular prendas a esta colección."}
          </p>
        </div>
      ) : (
        <div className="border border-border/60 rounded-lg overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] border-b border-border/60 text-[#71717A] uppercase font-semibold">
                <tr>
                  <th className="p-3 w-10">
                    <Checkbox
                      checked={
                        selectedInTable.length > 0 &&
                        selectedInTable.length === filteredAssignedProducts.length
                      }
                      onCheckedChange={handleToggleSelectAllTable}
                    />
                  </th>
                  <th className="p-3">Producto</th>
                  <th className="p-3">Categoría</th>
                  <th className="p-3">Precio</th>
                  <th className="p-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredAssignedProducts.map((product) => {
                  const isChecked = selectedInTable.includes(product.id);
                  return (
                    <tr key={product.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="p-3">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => handleToggleSelectTableOne(product.id)}
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-md bg-secondary shrink-0 overflow-hidden border border-border/40 flex items-center justify-center">
                            {product.images[0] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <ImageOff className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <span className="font-medium text-foreground text-xs line-clamp-1">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">{product.categoryName || "Generale"}</td>
                      <td className="p-3 font-medium text-foreground">
                        {formatCurrency(product.basePrice)}
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveOne(product.id)}
                          className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

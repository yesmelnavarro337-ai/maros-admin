"use client";

import Link from "next/link";
import { ImageOff, Pencil, Trash2, Eye, MoreVertical, Star, ShoppingBag, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Collection } from "../types";

interface CollectionCardProps {
  collection: Collection;
  onPreview: () => void;
  onDelete: () => void;
}

export function CollectionCard({ collection, onPreview, onDelete }: CollectionCardProps) {
  const isDefault = collection.isDefault;
  const isActive = collection.isActive ?? true;
  const productsCount = collection.productsCount ?? collection.productIds.length;
  const seasonName = collection.seasonName || (collection.name.toLowerCase().includes("general") ? "Permanente" : "Especial");

  return (
    <Card className="overflow-hidden border border-border/60 bg-card rounded-xl shadow-xs hover:shadow-md transition-all flex flex-col h-full group relative">
      {/* Cover Image Container */}
      <div className="aspect-[16/10] relative w-full overflow-hidden bg-[#FAF9F5] flex items-center justify-center">
        {collection.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={collection.coverImage}
            alt={collection.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground p-4">
            <ImageOff className="h-8 w-8 mb-1 opacity-40 text-[#555A2B]" />
            <span className="text-xs opacity-60">Sin imagen de portada</span>
          </div>
        )}

        {/* Floating Predeterminada Badge */}
        {isDefault && (
          <div className="absolute top-3 left-3 bg-[#FAF5E6] text-[#555A2B] border border-[#E6DBB8] text-xs font-medium px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1.5 backdrop-blur-xs">
            <Star className="h-3.5 w-3.5 fill-[#555A2B] text-[#555A2B]" />
            <span>Predeterminada</span>
          </div>
        )}

        {/* Hover Quick Action Buttons */}
        <div className="hidden sm:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-2 backdrop-blur-[2px]">
          <Button asChild size="sm" variant="secondary" className="h-8 bg-white/90 hover:bg-white text-foreground text-xs shadow-xs">
            <Link href={`/admin/colecciones/${collection.id}`}>
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Editar
            </Link>
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 bg-white/90 hover:bg-white text-foreground text-xs shadow-xs"
            onClick={(e) => {
              e.preventDefault();
              onPreview();
            }}
          >
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            Vista previa
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="h-8 bg-red-600/90 hover:bg-red-600 text-white text-xs shadow-xs"
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Mobile Dropdown menu */}
        <div className="sm:hidden absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
              <Button size="icon" variant="secondary" className="h-7 w-7 bg-white/80 backdrop-blur-xs">
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/colecciones/${collection.id}`}>
                  <Pencil className="h-3.5 w-3.5 mr-2" />
                  Editar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onPreview}>
                <Eye className="h-3.5 w-3.5 mr-2" />
                Vista previa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <Link href={`/admin/colecciones/${collection.id}`} className="group-hover:text-[#555A2B] transition-colors">
              <h3 className="font-serif text-lg font-semibold tracking-tight text-[#1C1917] line-clamp-1">
                {collection.name}
              </h3>
            </Link>
          </div>

          {/* Status Badge */}
          <div className="mb-2.5">
            {isActive ? (
              <span className="inline-flex items-center gap-1.5 bg-[#E8F5E9] text-[#166534] text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                Activa
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-[#F3F4F6] text-[#4B5563] text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-[#9CA3AF]" />
                Inactiva
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-[#52525B] line-clamp-3 leading-relaxed mb-4">
            {collection.description || "Sin descripción disponible para esta colección."}
          </p>
        </div>

        {/* Footer info & options menu */}
        <div className="pt-3 border-t border-border/40 flex items-center justify-between text-[#71717A] text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <ShoppingBag className="h-3.5 w-3.5 text-[#555A2B]" />
              <span>
                {productsCount} {productsCount === 1 ? "producto" : "productos"}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#555A2B]" />
              <span>Temporada: {seasonName}</span>
            </div>
          </div>

          <div className="hidden sm:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-secondary text-muted-foreground">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/colecciones/${collection.id}`}>
                    <Pencil className="h-3.5 w-3.5 mr-2" />
                    Editar
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onPreview}>
                  <Eye className="h-3.5 w-3.5 mr-2" />
                  Vista previa
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-red-600">
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Card>
  );
}
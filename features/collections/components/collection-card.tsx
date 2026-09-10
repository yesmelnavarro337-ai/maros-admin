"use client";

import Link from "next/link";
import { ImageOff, Pencil, Trash2, Eye, MoreVertical, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  function handlePreview(e: React.MouseEvent) {
    e.preventDefault();
    onPreview();
  }

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    onDelete();
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full group relative">
      <div
        className="aspect-[16/9] flex items-center justify-center relative"
        style={{ backgroundColor: `${collection.accentHex}1A` }}
      >
        {collection.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={collection.coverImage} alt={collection.name} className="w-full h-full object-cover" />
        ) : (
          <ImageOff className="h-6 w-6" style={{ color: collection.accentHex }} />
        )}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ backgroundColor: collection.accentHex }}
        />

        {collection.isDefault && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground gap-1">
            <Star className="h-3 w-3 fill-current" />
            Predeterminada
          </Badge>
        )}

        <div className="hidden sm:flex absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-2">
          <Button asChild size="sm" variant="secondary">
            <Link href={`/admin/colecciones/${collection.id}`}>
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Editar
            </Link>
          </Button>
          <Button size="sm" variant="secondary" onClick={handlePreview}>
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            Vista previa
          </Button>
          <Button size="sm" variant="secondary" onClick={handleDelete}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="sm:hidden absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
              <Button size="icon" variant="secondary" className="h-7 w-7">
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
              <DropdownMenuItem onClick={onDelete}>
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Link href={`/admin/colecciones/${collection.id}`}>
        <CardContent className="pt-4">
          <p className="text-sm font-medium text-foreground">{collection.name}</p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{collection.description}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {collection.productIds.length} productos asignados
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}
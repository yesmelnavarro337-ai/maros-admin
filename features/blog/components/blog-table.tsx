"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlogStatusBadge } from "./blog-status-badge";
import type { BlogPost } from "../types";

interface BlogTableProps {
  posts: BlogPost[];
  onView: (post: BlogPost) => void;
  onEdit: (post: BlogPost) => void;
  onDelete: (post: BlogPost) => void;
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function excerpt(html: string, maxLen = 80): string {
  const text = html.replace(/<[^>]*>/g, "").trim();
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + "…";
}

export function BlogTable({ posts, onView, onEdit, onDelete }: BlogTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/60 bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3.5 w-[52px]">
              {/* Miniatura */}
            </TableHead>
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3.5">
              Artículo
            </TableHead>
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3.5">
              Categoría
            </TableHead>
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3.5">
              Fecha
            </TableHead>
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3.5">
              Estado
            </TableHead>
            <TableHead className="text-right font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3.5">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                No se encontraron artículos de blog.
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post) => (
              <TableRow
                key={post.id}
                className="hover:bg-accent/40 transition-colors group"
              >
                {/* Miniatura de portada */}
                <TableCell className="py-3 w-[52px] pr-0">
                  <div className="h-10 w-10 rounded-md overflow-hidden bg-muted/60 flex items-center justify-center shrink-0 border border-border/40">
                    {post.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.coverImage}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-muted-foreground">📄</span>
                    )}
                  </div>
                </TableCell>

                {/* Título + extracto */}
                <TableCell className="py-3.5">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {post.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {excerpt(post.content)}
                    </p>
                  </div>
                </TableCell>

                {/* Categoría */}
                <TableCell className="py-3.5">
                  <Badge variant="secondary" className="text-xs font-normal">
                    {post.category}
                  </Badge>
                </TableCell>

                {/* Fecha formateada */}
                <TableCell className="py-3.5">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(post.publishDate)}
                  </span>
                </TableCell>

                {/* Estado */}
                <TableCell className="py-3.5">
                  <BlogStatusBadge status={post.status} />
                </TableCell>

                {/* Acciones */}
                <TableCell className="py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      title="Ver artículo"
                      onClick={() => onView(post)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      title="Editar artículo"
                      onClick={() => onEdit(post)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      title="Eliminar artículo"
                      onClick={() => onDelete(post)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
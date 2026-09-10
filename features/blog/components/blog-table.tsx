import { Pencil, Trash2 } from "lucide-react";
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
  onEdit: (post: BlogPost) => void;
  onDelete: (post: BlogPost) => void;
}

export function BlogTable({ posts, onEdit, onDelete }: BlogTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Artículo</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell className="font-medium text-foreground">{post.title}</TableCell>
            <TableCell>
              <Badge variant="secondary">{post.category}</Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">{post.publishDate}</TableCell>
            <TableCell>
              <BlogStatusBadge status={post.status} />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEdit(post)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-destructive" onClick={() => onDelete(post)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
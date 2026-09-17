"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Plus,
  RefreshCw,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { toast } from "@/lib/toast";
import { BlogTable } from "./blog-table";
import { BlogSheetDrawer } from "./blog-sheet-drawer";
import {
  getBlogPostsPaged,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "../services/blog.service";
import { BLOG_CATEGORIES } from "../types";
import type { BlogPost, PagedBlogPosts, BlogStatus } from "../types";

export function BlogList() {
  /* ── Data state ── */
  const [data, setData] = useState<PagedBlogPosts>({
    items: [],
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  /* ── Filters ── */
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("todas");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [page, setPage] = useState(1);

  /* ── Sheet & delete ── */
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

  /* ── Debounce search ── */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  /* ── Fetch ── */
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBlogPostsPaged({
        search: debouncedSearch,
        category: categoryFilter,
        status: statusFilter,
        pageNumber: page,
        pageSize: 10,
      });
      setData(res);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudieron cargar los artículos."
      );
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, categoryFilter, statusFilter, page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  /* ── Handlers ── */
  function handleNewArticle() {
    setEditingPost(null);
    setSheetOpen(true);
  }

  async function handleView(post: BlogPost) {
    const full = await getBlogPostById(post.id);
    if (full) {
      setEditingPost(full);
      setSheetOpen(true);
    }
  }

  async function handleEdit(post: BlogPost) {
    const full = await getBlogPostById(post.id);
    if (full) {
      setEditingPost(full);
      setSheetOpen(true);
    }
  }

  async function handleSave(payload: {
    title: string;
    category: string;
    coverImage?: string;
    content: string;
    status: BlogStatus;
    publishDate: string;
  }) {
    try {
      if (editingPost) {
        await updateBlogPost(editingPost.id, payload);
        toast.success("Artículo actualizado");
      } else {
        await createBlogPost(payload);
        toast.success(
          payload.status === "borrador" ? "Borrador guardado" : "Artículo publicado"
        );
      }
      fetchPosts();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo guardar el artículo."
      );
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteBlogPost(deleteTarget.id);
      toast.success("Artículo eliminado");
      setDeleteTarget(null);
      fetchPosts();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo eliminar."
      );
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">
            Blog
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Administra los artículos del blog de Maro&apos;s Pijamas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchPosts()}
            disabled={loading}
            className="h-9 gap-2 text-xs font-medium"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <Button
            size="sm"
            onClick={handleNewArticle}
            className="h-9 gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium shadow-sm text-xs"
          >
            <Plus className="h-4 w-4" />
            + Nuevo artículo
          </Button>
        </div>
      </div>

      {/* ── Search & Filters ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-card p-4 rounded-xl border border-border/60 shadow-xs">
        <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título o contenido..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background h-10 border-border/80 focus-visible:ring-primary/20 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0 hidden sm:inline-block" />
          <Select
            value={categoryFilter}
            onValueChange={(v) => {
              setCategoryFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full h-10 bg-background border-border/80 text-sm">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las categorías</SelectItem>
              {BLOG_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full h-10 bg-background border-border/80 text-sm">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="publicado">Publicado</SelectItem>
            <SelectItem value="borrador">Borrador</SelectItem>
            <SelectItem value="programado">Programado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div className="bg-card rounded-xl border border-border/60 p-6 space-y-4">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
        </div>
      ) : (
        <div className="space-y-4">
          <BlogTable
            posts={data.items}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={setDeleteTarget}
          />

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-2">
            <p className="text-xs text-muted-foreground">
              Mostrando{" "}
              <span className="font-semibold text-foreground">
                {data.items.length > 0
                  ? (data.pageNumber - 1) * data.pageSize + 1
                  : 0}
                {" – "}
                {Math.min(data.pageNumber * data.pageSize, data.totalCount)}
              </span>{" "}
              de <span className="font-semibold text-foreground">{data.totalCount}</span>{" "}
              artículos
            </p>

            {data.totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  className="h-8 text-xs gap-1"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Anterior
                </Button>

                <span className="text-xs font-medium px-2.5 py-1 rounded bg-muted/60 text-foreground border border-border/60">
                  {data.pageNumber} / {data.totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  disabled={page === data.totalPages || loading}
                  className="h-8 text-xs gap-1"
                >
                  Siguiente
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Sheet Drawer ── */}
      <BlogSheetDrawer
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        editingPost={editingPost}
        onSave={handleSave}
      />

      {/* ── Delete Confirm ── */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar artículo"
        description={`¿Seguro que quieres eliminar "${deleteTarget?.title}"?`}
        confirmText="Eliminar"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ContentCard } from "@/components/shared/content-card";
import { PageHeader } from "@/components/shared/page-header";
import { toast } from "@/lib/toast";
import { BlogTable } from "./blog-table";
import { BlogPostDialog } from "./blog-post-dialog";
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from "../services/blog.service";
import type { BlogPost } from "../types";

export function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

const fetchPosts = useCallback(async () => {
  setLoading(true);
  try {
    const data = await getBlogPosts();
    setPosts(data);
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "No se pudieron cargar los artículos.");
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

async function handleSave(data: {
  title: string;
  category: string;
  coverImage?: string;
  content: string;
  status: BlogPost["status"];
  publishDate: string;
}) {
  try {
    if (editingPost) {
      await updateBlogPost(editingPost.id, data);
      toast.success("Artículo actualizado");
    } else {
      await createBlogPost(data);
      toast.success(data.status === "programado" ? "Artículo programado" : "Artículo publicado");
    }
    fetchPosts();
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "No se pudo guardar el artículo.");
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
    toast.error(error instanceof Error ? error.message : "No se pudo eliminar.");
  }
}

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Blog"
        subtitle="Administra los artículos del blog"
        action={
          <Button onClick={() => { setEditingPost(null); setDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo artículo
          </Button>
        }
      />

      <ContentCard noPadding>
        {loading ? (
          <div className="p-5">
            <Skeleton className="h-72 w-full rounded-lg" />
          </div>
        ) : (
          <BlogTable
            posts={posts}
            onEdit={(post) => { setEditingPost(post); setDialogOpen(true); }}
            onDelete={setDeleteTarget}
          />
        )}
      </ContentCard>

      <BlogPostDialog open={dialogOpen} onOpenChange={setDialogOpen} editingPost={editingPost} onSave={handleSave} />
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
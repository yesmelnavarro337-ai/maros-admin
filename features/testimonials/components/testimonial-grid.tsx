"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { toast } from "@/lib/toast";
import { TestimonialCard } from "./testimonial-card";
import { TestimonialDialog } from "./testimonial-dialog";
import {
  getTestimonials,
  createTestimonial,
  toggleTestimonialVisibility,
  deleteTestimonial,
} from "../services/testimonials.service";
import type { Testimonial } from "../types";

export function TestimonialGrid() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar los testimonios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  async function handleSave(data: { clientName: string; rating: number; quote: string }) {
    try {
      await createTestimonial(data);
      toast.success("Testimonio creado");
      fetchTestimonials();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo crear el testimonio.");
    }
  }

  async function handleToggle(t: Testimonial) {
    try {
      await toggleTestimonialVisibility(t.id, t.status);
      toast.success(t.status === "publicado" ? "Testimonio ocultado" : "Testimonio publicado");
      fetchTestimonials();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar.");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteTestimonial(deleteTarget.id);
      toast.success("Testimonio eliminado");
      setDeleteTarget(null);
      fetchTestimonials();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-foreground">Testimonios</h1>
          <p className="text-muted-foreground mt-1">Gestiona los testimonios de clientes</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo testimonio
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-lg" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <TestimonialCard
              key={t.id}
              testimonial={t}
              onToggle={() => handleToggle(t)}
              onDelete={() => setDeleteTarget(t)}
            />
          ))}
        </div>
      )}

      <TestimonialDialog open={dialogOpen} onOpenChange={setDialogOpen} onSave={handleSave} />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar testimonio"
        description={`¿Seguro que quieres eliminar el testimonio de "${deleteTarget?.clientName}"?`}
        confirmText="Eliminar"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
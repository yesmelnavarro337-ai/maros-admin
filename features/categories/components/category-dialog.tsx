"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { SingleImageUploader } from "@/components/shared/single-image-uploader";
import type { Category } from "../types";
import type { CategorySavePayload } from "../services/categories.service";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: Category | null;
  onSave: (payload: CategorySavePayload) => void;
}

export function CategoryDialog({ open, onOpenChange, editingCategory, onSave }: CategoryDialogProps) {
  const [name, setName] = useState(editingCategory?.name ?? "");
  const [description, setDescription] = useState(editingCategory?.description ?? "");
  const [imageUrl, setImageUrl] = useState<string | undefined>(editingCategory?.imageUrl ?? undefined);
  const [confirmSave, setConfirmSave] = useState(false);

  useEffect(() => {
    if (open) {
      setName(editingCategory?.name ?? "");
      setDescription(editingCategory?.description ?? "");
      setImageUrl(editingCategory?.imageUrl ?? undefined);
    }
  }, [editingCategory, open]);

  function handleSubmit() {
    if (!name.trim()) return;
    setConfirmSave(true);
  }

  function proceedSave() {
    setConfirmSave(false);
    onSave({
      name: name.trim(),
      description: description.trim() || null,
      imageUrl: imageUrl || null,
    });
    onOpenChange(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Editar categoría" : "Nueva categoría"}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div>
              <Label className="mb-1.5 block">Nombre de la categoría *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Pijamas de Algodón"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
            </div>

            <div>
              <Label className="mb-1.5 block">Descripción corta (opcional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve descripción o detalle de la categoría..."
                rows={2}
                className="resize-none"
              />
            </div>

            <div>
              <SingleImageUploader
                label="Fotografía de portada (Cloudinary)"
                value={imageUrl}
                onChange={(url) => setImageUrl(url)}
                aspect="square"
                folder="categories"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!name.trim()}>
              {editingCategory ? "Guardar cambios" : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmSave}
        onOpenChange={(open) => !open && setConfirmSave(false)}
        title="Confirmar guardado"
        description={`¿Estás seguro de que deseas ${editingCategory ? "actualizar" : "crear"} la categoría "${name.trim()}"?`}
        confirmText="Guardar"
        onConfirm={proceedSave}
      />
    </>
  );
}
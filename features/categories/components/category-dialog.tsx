"use client";

import { useState } from "react";
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
import type { Category } from "../types";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: Category | null;
  onSave: (name: string) => void;
}

export function CategoryDialog({ open, onOpenChange, editingCategory, onSave }: CategoryDialogProps) {
  const [name, setName] = useState(editingCategory?.name ?? "");

  function handleSubmit() {
    if (!name.trim()) return;
    onSave(name.trim());
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingCategory ? "Editar categoría" : "Nueva categoría"}</DialogTitle>
        </DialogHeader>

        <div>
          <Label className="mb-1.5 block">Nombre</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Pijamas de Mujer"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            {editingCategory ? "Guardar cambios" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
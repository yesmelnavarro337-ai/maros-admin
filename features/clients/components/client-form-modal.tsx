"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";
import { createClient, updateClient } from "../services/clients.service";
import type { Client, ClientFormData } from "../types";

interface ClientFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientToEdit?: Client | null;
  onSuccess: () => void;
}

export function ClientFormModal({
  open,
  onOpenChange,
  clientToEdit,
  onSuccess,
}: ClientFormModalProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    phone: "",
    email: "",
    city: "Valledupar",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (clientToEdit) {
      setFormData({
        name: clientToEdit.name || "",
        phone: clientToEdit.phone || "",
        email: clientToEdit.email || "",
        city: clientToEdit.city || "Valledupar",
      });
    } else {
      setFormData({
        name: "",
        phone: "",
        email: "",
        city: "Valledupar",
      });
    }
  }, [clientToEdit, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("El nombre del cliente es obligatorio.");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("El teléfono del cliente es obligatorio.");
      return;
    }

    setSubmitting(true);
    try {
      if (clientToEdit) {
        await updateClient(clientToEdit.id, formData);
        toast.success("Cliente actualizado correctamente.");
      } else {
        await createClient(formData);
        toast.success("Cliente registrado con éxito.");
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al guardar la información del cliente."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-serif">
              {clientToEdit ? "Editar Cliente" : "Nuevo Cliente"}
            </DialogTitle>
            <DialogDescription>
              {clientToEdit
                ? "Modifica los datos de contacto del cliente."
                : "Ingresa los datos para registrar un nuevo cliente en el sistema."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="client-name">Nombre completo *</Label>
              <Input
                id="client-name"
                placeholder="Ej. Jhonirys Perez"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client-phone">Teléfono *</Label>
                <Input
                  id="client-phone"
                  placeholder="Ej. 3024630399"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-city">Ciudad *</Label>
                <Input
                  id="client-city"
                  placeholder="Ej. Valledupar"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-email">Correo electrónico (Opcional)</Label>
              <Input
                id="client-email"
                type="email"
                placeholder="cliente@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : clientToEdit ? (
                "Guardar cambios"
              ) : (
                "Crear cliente"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

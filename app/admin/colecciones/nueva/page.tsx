"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/page-header";
import { toast } from "@/lib/toast";
import { createCollection } from "@/features/collections/services/collections.service";

export default function NuevaColeccionPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [accentHex, setAccentHex] = useState("#6B6832");
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!name.trim()) {
      toast.error("El nombre es obligatorio.");
      return;
    }
    setSaving(true);
    try {
      const created = await createCollection({ name, description, accentHex });
      toast.success("Colección creada correctamente");
      router.push(`/admin/colecciones/${created.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo crear la colección.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <PageHeader title="Nueva colección" subtitle="Define el nombre y color base — luego podrás agregar imagen y productos" />

      <div className="flex flex-col gap-4">
        <div>
          <Label className="mb-1.5 block">Nombre</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Primavera 2027" />
        </div>
        <div>
          <Label className="mb-1.5 block">Descripción</Label>
          <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <Label className="mb-1.5 block">Color de acento</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={accentHex}
              onChange={(e) => setAccentHex(e.target.value)}
              className="h-9 w-9 rounded-md border border-border cursor-pointer"
            />
            <Input value={accentHex} onChange={(e) => setAccentHex(e.target.value)} className="font-mono text-xs w-32" />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={() => router.push("/admin/colecciones")}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={saving}>
            {saving ? "Creando..." : "Crear colección"}
          </Button>
        </div>
      </div>
    </div>
  );
}
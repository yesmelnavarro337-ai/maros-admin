"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";
import { createCollection } from "@/features/collections/services/collections.service";

export default function NuevaColeccionPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [accentHex, setAccentHex] = useState("#555A2B");
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!name.trim()) {
      toast.error("El nombre de la colección es obligatorio.");
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
    <div className="flex flex-col gap-6 max-w-xl mx-auto pb-12">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/admin/colecciones" className="hover:text-foreground flex items-center gap-1 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Colecciones
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">Nueva colección</span>
      </div>

      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1C1917]">Nueva colección</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Define el nombre y descripción — luego podrás agregar la imagen de portada y asignar productos.
        </p>
      </div>

      <div className="bg-card border border-border/60 rounded-xl p-6 shadow-2xs space-y-4">
        <div>
          <Label className="text-xs font-medium text-foreground mb-1.5 block">Nombre de la colección</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Amor y Amistad 2026, Navidad 2026"
            className="bg-[#FAF9F5]/60 border-border/60 focus-visible:bg-background text-sm"
          />
        </div>

        <div>
          <Label className="text-xs font-medium text-foreground mb-1.5 block">Descripción</Label>
          <Textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Escribe una descripción publicitaria o narrativa para esta colección..."
            className="bg-[#FAF9F5]/60 border-border/60 focus-visible:bg-background text-sm leading-relaxed"
          />
        </div>

        <div>
          <Label className="text-xs font-medium text-foreground mb-1.5 block">Color de acento</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={accentHex}
              onChange={(e) => setAccentHex(e.target.value)}
              className="h-9 w-9 rounded-md border border-border cursor-pointer p-0.5"
            />
            <Input
              value={accentHex}
              onChange={(e) => setAccentHex(e.target.value)}
              className="font-mono text-xs w-32 bg-[#FAF9F5]/60 border-border/60"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-border/40">
          <Button variant="outline" onClick={() => router.push("/admin/colecciones")} className="text-xs">
            Cancelar
          </Button>
          <Button
            onClick={handleCreate}
            disabled={saving}
            className="bg-[#555A2B] hover:bg-[#454A23] text-white text-xs font-medium px-4 shadow-xs"
          >
            {saving ? "Creando..." : "Crear colección"}
          </Button>
        </div>
      </div>
    </div>
  );
}
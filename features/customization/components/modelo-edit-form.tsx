"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Image as ImageIcon,
  Info,
  Check,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SingleImageUploader } from "@/components/shared/single-image-uploader";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  getCustomizationCatalogs,
  updateCatalogItem,
  deleteCatalogItem,
  type CustomizationCatalogs,
  type CatalogItem,
} from "../services/customization.service";
import { toast } from "@/lib/toast";

interface ModeloEditFormProps {
  modelItem: CatalogItem;
}

export function ModeloEditForm({ modelItem }: ModeloEditFormProps) {
  const router = useRouter();

  const [name, setName] = useState(modelItem.name);
  const [category, setCategory] = useState(modelItem.category || "Pijamas Mujer");
  const [description, setDescription] = useState(modelItem.description || "Diseño exclusivo de pijama para el personalizador.");
  const [active, setActive] = useState(modelItem.active ?? true);
  const [image, setImage] = useState<string | undefined>(modelItem.image);

  // Assigned Options State (IDs of assigned fabrics, colors, prints, embroideries, sizes)
  const [assignedOptionIds, setAssignedOptionIds] = useState<string[]>(
    modelItem.assignedOptionIds || []
  );

  const [catalogs, setCatalogs] = useState<CustomizationCatalogs | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    getCustomizationCatalogs().then(setCatalogs);
  }, []);

  const toggleOption = (id: string) => {
    setAssignedOptionIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("El nombre del modelo es obligatorio.");
      return;
    }

    setSaving(true);
    try {
      await updateCatalogItem(modelItem.id, {
        name,
        image,
        active,
        description,
        category,
        assignedOptionIds,
      });
      toast.success("Modelo actualizado correctamente");
      router.push("/admin/personalizacion?tab=modelos");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar el modelo.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteCatalogItem(modelItem.id);
      toast.success(`Modelo "${modelItem.name}" eliminado`);
      router.push("/admin/personalizacion?tab=modelos");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar.");
    }
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-6xl mx-auto pb-16">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div className="flex flex-col gap-1">
          <Link
            href="/admin/personalizacion?tab=modelos"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a Modelos
          </Link>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1C1917]">
              Editar Modelo: {modelItem.name}
            </h1>
            {active ? (
              <span className="bg-[#E8F5E9] text-[#166534] text-xs font-medium px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                Activo
              </span>
            ) : (
              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Inactivo
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons Top Right */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/personalizacion?tab=modelos")}
            className="text-xs border-border/60"
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setDeleteOpen(true)}
            className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 text-xs"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Eliminar
          </Button>

          <Button
            type="submit"
            disabled={saving}
            className="bg-[#555A2B] hover:bg-[#454A23] text-white text-xs font-medium px-4 shadow-xs"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (Datos - 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-[#555A2B]" />
                <h2 className="font-serif text-lg font-semibold text-[#1C1917]">
                  Información del Modelo
                </h2>
              </div>

              {/* Status Switch */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-medium text-foreground">Estado Activo</span>
                <Switch
                  checked={active}
                  onCheckedChange={setActive}
                  className="data-[state=checked]:bg-[#555A2B]"
                />
              </div>
            </div>

            {/* Field: Nombre */}
            <div>
              <Label className="text-xs font-medium text-foreground mb-1.5 block">
                Nombre del modelo <span className="text-red-500">*</span>
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Clásico, Familiar, Infantil, Camisero"
                className="bg-[#FAF9F5]/60 border-border/60 focus-visible:bg-background text-sm"
              />
            </div>

            {/* Field: Categoría */}
            <div>
              <Label className="text-xs font-medium text-foreground mb-1.5 block">
                Categoría principal
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-[#FAF9F5]/60 border-border/60 text-sm">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pijamas Mujer">Pijamas Mujer</SelectItem>
                  <SelectItem value="Pijamas Hombre">Pijamas Hombre</SelectItem>
                  <SelectItem value="Pijamas Infantiles">Pijamas Infantiles</SelectItem>
                  <SelectItem value="Colección Familiar">Colección Familiar</SelectItem>
                  <SelectItem value="Accesorios">Accesorios</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Field: Descripción con Contador X/250 */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-xs font-medium text-foreground block">
                  Descripción
                </Label>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {description.length}/250
                </span>
              </div>
              <Textarea
                rows={4}
                maxLength={250}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe las características principales de este diseño o modelo..."
                className="bg-[#FAF9F5]/60 border-border/60 focus-visible:bg-background text-sm leading-relaxed"
              />
            </div>
          </div>

          {/* Card: Opciones asignadas al modelo (Telas, Colores, Estampados, Bordados, Tallas) */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-2xs space-y-5">
            <div className="pb-2 border-b border-border/40">
              <h2 className="font-serif text-lg font-semibold text-[#1C1917]">
                Opciones asignadas al modelo
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Haz clic en las fichas para asociar o desvincular opciones del personalizador.
              </p>
            </div>

            {/* Section: Telas */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-[#555A2B] uppercase tracking-wide block">
                Telas Disponibles
              </Label>
              <div className="flex items-center gap-2 flex-wrap">
                {(catalogs?.telas || []).length === 0 ? (
                  <span className="text-xs text-muted-foreground">Sin telas en catálogo</span>
                ) : (
                  (catalogs?.telas || []).map((t) => {
                    const isAssigned = assignedOptionIds.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleOption(t.id)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
                          isAssigned
                            ? "bg-[#555A2B] text-white border-[#555A2B] shadow-2xs"
                            : "bg-[#FAF9F5] text-foreground border-border/60 hover:bg-secondary"
                        }`}
                      >
                        {isAssigned ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3 text-muted-foreground" />}
                        {t.name}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Section: Colores */}
            <div className="space-y-2 pt-2 border-t border-border/40">
              <Label className="text-xs font-medium text-[#555A2B] uppercase tracking-wide block">
                Colores Disponibles
              </Label>
              <div className="flex items-center gap-2 flex-wrap">
                {(catalogs?.colores || []).length === 0 ? (
                  <span className="text-xs text-muted-foreground">Sin colores en catálogo</span>
                ) : (
                  (catalogs?.colores || []).map((c) => {
                    const isAssigned = assignedOptionIds.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleOption(c.id)}
                        className={`text-xs px-2.5 py-1 rounded-full border font-medium flex items-center gap-1.5 transition-all ${
                          isAssigned
                            ? "bg-[#FAF5E6] text-[#555A2B] border-[#E6DBB8] ring-1 ring-[#555A2B]"
                            : "bg-[#FAF9F5] text-foreground border-border/60 hover:bg-secondary"
                        }`}
                      >
                        <span
                          className="h-3.5 w-3.5 rounded-full border border-black/20"
                          style={{ backgroundColor: c.hex || "#6B8E23" }}
                        />
                        <span>{c.name}</span>
                        {isAssigned && <Check className="h-3 w-3 text-[#555A2B]" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Section: Estampados */}
            <div className="space-y-2 pt-2 border-t border-border/40">
              <Label className="text-xs font-medium text-[#555A2B] uppercase tracking-wide block">
                Estampados Disponibles
              </Label>
              <div className="flex items-center gap-2 flex-wrap">
                {(catalogs?.estampados || []).length === 0 ? (
                  <span className="text-xs text-muted-foreground">Sin estampados en catálogo</span>
                ) : (
                  (catalogs?.estampados || []).map((e) => {
                    const isAssigned = assignedOptionIds.includes(e.id);
                    return (
                      <button
                        key={e.id}
                        type="button"
                        onClick={() => toggleOption(e.id)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
                          isAssigned
                            ? "bg-[#555A2B] text-white border-[#555A2B] shadow-2xs"
                            : "bg-[#FAF9F5] text-foreground border-border/60 hover:bg-secondary"
                        }`}
                      >
                        {isAssigned ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3 text-muted-foreground" />}
                        {e.name}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Section: Tallas */}
            <div className="space-y-2 pt-2 border-t border-border/40">
              <Label className="text-xs font-medium text-[#555A2B] uppercase tracking-wide block">
                Tallas Disponibles
              </Label>
              <div className="flex items-center gap-2 flex-wrap">
                {(catalogs?.tallas || []).length === 0 ? (
                  <span className="text-xs text-muted-foreground">Sin tallas en catálogo</span>
                ) : (
                  (catalogs?.tallas || []).map((sz) => {
                    const isAssigned = assignedOptionIds.includes(sz.id);
                    return (
                      <button
                        key={sz.id}
                        type="button"
                        onClick={() => toggleOption(sz.id)}
                        className={`text-xs px-3 py-1 rounded-md border font-mono font-bold transition-all ${
                          isAssigned
                            ? "bg-[#FAF5E6] text-[#555A2B] border-[#E6DBB8] ring-1 ring-[#555A2B]"
                            : "bg-[#FAF9F5] text-foreground border-border/60 hover:bg-secondary"
                        }`}
                      >
                        {sz.name}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Media - 1 col) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/40">
              <ImageIcon className="h-4 w-4 text-[#555A2B]" />
              <h2 className="font-serif text-lg font-semibold text-[#1C1917]">
                Imagen del Modelo
              </h2>
            </div>

            <div className="space-y-4 pt-1">
              <SingleImageUploader
                label="Cargar imagen en alta resolución"
                value={image}
                onChange={setImage}
                folder="customization"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Eliminar modelo"
        description={`¿Seguro que quieres eliminar el modelo "${modelItem.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        onConfirm={handleDelete}
      />
    </form>
  );
}

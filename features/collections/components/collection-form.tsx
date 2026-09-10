"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { SingleImageUploader } from "@/components/shared/single-image-uploader";
import { ProductPicker } from "./product-picker";
import { updateCollection, setDefaultCollection, deleteCollection } from "../services/collections.service";
import { toast } from "@/lib/toast";
import type { Collection } from "../types";

export function CollectionForm({ collection }: { collection: Collection }) {
  const router = useRouter();
  const [description, setDescription] = useState(collection.description);
  const [coverImage, setCoverImage] = useState<string | undefined>(collection.coverImage);
  const [productIds, setProductIds] = useState<string[]>(collection.productIds);
  const [saving, setSaving] = useState(false);
  const [settingDefault, setSettingDefault] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await updateCollection(collection.id, { description, coverImage, productIds });
      toast.success("Colección actualizada correctamente");
      router.push("/admin/colecciones");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSetDefault() {
    setSettingDefault(true);
    try {
      await setDefaultCollection(collection.id);
      toast.success(`"${collection.name}" es ahora la colección predeterminada`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo marcar como predeterminada.");
    } finally {
      setSettingDefault(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteCollection(collection.id);
      toast.success(`"${collection.name}" fue eliminada`);
      router.push("/admin/colecciones");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar. Verifica que no tenga temporadas asociadas.");
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span
            className="h-8 w-8 rounded-full shrink-0"
            style={{ backgroundColor: collection.accentHex }}
          />
          <h1 className="font-heading text-3xl text-foreground">{collection.name}</h1>
          {collection.isDefault && (
            <Badge className="bg-primary text-primary-foreground gap-1">
              <Star className="h-3 w-3 fill-current" />
              Predeterminada
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          {!collection.isDefault && (
            <Button variant="outline" onClick={handleSetDefault} disabled={settingDefault}>
              <Star className="h-4 w-4 mr-2" />
              {settingDefault ? "Marcando..." : "Marcar como predeterminada"}
            </Button>
          )}
          <Button variant="outline" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>

      <div>
        <Label className="mb-1.5 block">Descripción</Label>
        <Textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

<SingleImageUploader
  label="Imagen de portada"
  value={coverImage}
  onChange={setCoverImage}
  folder="collections"
/>

      <div>
        <Label className="mb-1.5 block">
          Productos asignados ({productIds.length})
        </Label>
        <ProductPicker selectedIds={productIds} onChange={setProductIds} />
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Eliminar colección"
        description={`¿Seguro que quieres eliminar "${collection.name}"? Si tiene temporadas asociadas, el backend rechazará la eliminación.`}
        confirmText="Eliminar"
        onConfirm={handleDelete}
      />
    </div>
  );
}
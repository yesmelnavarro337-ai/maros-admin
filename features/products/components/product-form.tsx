"use client";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import {
  productSchema,
  type ProductFormInput,
  type ProductFormValues,
} from "../schemas/product.schema";

import { useVariantMatrix } from "../hooks/use-variant-matrix";

import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/products.service";

import { ImageUploader } from "./image-uploader";
import { SizesColorsEditor } from "./sizes-colors-editor";
import { VariantMatrix } from "./variant-matrix";
import { SeoFields } from "./seo-fields";

import type { Product } from "../types";
import { SeoEditor } from "@/components/shared/seo-editor";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { DELIVERY_TIME_OPTIONS } from "../types";

import type { SeoData } from "@/types/seo";
import type { Collection } from "@/features/collections/types";
import { getCollections } from "@/features/collections/services/collections.service";

import { Label } from "@/components/ui/label";
import { useCategories } from "@/features/categories/hooks/use-categories";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Trash2 } from "lucide-react";

interface ProductFormProps {
  mode: "create" | "edit";
  initialData?: Product;
}

export function ProductForm({ mode, initialData }: ProductFormProps) {
  const router = useRouter();

  const [images, setImages] = useState<string[]>(
    initialData?.images ?? []
  );

  const { categories, loading: loadingCategories } = useCategories();

  // Colecciones reales provenientes del backend
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loadingCollections, setLoadingCollections] = useState(true);

  const [collectionIds, setCollectionIds] = useState<string[]>(
    initialData?.collectionIds ?? []
  );

  const [featuredHome, setFeaturedHome] = useState(
    initialData?.featuredHome ?? false
  );

  const [allowCustomization, setAllowCustomization] = useState(
    initialData?.allowCustomization ?? true
  );

  const [deliveryTime, setDeliveryTime] = useState(
    initialData?.deliveryTime ?? DELIVERY_TIME_OPTIONS[1]
  );

  const [seo, setSeo] = useState<SeoData>(
    initialData?.seo ?? {
      title: "",
      description: "",
      slug: "",
    }
  );

  /**
   * Carga las colecciones reales desde el backend.
   *
   * Ya no usamos mockCollections.
   */
  useEffect(() => {
    let mounted = true;

    async function loadCollections() {
      try {
        setLoadingCollections(true);

        const data = await getCollections();

        if (mounted) {
          setCollections(data);
        }
      } catch {
        if (mounted) {
          toast.error("No se pudieron cargar las colecciones");
        }
      } finally {
        if (mounted) {
          setLoadingCollections(false);
        }
      }
    }

    loadCollections();

    return () => {
      mounted = false;
    };
  }, []);

  const {
    sizes,
    colors,
    variants,
    addSize,
    removeSize,
    addColor,
    removeColor,
    updateVariant,
  } = useVariantMatrix(
    initialData?.sizes ?? [],
    initialData?.colors ?? [],
    initialData?.variants ?? []
  );

  const form = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      categoryId: initialData?.categoryId ?? "",
      description: initialData?.description ?? "",
      basePrice: initialData?.basePrice ?? 0,
      status: initialData?.status ?? "borrador",
    },
  });

  const [deleteOpen, setDeleteOpen] = useState(false);

  async function onSubmit(values: ProductFormValues) {
    const payload = {
      ...values,
      images,
      variants,
      collectionIds,
      featuredHome,
      allowCustomization,
      deliveryTime,
      seo,
    };

    if (mode === "create") {
      const created = await createProduct(payload);

      toast.success("Producto creado correctamente");

      router.push(`/admin/productos/${created.id}`);
    } else if (initialData) {
      await updateProduct(initialData.id, payload);

      toast.success("Producto actualizado correctamente");

      router.push("/admin/productos");
    }
  }

  async function handleDelete() {
    if (!initialData) return;

    await deleteProduct(initialData.id);

    toast.success(`"${initialData.name}" fue eliminado`);

    router.push("/admin/productos");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-3xl text-foreground">
            {mode === "create" ? "Nuevo producto" : initialData?.name}
          </h1>

          <div className="flex gap-2">
            {mode === "edit" && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            )}

            <Button type="submit">Guardar producto</Button>
          </div>
        </div>

        <Tabs defaultValue="info">
          <TabsList>
            <TabsTrigger value="info">Información</TabsTrigger>
            <TabsTrigger value="images">Imágenes</TabsTrigger>
            <TabsTrigger value="variants">Variantes</TabsTrigger>
            <TabsTrigger value="collection">Colección</TabsTrigger>
            <TabsTrigger value="config">Configuración</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* INFORMACIÓN */}
          <TabsContent
            value="info"
            className="flex flex-col gap-4 max-w-lg pt-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del producto</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Ej. Pijama Satín Beige"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loadingCategories}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>

                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Describe el producto..."
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio base (COP)</FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      placeholder="129000"
                      name={field.name}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      disabled={field.disabled}
                      value={
                        field.value === undefined
                          ? ""
                          : String(field.value)
                      }
                      onChange={(e) =>
                        field.onChange(e.target.value)
                      }
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="activo">
                        Activo
                      </SelectItem>

                      <SelectItem value="borrador">
                        Borrador
                      </SelectItem>

                      <SelectItem value="archivado">
                        Archivado
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          {/* IMÁGENES */}
          <TabsContent value="images" className="pt-4">
            <ImageUploader
              images={images}
              onChange={setImages}
            />
          </TabsContent>

          {/* VARIANTES */}
          <TabsContent
            value="variants"
            className="flex flex-col gap-6 pt-4"
          >
            <SizesColorsEditor
              sizes={sizes}
              colors={colors}
              onAddSize={addSize}
              onRemoveSize={removeSize}
              onAddColor={addColor}
              onRemoveColor={removeColor}
            />

            <VariantMatrix
              sizes={sizes}
              colors={colors}
              variants={variants}
              onUpdateVariant={updateVariant}
            />
          </TabsContent>

          {/* COLECCIONES */}
          <TabsContent
            value="collection"
            className="pt-4 max-w-md"
          >
            <p className="text-sm font-medium text-foreground mb-3">
              Asignar a colecciones
            </p>

            {loadingCollections ? (
              <p className="text-sm text-muted-foreground">
                Cargando colecciones...
              </p>
            ) : collections.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay colecciones disponibles.
              </p>
            ) : (
              <div className="flex flex-col gap-1">
                {collections.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-secondary cursor-pointer"
                  >
                    <Checkbox
                      checked={collectionIds.includes(c.id)}
                      onCheckedChange={(checked) =>
                        setCollectionIds((prev) =>
                          checked
                            ? prev.includes(c.id)
                              ? prev
                              : [...prev, c.id]
                            : prev.filter(
                                (id) => id !== c.id
                              )
                        )
                      }
                    />

                    <span
                      className="h-3 w-3 rounded-full border border-border shrink-0"
                      style={{
                        backgroundColor: c.accentHex,
                      }}
                    />

                    <span className="text-sm text-foreground">
                      {c.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </TabsContent>

          {/* CONFIGURACIÓN */}
          <TabsContent
            value="config"
            className="pt-4 max-w-md flex flex-col gap-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Destacar en página principal
                </p>

                <p className="text-xs text-muted-foreground">
                  Se mostrará en el home de la landing pública
                </p>
              </div>

              <Switch
                checked={featuredHome}
                onCheckedChange={setFeaturedHome}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Permitir personalización
                </p>

                <p className="text-xs text-muted-foreground">
                  Habilita el configurador de telas, colores y
                  bordados
                </p>
              </div>

              <Switch
                checked={allowCustomization}
                onCheckedChange={setAllowCustomization}
              />
            </div>

            <div>
              <Label className="mb-1.5 block">
                Tiempo de entrega estimado
              </Label>

              <Select
                value={deliveryTime}
                onValueChange={setDeliveryTime}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {DELIVERY_TIME_OPTIONS.map((option) => (
                    <SelectItem
                      key={option}
                      value={option}
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* SEO */}
          <TabsContent value="seo" className="pt-4">
            <SeoEditor
              value={seo}
              onChange={setSeo}
            />
          </TabsContent>
        </Tabs>
      </form>

      {initialData && (
        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Eliminar producto"
          description={`¿Seguro que quieres eliminar "${initialData.name}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          onConfirm={handleDelete}
        />
      )}
    </Form>
  );
}
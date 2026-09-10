"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { seasonSchema, type SeasonFormValues } from "../schemas/season.schema";
import { createSeason, updateSeason, deleteSeason, activateSeason } from "../services/seasons.service";
import { SeasonColorEditor } from "./season-color-editor";
import { SeasonPreviewModal } from "./season-preview-modal";
import { SingleImageUploader } from "@/components/shared/single-image-uploader";
import { ProductPicker } from "@/features/collections/components/product-picker";
import { getCollections } from "@/features/collections/services/collections.service";
import type { Collection } from "@/features/collections/types";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Trash2, Sparkles } from "lucide-react";
import type { Season, SeasonColors } from "../types";
import type { CollectionId } from "@/features/collections/types";
import { toast } from "@/lib/toast";

interface SeasonFormProps {
  mode: "create" | "edit";
  initialData?: Season;
}

export function SeasonForm({ mode, initialData }: SeasonFormProps) {
  const router = useRouter();
  const [heroImage, setHeroImage] = useState(initialData?.heroImage);
  const [bannerImage, setBannerImage] = useState(initialData?.bannerImage);
  const [colors, setColors] = useState<SeasonColors>(
    initialData?.colors ?? { primary: "#6B6832", accent: "#B6AE3A", background: "#FAF8F4" }
  );
  const [featuredProductIds, setFeaturedProductIds] = useState<string[]>(
    initialData?.featuredProductIds ?? []
  );
  const [activating, setActivating] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
const [loadingCollections, setLoadingCollections] = useState(true);

useEffect(() => {
  getCollections()
    .then(setCollections)
    .finally(() => setLoadingCollections(false));
}, []);

  const form = useForm<SeasonFormValues>({
    resolver: zodResolver(seasonSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      collectionId: initialData?.collectionId ?? "",
      startDate: initialData?.startDate ?? "",
      endDate: initialData?.endDate ?? "",
      heroTitle: initialData?.heroTitle ?? "",
      heroSubtitle: initialData?.heroSubtitle ?? "",
      ctaText: initialData?.ctaText ?? "Ver colección",
      ctaLink: initialData?.ctaLink ?? "",
    },
  });

const selectedCollectionId = form.watch("collectionId");
const collectionProductIds =
  collections.find((c) => c.id === selectedCollectionId)?.productIds ?? [];

async function onSubmit(values: SeasonFormValues) {
  const payload = { ...values, heroImage, bannerImage, colors, featuredProductIds };

  try {
    if (mode === "create") {
      const created = await createSeason(payload);
      toast.success("Temporada creada correctamente");
      router.push(`/admin/temporadas/${created.id}`);
    } else if (initialData) {
      await updateSeason(initialData.id, payload);
      toast.success("Temporada actualizada correctamente");
      router.push("/admin/temporadas");
    }
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "No se pudo guardar la temporada.");
  }
}

  async function handleActivate() {
    if (!initialData) return;
    setActivating(true);
    await activateSeason(initialData.id);
    setActivating(false);
    router.refresh();
  }

async function handleDelete() {
  if (!initialData) return;
  try {
    await deleteSeason(initialData.id);
    toast.success(`Temporada "${initialData.name}" eliminada`);
    router.push("/admin/temporadas");
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "No se pudo eliminar la temporada.");
  }
}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="font-heading text-3xl text-foreground">
            {mode === "create" ? "Nueva temporada" : initialData?.name}
          </h1>
          <div className="flex gap-2">
            {mode === "edit" && initialData && (
              <>
                <SeasonPreviewModal season={{ ...initialData, colors, heroImage, bannerImage, featuredProductIds }} />
                {initialData.status !== "activa" && (
                  <Button type="button" variant="secondary" onClick={handleActivate} disabled={activating}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {activating ? "Activando..." : "Activar temporada"}
                  </Button>
                )}
                <Button type="button" variant="outline" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </>
            )}
            <Button type="submit">Guardar</Button>
          </div>
        </div>

        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="hero">Hero y Banner</TabsTrigger>
            <TabsTrigger value="colores">Colores</TabsTrigger>
            <TabsTrigger value="productos">Productos destacados</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="flex flex-col gap-4 max-w-lg pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la temporada</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Navidad 2026" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="collectionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colección vinculada</FormLabel>
<Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingCollections}>
  <FormControl>
    <SelectTrigger>
      <SelectValue placeholder="Selecciona una colección" />
    </SelectTrigger>
  </FormControl>
  <SelectContent>
    {collections.map((c) => (
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha inicio</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha fin</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="ctaText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto del botón (CTA)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ver colección" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ctaLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enlace del botón</FormLabel>
                  <FormControl>
                    <Input placeholder="/coleccion/navidad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="hero" className="flex flex-col gap-6 max-w-lg pt-4">
            <FormField
              control={form.control}
              name="heroTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título del hero</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Duerme como un sueño esta Navidad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heroSubtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtítulo del hero</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Descubre la colección navideña" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SingleImageUploader label="Imagen del Hero" value={heroImage} onChange={setHeroImage} />
            <SingleImageUploader label="Banner" value={bannerImage} onChange={setBannerImage} />
          </TabsContent>

          <TabsContent value="colores" className="pt-4">
            <SeasonColorEditor colors={colors} onChange={setColors} />
          </TabsContent>

          <TabsContent value="productos" className="pt-4">
            <Label className="mb-2 block">
              Solo puedes destacar productos que pertenecen a la colección vinculada.
            </Label>
            <ProductPicker
              selectedIds={featuredProductIds}
              onChange={setFeaturedProductIds}
              filterIds={collectionProductIds}
            />
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
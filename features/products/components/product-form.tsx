"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { getCollections } from "@/features/collections/services/collections.service";
import type { Collection } from "@/features/collections/types";
import { useVariantMatrix } from "../hooks/use-variant-matrix";
import { createProduct, updateProduct, deleteProduct } from "../services/products.service";
import { ProductInfoSubmodule } from "./product-info-submodule";
import { ProductVariantsSubmodule } from "./product-variants-submodule";
import { ProductCollectionSubmodule } from "./product-collection-submodule";
import { ProductConfigSubmodule } from "./product-config-submodule";
import { ProductSeoSubmodule } from "./product-seo-submodule";
import {
  DELIVERY_TIME_OPTIONS,
  SHIPPING_METHOD_OPTIONS,
  WARRANTY_OPTIONS,
  type Product,
  type ProductStatus,
  type ProductVisibility,
} from "../types";

interface ProductFormProps {
  mode: "create" | "edit";
  initialData?: Product;
}

export function ProductForm({ mode, initialData }: ProductFormProps) {
  const router = useRouter();

  // Categories & Collections
  const { categories, loading: loadingCategories } = useCategories();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loadingCollections, setLoadingCollections] = useState(true);

  // Form State
  const [name, setName] = useState(initialData?.name ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [basePrice, setBasePrice] = useState(initialData?.basePrice ?? 0);
  const [status, setStatus] = useState<ProductStatus>(initialData?.status ?? "borrador");
  const [totalStock, setTotalStock] = useState(initialData?.totalStock ?? 10);
  const [weightKg, setWeightKg] = useState<number | undefined>(initialData?.weightKg ?? 0.35);

  const [brand, setBrand] = useState(initialData?.brand ?? "Maro's Pijamas");
  const [sku, setSku] = useState(initialData?.sku ?? "");
  const [isOffer, setIsOffer] = useState(initialData?.isOffer ?? false);
  const [freeShipping, setFreeShipping] = useState(initialData?.freeShipping ?? false);

  const [images, setImages] = useState<string[]>(initialData?.images ?? []);
  const [collectionIds, setCollectionIds] = useState<string[]>(initialData?.collectionIds ?? []);
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? ["satín", "pijama", "mujer"]);

  // Config State
  const [featuredHome, setFeaturedHome] = useState(initialData?.featuredHome ?? false);
  const [allowCustomization, setAllowCustomization] = useState(initialData?.allowCustomization ?? true);
  const [visibility, setVisibility] = useState<ProductVisibility>(initialData?.visibility ?? "publico");
  const [trackInventory, setTrackInventory] = useState(initialData?.trackInventory ?? true);
  const [deliveryTime, setDeliveryTime] = useState<string>(
    initialData?.deliveryTime ?? DELIVERY_TIME_OPTIONS[0]
  );
  const [shippingMethod, setShippingMethod] = useState<string>(
    initialData?.shippingMethod ?? SHIPPING_METHOD_OPTIONS[0]
  );
  const [warrantyPeriod, setWarrantyPeriod] = useState<string>(
    initialData?.warrantyPeriod ?? WARRANTY_OPTIONS[0]
  );

  // SEO State
  const [seoTitle, setSeoTitle] = useState(initialData?.seo?.title ?? "");
  const [seoSlug, setSeoSlug] = useState(initialData?.seo?.slug ?? "");
  const [seoDescription, setSeoDescription] = useState(initialData?.seo?.description ?? "");
  const [keywords, setKeywords] = useState("pijama satin, pijamas de mujer, maros pijamas");
  const [seoSocialImageUrl, setSeoSocialImageUrl] = useState<string | undefined>(
    initialData?.seo?.socialImage
  );

  // Variant Matrix
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
    initialData?.sizes ?? ["S", "M", "L"],
    initialData?.colors ?? [
      { name: "Beige Satín", hex: "#E8D8C8" },
      { name: "Verde Oliva", hex: "#555829" },
    ],
    initialData?.variants ?? []
  );

  // Dialogs & Submitting state
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadCollections() {
      try {
        setLoadingCollections(true);
        const data = await getCollections();
        if (mounted) setCollections(data);
      } catch {
        if (mounted) toast.error("No se pudieron cargar las colecciones.");
      } finally {
        if (mounted) setLoadingCollections(false);
      }
    }
    loadCollections();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("El nombre del producto es requerido.");
      return;
    }

    if (!categoryId) {
      toast.error("Por favor selecciona una categoría.");
      return;
    }

    if (basePrice <= 0) {
      toast.error("El precio base debe ser mayor a 0 COP.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        categoryId,
        description: description.trim(),
        basePrice,
        status,
        featuredHome,
        allowCustomization,
        deliveryTime,
        seo: {
          title: seoTitle.trim() || name.trim(),
          description: seoDescription.trim() || description.trim(),
          slug: seoSlug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          socialImage: seoSocialImageUrl,
        },
        images,
        variants: variants.map((v) => ({
          size: v.size,
          colorName: v.colorName,
          colorHex: v.colorHex,
          sku: v.sku || `${sku}-${v.size}-${v.colorName.slice(0, 3).toUpperCase()}`,
          stock: v.stock,
          image: v.image,
        })),
        collectionIds,
      };

      if (mode === "create") {
        await createProduct(payload);
        toast.success("Producto creado exitosamente.");
      } else if (initialData) {
        await updateProduct(initialData.id, payload);
        toast.success("Producto actualizado correctamente.");
      }

      router.push("/admin/productos");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar el producto.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!initialData) return;
    try {
      await deleteProduct(initialData.id);
      toast.success(`El producto "${initialData.name}" fue eliminado.`);
      router.push("/admin/productos");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar el producto.");
    }
  };

  const isEditing = mode === "edit";

  return (
    <form onSubmit={handleSaveProduct} className="space-y-6 pb-12">
      {/* Global Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#EBE9DF] pb-5">
        <div className="space-y-1">
          <Link
            href="/admin/productos"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[#555829] transition-colors mb-1 font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Volver a productos
          </Link>
          <h1 className="font-heading font-serif text-2xl font-bold tracking-tight text-[#34351f]">
            {isEditing ? `Editar: ${name || initialData?.name}` : "Nuevo producto"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {isEditing
              ? "Modifica la información, catálogo, stock y configuración SEO del producto."
              : "Crea un nuevo producto para añadirlo al catálogo de la tienda pública."}
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(true)}
              className="bg-white border-[#EBE9DF] text-red-600 hover:bg-red-50 hover:border-red-200 gap-1.5 text-xs h-9"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/admin/productos")}
            disabled={saving}
            className="bg-[#F2F2EC] hover:bg-[#e6e6de] text-[#34351f] border-0 text-xs h-9 px-4 font-medium"
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            disabled={saving}
            className="bg-[#555829] hover:bg-[#444620] text-white text-xs h-9 px-4 font-medium shadow-xs gap-1.5"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isEditing ? "Guardar cambios" : "Guardar producto"}
          </Button>
        </div>
      </div>

      {/* Tabs Navigation Bar (ONLY 5 SUBMODULES) */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="bg-[#FAF9F5] border border-[#EBE9DF] p-1 rounded-xl flex flex-wrap h-auto gap-1 mb-6">
          <TabsTrigger
            value="info"
            className="rounded-lg text-xs font-medium px-4 py-2 text-[#34351f] data-[state=active]:bg-[#555829] data-[state=active]:text-white data-[state=active]:shadow-xs transition-colors"
          >
            Información
          </TabsTrigger>
          <TabsTrigger
            value="variants"
            className="rounded-lg text-xs font-medium px-4 py-2 text-[#34351f] data-[state=active]:bg-[#555829] data-[state=active]:text-white data-[state=active]:shadow-xs transition-colors"
          >
            Variantes
          </TabsTrigger>
          <TabsTrigger
            value="collection"
            className="rounded-lg text-xs font-medium px-4 py-2 text-[#34351f] data-[state=active]:bg-[#555829] data-[state=active]:text-white data-[state=active]:shadow-xs transition-colors"
          >
            Colección
          </TabsTrigger>
          <TabsTrigger
            value="config"
            className="rounded-lg text-xs font-medium px-4 py-2 text-[#34351f] data-[state=active]:bg-[#555829] data-[state=active]:text-white data-[state=active]:shadow-xs transition-colors"
          >
            Configuración
          </TabsTrigger>
          <TabsTrigger
            value="seo"
            className="rounded-lg text-xs font-medium px-4 py-2 text-[#34351f] data-[state=active]:bg-[#555829] data-[state=active]:text-white data-[state=active]:shadow-xs transition-colors"
          >
            SEO
          </TabsTrigger>
        </TabsList>

        {/* SUBMÓDULO 1: INFORMACIÓN */}
        <TabsContent value="info" className="focus-visible:outline-none">
          <ProductInfoSubmodule
            name={name}
            setName={setName}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            description={description}
            setDescription={setDescription}
            basePrice={basePrice}
            setBasePrice={setBasePrice}
            status={status}
            setStatus={setStatus}
            totalStock={totalStock}
            setTotalStock={setTotalStock}
            weightKg={weightKg}
            setWeightKg={setWeightKg}
            brand={brand}
            setBrand={setBrand}
            sku={sku}
            setSku={setSku}
            isOffer={isOffer}
            setIsOffer={setIsOffer}
            freeShipping={freeShipping}
            setFreeShipping={setFreeShipping}
            images={images}
            setImages={setImages}
            collectionIds={collectionIds}
            setCollectionIds={setCollectionIds}
            tags={tags}
            setTags={setTags}
            categories={categories}
            collections={collections}
            loadingCategories={loadingCategories}
            loadingCollections={loadingCollections}
          />
        </TabsContent>

        {/* SUBMÓDULO 2: VARIANTES */}
        <TabsContent value="variants" className="focus-visible:outline-none">
          <ProductVariantsSubmodule
            sizes={sizes}
            colors={colors}
            variants={variants}
            basePrice={basePrice}
            onAddSize={addSize}
            onRemoveSize={removeSize}
            onAddColor={addColor}
            onRemoveColor={removeColor}
            onUpdateVariant={updateVariant}
          />
        </TabsContent>

        {/* SUBMÓDULO 3: COLECCIÓN */}
        <TabsContent value="collection" className="focus-visible:outline-none">
          <ProductCollectionSubmodule
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            collectionIds={collectionIds}
            setCollectionIds={setCollectionIds}
            tags={tags}
            setTags={setTags}
            brand={brand}
            setBrand={setBrand}
            categories={categories}
            collections={collections}
            loadingCategories={loadingCategories}
            loadingCollections={loadingCollections}
          />
        </TabsContent>

        {/* SUBMÓDULO 4: CONFIGURACIÓN */}
        <TabsContent value="config" className="focus-visible:outline-none">
          <ProductConfigSubmodule
            status={status}
            setStatus={setStatus}
            featuredHome={featuredHome}
            setFeaturedHome={setFeaturedHome}
            allowCustomization={allowCustomization}
            setAllowCustomization={setAllowCustomization}
            visibility={visibility}
            setVisibility={setVisibility}
            trackInventory={trackInventory}
            setTrackInventory={setTrackInventory}
            totalStock={totalStock}
            setTotalStock={setTotalStock}
            deliveryTime={deliveryTime}
            setDeliveryTime={setDeliveryTime}
            shippingMethod={shippingMethod}
            setShippingMethod={setShippingMethod}
            warrantyPeriod={warrantyPeriod}
            setWarrantyPeriod={setWarrantyPeriod}
          />
        </TabsContent>

        {/* SUBMÓDULO 5: SEO */}
        <TabsContent value="seo" className="focus-visible:outline-none">
          <ProductSeoSubmodule
            seoTitle={seoTitle}
            setSeoTitle={setSeoTitle}
            seoSlug={seoSlug}
            setSeoSlug={setSeoSlug}
            seoDescription={seoDescription}
            setSeoDescription={setSeoDescription}
            keywords={keywords}
            setKeywords={setKeywords}
            seoSocialImageUrl={seoSocialImageUrl}
            setSeoSocialImageUrl={setSeoSocialImageUrl}
            productName={name}
          />
        </TabsContent>
      </Tabs>

      {/* Dialog para Eliminar */}
      {isEditing && (
        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="¿Eliminar producto?"
          description={`¿Estás seguro de eliminar el producto "${initialData?.name}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          destructive
          onConfirm={handleDeleteProduct}
        />
      )}
    </form>
  );
}
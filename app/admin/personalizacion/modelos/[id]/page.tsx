"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { getCatalogItems } from "@/features/customization/services/customization.service";
import { ModeloEditForm } from "@/features/customization/components/modelo-edit-form";
import { Skeleton } from "@/components/ui/skeleton";
import type { CatalogItem } from "@/features/customization/types";

export default function ModeloEditarPage() {
  const params = useParams<{ id: string }>();
  const [modelItem, setModelItem] = useState<CatalogItem | null | undefined>(undefined);

  useEffect(() => {
    if (params.id) {
      getCatalogItems("modelos").then((items) => {
        const found = items.find((m) => m.id === params.id);
        setModelItem(found ?? null);
      });
    }
  }, [params.id]);

  if (modelItem === undefined) return <Skeleton className="h-96 w-full rounded-xl max-w-5xl mx-auto" />;
  if (modelItem === null) notFound();

  return <ModeloEditForm modelItem={modelItem} />;
}

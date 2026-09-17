"use client";

import { use } from "react";
import { ClientDetail } from "@/features/clients/components/client-detail";

export default function ClienteDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <ClientDetail id={resolvedParams.id} />;
}
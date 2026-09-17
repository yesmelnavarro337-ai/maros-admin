"use client";

import { use } from "react";
import { QuotationDetailPage } from "@/features/quotations/components/quotation-detail-page";

export default function CotizacionDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <QuotationDetailPage id={resolvedParams.id} />;
}
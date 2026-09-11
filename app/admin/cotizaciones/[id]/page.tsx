import { notFound } from "next/navigation";
import { getQuotationByIdServer } from "@/features/quotations/services/quotations.server";
import { QuotationDetailPage } from "@/features/quotations/components/quotation-detail-page";

export default async function CotizacionDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quotation = await getQuotationByIdServer(id);

  if (!quotation) notFound();

  return <QuotationDetailPage quotation={quotation} />;
}
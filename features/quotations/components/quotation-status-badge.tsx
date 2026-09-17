import { Badge } from "@/components/ui/badge";
import type { QuotationStatus } from "../types";

const config: Record<QuotationStatus, { label: string; className: string }> = {
  nueva: {
    label: "Nueva",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  },
  en_revision: {
    label: "En revisión",
    className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  },
  contactada: {
    label: "Contactada",
    className: "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100",
  },
  cotizada: {
    label: "Cotizada",
    className: "bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200",
  },
  aceptada: {
    label: "Aceptada",
    className: "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200",
  },
  rechazada: {
    label: "Rechazada",
    className: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
  },
  archivada: {
    label: "Archivada",
    className: "bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200",
  },
};

export function QuotationStatusBadge({ status }: { status: QuotationStatus }) {
  const item = config[status] ?? config.nueva;
  return (
    <Badge variant="outline" className={`font-medium px-2.5 py-0.5 rounded-full border transition-colors ${item.className}`}>
      {item.label}
    </Badge>
  );
}
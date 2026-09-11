import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { RecentQuotationRow } from "../types";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

// Mapeo temporal de estados — se reemplaza por el badge completo con colores
// (igual al que ya existe en features/quotations) cuando migremos ese
// módulo en su propia fase, para no adelantarnos a tocar código de una
// fase futura desde aquí.
const STATUS_LABELS: Record<string, string> = {
  Nueva: "Nueva",
  EnRevision: "En revisión",
  Contactada: "Contactada",
  Cotizada: "Cotizada",
  Aceptada: "Aceptada",
  Rechazada: "Rechazada",
  Archivada: "Archivada",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}

export function RecentQuotationsTable({ quotations }: { quotations: RecentQuotationRow[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-medium">Cotizaciones recientes</CardTitle>
        <Link href="/admin/cotizaciones" className="text-xs text-primary hover:underline">
          Ver todos →
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {quotations.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin cotizaciones todavía.</p>
        ) : (
          quotations.map((q) => (
            <Link key={q.id} href={`/admin/cotizaciones/${q.id}`} className="group flex items-center gap-3 py-2 border-b border-border last:border-0 hover:bg-accent/40 rounded-md px-2 -mx-2 transition-colors">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                  {initials(q.clientName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground truncate group-hover:underline">{q.clientName}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {q.productSummary} · {formatDate(q.date)}
                </p>
              </div>
              <Badge variant="secondary">{STATUS_LABELS[q.status] ?? q.status}</Badge>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
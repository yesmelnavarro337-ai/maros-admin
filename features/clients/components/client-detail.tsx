import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuotationStatusBadge } from "@/features/quotations/components/quotation-status-badge";
import type { ClientWithQuotations } from "../types";

export function ClientDetail({ client }: { client: ClientWithQuotations }) {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="font-heading text-3xl text-foreground">{client.name}</h1>
        <p className="text-muted-foreground mt-1">
          {client.phone} · {client.city}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Historial de cotizaciones ({client.quotations.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {client.quotations.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin cotizaciones registradas.</p>
          ) : (
            client.quotations.map((q) => (
              <div key={q.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                <div>
                  <p className="text-sm text-foreground">{q.productNames.join(", ")}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(q.createdAt).toLocaleDateString("es-CO")}
                  </p>
                </div>
                <QuotationStatusBadge status={q.status} />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
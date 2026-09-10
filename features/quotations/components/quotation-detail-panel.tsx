"use client";

import { useState } from "react";
import { MessageCircle, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { QuotationStatusSelect } from "./quotation-status-select";
import { updateQuotationStatus, getWhatsAppLink } from "../services/quotations.service";
import { toast } from "@/lib/toast";
import type { Quotation, QuotationStatus } from "../types";

interface QuotationDetailPanelProps {
  quotation: Quotation | null;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (id: string, status: QuotationStatus) => void;
}

export function QuotationDetailPanel({
  quotation,
  onOpenChange,
  onStatusChange,
}: QuotationDetailPanelProps) {
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);

  if (!quotation) return null;

  async function handleStatusChange(status: QuotationStatus) {
    if (!quotation) return;
    try {
      await updateQuotationStatus(quotation.id, status);
      onStatusChange(quotation.id, status);
      toast.success("Estado de la cotización actualizado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar el estado.");
    }
  }

  async function handleWhatsApp() {
    if (!quotation) return;
    setSendingWhatsApp(true);
    try {
      const { link } = await getWhatsAppLink(quotation.id);
      window.open(link, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo generar el mensaje.");
    } finally {
      setSendingWhatsApp(false);
    }
  }

  return (
    <Sheet open={!!quotation} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-heading">{quotation.clientName}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-4 pb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Estado</p>
            <QuotationStatusSelect value={quotation.status} onChange={handleStatusChange} />
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Productos solicitados</p>
            <div className="flex flex-col gap-2">
              {quotation.items.map((item, i) => (
                <div key={i} className="rounded-md bg-secondary p-3">
                  <p className="text-sm text-foreground">{item.productName}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-1">
                    {item.modelo && <span>Modelo: {item.modelo}</span>}
                    {item.size && <span>Talla: {item.size}</span>}
                    {item.color && <span>Color: {item.color}</span>}
                    {item.tela && <span>Tela: {item.tela}</span>}
                    {item.estampado && <span>Estampado: {item.estampado}</span>}
                    {item.bordado && <span>Bordado: {item.bordado}</span>}
                    <span>Cantidad: {item.quantity}</span>
                  </div>
                  {item.embroideryText && (
                    <p className="text-xs text-foreground mt-1.5 italic">
                      Texto a bordar: &quot;{item.embroideryText}&quot;
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {quotation.notes && (
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Notas</p>
              <p className="text-sm text-foreground">{quotation.notes}</p>
            </div>
          )}

          {quotation.referenceImages.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Imágenes de referencia del cliente</p>
              <div className="grid grid-cols-3 gap-2">
                {quotation.referenceImages.map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={img}
                    alt={`Referencia ${i + 1}`}
                    className="aspect-square rounded-md object-cover border border-border"
                  />
                ))}
              </div>
            </div>
          )}

          <Button className="mt-2" onClick={handleWhatsApp} disabled={sendingWhatsApp}>
            {sendingWhatsApp ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <MessageCircle className="h-4 w-4 mr-2" />
            )}
            Abrir WhatsApp
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
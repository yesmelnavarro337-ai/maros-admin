"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Calendar,
  Hash,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  ImageOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentCard } from "@/components/shared/content-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QuotationStatusBadge } from "./quotation-status-badge";
import { QuotationStatusSelect } from "./quotation-status-select";
import { getWhatsAppLink, updateQuotationStatus } from "../services/quotations.service";
import { toast } from "@/lib/toast";
import type { Quotation, QuotationItem, QuotationStatus } from "../types";

const money = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function shortId(id: string) {
  return id.slice(0, 8).toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function itemSubtotal(item: QuotationItem) {
  return item.estimatedUnitPrice * item.quantity;
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground">
      {children}
    </span>
  );
}

export function QuotationDetailPage({ quotation: initial }: { quotation: Quotation }) {
  const [quotation, setQuotation] = useState<Quotation>(initial);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);

  const total = quotation.items.reduce((sum, item) => sum + itemSubtotal(item), 0);

  async function handleStatusChange(status: QuotationStatus) {
    setUpdatingStatus(true);
    try {
      const updated = await updateQuotationStatus(quotation.id, status);
      if (updated) setQuotation(updated);
      toast.success("Estado de la solicitud actualizado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar el estado.");
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleWhatsApp() {
    setSendingWhatsApp(true);
    try {
      const { link } = await getWhatsAppLink(quotation.id);
      window.open(link, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo generar el mensaje de WhatsApp.");
    } finally {
      setSendingWhatsApp(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/cotizaciones"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a cotizaciones
          </Link>
          <h1 className="font-heading text-3xl text-foreground mt-2">Detalle de cotización</h1>
        </div>
        <QuotationStatusBadge status={quotation.status} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Información de la solicitud</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Folio:</span>
              <span className="font-medium text-foreground">COT-{shortId(quotation.id)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Solicitada:</span>
              <span className="text-foreground">{formatDate(quotation.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Canal de contacto:</span>
              <span className="font-medium text-foreground">WhatsApp</span>
            </div>
            {quotation.notes && (
              <p className="rounded-md bg-secondary px-3 py-2 text-foreground mt-1">
                {quotation.notes}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Cliente</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a
                href={`https://wa.me/${quotation.clientPhone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {quotation.clientPhone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">Ciudad de entrega: {quotation.clientCity || "No indicada"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Cliente desde:</span>
              <span className="text-foreground">Solicitud #{quotation.clientId.slice(0, 6).toUpperCase()}</span>
            </div>
          </CardContent>
        </Card>

        <ContentCard noPadding>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Personalización</TableHead>
                <TableHead>Bordado</TableHead>
                <TableHead>Talla</TableHead>
                <TableHead className="text-right">Cant.</TableHead>
                <TableHead className="text-right">Estimado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotation.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Sin productos en esta cotización.
                  </TableCell>
                </TableRow>
              ) : (
                quotation.items.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-3 min-w-[180px]">
                        <div className="relative h-12 w-12 shrink-0 rounded-md bg-secondary overflow-hidden flex items-center justify-center">
                          {item.productImage ? (
                            <Image src={item.productImage} alt={item.productName} fill sizes="48px" className="object-cover" />
                          ) : (
                            <ImageOff className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.productName}</p>
                          {item.modelo && <p className="text-xs text-muted-foreground">Modelo: {item.modelo}</p>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1.5 min-w-[140px]">
                        {item.tela && <Chip>{item.tela}</Chip>}
                        {item.color && <Chip>{item.color}</Chip>}
                        {item.estampado && <Chip>{item.estampado}</Chip>}
                        {!item.tela && !item.color && !item.estampado && (
                          <span className="text-xs text-muted-foreground">Estándar</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {item.bordado ? <Chip>{item.bordado}</Chip> : <span className="text-xs text-muted-foreground">No</span>}
                    </TableCell>
                    <TableCell className="text-foreground">{item.size}</TableCell>
                    <TableCell className="text-right text-foreground">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      <p className="text-sm text-foreground">{money.format(itemSubtotal(item))}</p>
                      {item.estimatedUnitPrice > 0 && (
                        <p className="text-xs text-muted-foreground">{money.format(item.estimatedUnitPrice)} / unidad</p>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {total > 0 && (
            <div className="flex flex-col border-t border-border px-5 py-4">
              <span className="text-sm text-muted-foreground">Total estimado</span>
              <span className="font-heading text-xl text-foreground">{money.format(total)}</span>
            </div>
          )}
        </ContentCard>

        {quotation.referenceImages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Imágenes de referencia del cliente</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3">
              {quotation.referenceImages.map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={img}
                  alt={`Referencia ${i + 1}`}
                  className="aspect-square w-full rounded-md object-cover border border-border"
                />
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardContent className="pt-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Estado de la solicitud</span>
            <QuotationStatusSelect value={quotation.status} onChange={handleStatusChange} />
          </div>
          <Button size="lg" onClick={handleWhatsApp} disabled={sendingWhatsApp || updatingStatus}>
            {sendingWhatsApp ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <MessageCircle className="h-4 w-4 mr-2" />
            )}
            Abrir Chat de WhatsApp
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
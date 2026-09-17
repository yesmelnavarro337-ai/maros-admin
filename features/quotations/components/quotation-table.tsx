"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageCircle, ChevronRight, Loader2, Mail, Phone, Package } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { QuotationStatusBadge } from "./quotation-status-badge";
import { getWhatsAppLink } from "../services/quotations.service";
import { toast } from "@/lib/toast";
import type { Quotation } from "../types";

interface QuotationTableProps {
  quotations: Quotation[];
  onRowClick: (quotation: Quotation) => void;
}

function initials(name: string) {
  if (!name) return "CL";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function formatProductAttributes(item?: Quotation["items"][0]): string {
  if (!item) return "";
  const parts: string[] = [];
  if (item.size) parts.push(`Talla ${item.size}`);
  if (item.color) parts.push(`Color ${item.color}`);
  if (item.modelo) parts.push(item.modelo);
  if (item.tela) parts.push(item.tela);

  if (parts.length === 0 && item.selectedOptions && item.selectedOptions.length > 0) {
    return item.selectedOptions.map((o) => o.name).slice(0, 2).join(" • ");
  }

  return parts.join(" • ");
}

export function QuotationTable({ quotations, onRowClick }: QuotationTableProps) {
  const [loadingWhatsAppId, setLoadingWhatsAppId] = useState<string | null>(null);

  async function handleWhatsAppClick(e: React.MouseEvent, quotation: Quotation) {
    e.stopPropagation();
    setLoadingWhatsAppId(quotation.id);
    try {
      const { link, phoneNumber } = await getWhatsAppLink(quotation.id);
      let targetUrl = link;

      if (!targetUrl && quotation.clientPhone) {
        const cleanPhone = quotation.clientPhone.replace(/\D/g, "");
        const formattedPhone = cleanPhone.startsWith("57") ? cleanPhone : `57${cleanPhone}`;
        const defaultMsg = `Hola ${quotation.clientName}, te escribimos de Maros Pijamas para enviarte la cotización de tu solicitud.`;
        targetUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(defaultMsg)}`;
      }

      if (targetUrl) {
        window.open(targetUrl, "_blank", "noopener,noreferrer");
      } else {
        toast.error("No se pudo obtener el enlace de WhatsApp.");
      }
    } catch {
      if (quotation.clientPhone) {
        const cleanPhone = quotation.clientPhone.replace(/\D/g, "");
        const formattedPhone = cleanPhone.startsWith("57") ? cleanPhone : `57${cleanPhone}`;
        const defaultMsg = `Hola ${quotation.clientName}, te escribimos de Maros Pijamas para enviarte la cotización de tu solicitud.`;
        window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(defaultMsg)}`, "_blank", "noopener,noreferrer");
      } else {
        toast.error("No hay un número de teléfono válido registrado.");
      }
    } finally {
      setLoadingWhatsAppId(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border/60 bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3.5">Cliente</TableHead>
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3.5">Producto & Especificaciones</TableHead>
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3.5">Fecha de Solicitud</TableHead>
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3.5">Estado</TableHead>
            <TableHead className="text-right font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3.5">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                No se encontraron cotizaciones.
              </TableCell>
            </TableRow>
          ) : (
            quotations.map((q) => {
              const mainItem = q.items[0];
              const attributes = formatProductAttributes(mainItem);
              const formattedDate = new Date(q.createdAt).toLocaleDateString("es-CO", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
              const formattedTime = new Date(q.createdAt).toLocaleTimeString("es-CO", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <TableRow
                  key={q.id}
                  className="cursor-pointer hover:bg-accent/40 transition-colors group"
                  onClick={() => onRowClick(q)}
                >
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 shrink-0 border border-primary/20 bg-primary/10">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                          {initials(q.clientName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                          {q.clientName}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 truncate">
                          {q.clientEmail && (
                            <span className="flex items-center gap-1 truncate" title={q.clientEmail}>
                              <Mail className="h-3 w-3 shrink-0 opacity-70" />
                              <span className="truncate">{q.clientEmail}</span>
                            </span>
                          )}
                          {q.clientPhone && (
                            <span className="flex items-center gap-1 shrink-0">
                              <Phone className="h-3 w-3 shrink-0 opacity-70" />
                              <span>{q.clientPhone}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 rounded-md overflow-hidden bg-muted border border-border/80 flex items-center justify-center">
                        {mainItem?.productImage && mainItem.productImage !== "/placeholder.png" ? (
                          <Image
                            src={mainItem.productImage}
                            alt={mainItem.productName || "Producto"}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <Package className="h-5 w-5 text-muted-foreground/60" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {mainItem?.productName || "Cotización Personalizada"}
                          {q.items.length > 1 && (
                            <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                              (+{q.items.length - 1} más)
                            </span>
                          )}
                        </p>
                        {attributes && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {attributes}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-3.5">
                    <div className="text-sm text-foreground font-medium">{formattedDate}</div>
                    <div className="text-xs text-muted-foreground">{formattedTime}</div>
                  </TableCell>

                  <TableCell className="py-3.5">
                    <QuotationStatusBadge status={q.status} />
                  </TableCell>

                  <TableCell className="py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                        title="Contactar vía WhatsApp"
                        onClick={(e) => handleWhatsAppClick(e, q)}
                        disabled={loadingWhatsAppId === q.id}
                      >
                        {loadingWhatsAppId === q.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MessageCircle className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => onRowClick(q)}
                        title="Ver detalle de cotización"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

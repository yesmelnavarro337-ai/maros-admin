"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Mail,
  MessageCircle,
  Phone,
  MapPin,
  Package,
  Send,
  XCircle,
  CheckCircle2,
  Sparkles,
  User,
  Loader2,
  FileText,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { QuotationStatusBadge } from "./quotation-status-badge";
import { getQuotationById, updateQuotationStatus, getWhatsAppLink } from "../services/quotations.service";
import { toast } from "@/lib/toast";
import type { Quotation, QuotationStatus } from "../types";

const money = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function shortId(id: string) {
  return id ? id.slice(0, 8).toUpperCase() : "";
}

function formatDate(iso?: string) {
  if (!iso) return "No disponible";
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function initials(name: string) {
  if (!name) return "CL";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// Timeline steps configuration
const TIMELINE_STEPS: { key: QuotationStatus; label: string; description: string }[] = [
  { key: "nueva", label: "Nueva Solicitud", description: "Recibida en el sistema" },
  { key: "en_revision", label: "En Revisión", description: "Verificando disponibilidad" },
  { key: "contactada", label: "Cliente Contactado", description: "Conversación en curso" },
  { key: "cotizada", label: "Cotización Enviada", description: "Propuesta de precio lista" },
  { key: "aceptada", label: "Aceptada", description: "Pedido confirmado por cliente" },
];

export function QuotationDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchQuotation = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getQuotationById(id);
      if (data) {
        setQuotation(data);
      } else {
        toast.error("No se encontró la cotización solicitada.");
      }
    } catch {
      toast.error("Error al cargar los datos de la cotización.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuotation();
  }, [fetchQuotation]);

  async function handleStatusUpdate(newStatus: QuotationStatus) {
    if (!quotation) return;
    setActionLoading(`status-${newStatus}`);
    try {
      const updated = await updateQuotationStatus(quotation.id, newStatus);
      if (updated) {
        setQuotation(updated);
        toast.success(`Estado actualizado a: ${newStatus.replace("_", " ")}`);
      }
    } catch {
      toast.error("No se pudo actualizar el estado.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleSendQuotation() {
    if (!quotation) return;
    setActionLoading("send-quote");
    try {
      await updateQuotationStatus(quotation.id, "cotizada");
      const { link } = await getWhatsAppLink(quotation.id);
      
      let targetUrl = link;
      if (!targetUrl && quotation.clientPhone) {
        const cleanPhone = quotation.clientPhone.replace(/\D/g, "");
        const formattedPhone = cleanPhone.startsWith("57") ? cleanPhone : `57${cleanPhone}`;
        const defaultMsg = `Hola ${quotation.clientName}, ¡tu cotización para MAROS Pijamas está lista! 🚀 Podemos confirmar tu pedido cuando desees.`;
        targetUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(defaultMsg)}`;
      }

      setQuotation((prev) => (prev ? { ...prev, status: "cotizada" } : null));
      toast.success("Cotización marcada como Enviada 🚀");

      if (targetUrl) {
        window.open(targetUrl, "_blank", "noopener,noreferrer");
      }
    } catch {
      toast.error("Error al procesar el envío de la cotización.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleContactClient() {
    if (!quotation) return;
    setActionLoading("contact-client");
    try {
      if (quotation.status === "nueva") {
        await updateQuotationStatus(quotation.id, "contactada");
        setQuotation((prev) => (prev ? { ...prev, status: "contactada" } : null));
      }

      const cleanPhone = quotation.clientPhone.replace(/\D/g, "");
      const formattedPhone = cleanPhone.startsWith("57") ? cleanPhone : `57${cleanPhone}`;
      const defaultMsg = `Hola ${quotation.clientName}, me comunico desde MAROS Pijamas respecto a tu solicitud de cotización.`;
      window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(defaultMsg)}`, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("No se pudo abrir el chat de WhatsApp.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCancelQuotation() {
    if (!quotation) return;
    setActionLoading("cancel-quote");
    try {
      const updated = await updateQuotationStatus(quotation.id, "rechazada");
      if (updated) {
        setQuotation(updated);
        toast.success("Cotización cancelada / rechazada.");
      }
    } catch {
      toast.error("Error al cancelar la cotización.");
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-8 w-64 rounded-md" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
          <div>
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-destructive mx-auto opacity-80" />
        <h2 className="text-2xl font-bold font-serif">Cotización no encontrada</h2>
        <p className="text-muted-foreground text-sm">La cotización especificada no existe o fue eliminada.</p>
        <Button onClick={() => router.push("/admin/cotizaciones")}>Volver a Cotizaciones</Button>
      </div>
    );
  }

  const mainItem = quotation.items[0];
  const totalPrice = quotation.items.reduce(
    (acc, item) => acc + (item.estimatedUnitPrice || 0) * item.quantity,
    0
  );

  // Status step calculation index
  const statusStepIndexMap: Record<QuotationStatus, number> = {
    nueva: 0,
    en_revision: 1,
    contactada: 2,
    cotizada: 3,
    aceptada: 4,
    rechazada: -1,
    archivada: -1,
  };
  const currentStepIdx = statusStepIndexMap[quotation.status] ?? 0;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-16">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div className="space-y-1">
          <Link
            href="/admin/cotizaciones"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a la lista
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-foreground">
              Cotización #{shortId(quotation.id)}
            </h1>
            <QuotationStatusBadge status={quotation.status} />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Creada: {formatDate(quotation.createdAt)}</span>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Product, Notes, Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Details Card */}
          <Card className="border border-border/70 shadow-xs overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/60 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-semibold">Detalle del Producto Solicitado</CardTitle>
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {quotation.items.length} {quotation.items.length === 1 ? "ítem" : "ítems"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-6">
              {quotation.items.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-5 pb-5 border-b border-border/40 last:border-0 last:pb-0">
                  <div className="relative h-28 w-28 shrink-0 rounded-lg overflow-hidden bg-muted border border-border/80 flex items-center justify-center">
                    {item.productImage && item.productImage !== "/placeholder.png" ? (
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    ) : (
                      <Package className="h-8 w-8 text-muted-foreground/50" />
                    )}
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{item.productName}</h3>
                        <p className="text-xs text-muted-foreground">Cantidad: {item.quantity} unidades</p>
                      </div>
                      {item.estimatedUnitPrice > 0 && (
                        <div className="text-left sm:text-right">
                          <span className="text-xs text-muted-foreground">Precio estimado</span>
                          <p className="text-lg font-bold text-primary font-mono">
                            {money.format(item.estimatedUnitPrice * item.quantity)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Specifications Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-muted/40 p-3 rounded-md text-xs">
                      {item.size && (
                        <div>
                          <span className="text-muted-foreground block">Talla:</span>
                          <span className="font-semibold text-foreground">{item.size}</span>
                        </div>
                      )}
                      {item.color && (
                        <div>
                          <span className="text-muted-foreground block">Color:</span>
                          <span className="font-semibold text-foreground">{item.color}</span>
                        </div>
                      )}
                      {item.modelo && (
                        <div>
                          <span className="text-muted-foreground block">Modelo:</span>
                          <span className="font-semibold text-foreground">{item.modelo}</span>
                        </div>
                      )}
                      {item.tela && (
                        <div>
                          <span className="text-muted-foreground block">Tela:</span>
                          <span className="font-semibold text-foreground">{item.tela}</span>
                        </div>
                      )}
                      {item.estampado && (
                        <div>
                          <span className="text-muted-foreground block">Estampado:</span>
                          <span className="font-semibold text-foreground">{item.estampado}</span>
                        </div>
                      )}
                      {item.bordado && (
                        <div>
                          <span className="text-muted-foreground block">Bordado:</span>
                          <span className="font-semibold text-foreground">{item.bordado}</span>
                        </div>
                      )}
                    </div>

                    {item.embroideryText && (
                      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-2.5 rounded-md text-xs">
                        <span className="font-semibold text-amber-800 dark:text-amber-300">Texto de Bordado Personalizado:</span>{" "}
                        <span className="italic text-amber-900 dark:text-amber-200">"{item.embroideryText}"</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Reference Images */}
              {quotation.referenceImages && quotation.referenceImages.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-border/50">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Imágenes de Referencia Adjuntas
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {quotation.referenceImages.map((img, index) => (
                      <a
                        key={index}
                        href={img}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative h-20 w-20 rounded-md overflow-hidden border border-border group hover:ring-2 hover:ring-primary transition-all"
                      >
                        <Image src={img} alt={`Referencia ${index + 1}`} fill className="object-cover" sizes="80px" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <ExternalLink className="h-4 w-4 text-white" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Featured Customer Message */}
          {quotation.notes && (
            <Card className="border-l-4 border-l-primary bg-primary/5 dark:bg-primary/10 border-t border-r border-b border-border/60 shadow-xs">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-primary font-medium text-sm">
                  <FileText className="h-4 w-4" />
                  <span>Mensaje / Notas del Cliente</span>
                </div>
                <p className="text-sm text-foreground italic leading-relaxed pl-6 border-l-2 border-primary/30">
                  "{quotation.notes}"
                </p>
              </CardContent>
            </Card>
          )}

          {/* Status Timeline Card */}
          <Card className="border border-border/70 shadow-xs">
            <CardHeader className="bg-muted/30 border-b border-border/60 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-semibold">Historial de Estados y Seguimiento</CardTitle>
                </div>
                {quotation.updatedAt && (
                  <span className="text-xs text-muted-foreground">
                    Último cambio: {formatDate(quotation.updatedAt)}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {quotation.status === "rechazada" ? (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-lg p-4 text-center space-y-1">
                  <XCircle className="h-6 w-6 text-rose-600 mx-auto" />
                  <p className="font-semibold text-sm">Esta cotización fue rechazada / cancelada</p>
                  <p className="text-xs text-rose-600">Puedes reabrirla cambiando el estado desde las acciones rápidas.</p>
                </div>
              ) : (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/80">
                  {TIMELINE_STEPS.map((step, idx) => {
                    const isCompleted = idx < currentStepIdx;
                    const isCurrent = idx === currentStepIdx;

                    return (
                      <div key={step.key} className="relative flex items-start gap-4 group">
                        {/* Node circle */}
                        <div
                          className={`absolute -left-6 top-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isCurrent
                              ? "bg-primary border-primary text-primary-foreground shadow-xs ring-4 ring-primary/20"
                              : isCompleted
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "bg-background border-muted-foreground/30 text-transparent"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : isCurrent ? (
                            <div className="h-1.5 w-1.5 rounded-full bg-white" />
                          ) : null}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => handleStatusUpdate(step.key)}
                              disabled={actionLoading !== null}
                              className={`text-sm font-semibold text-left hover:underline transition-colors ${
                                isCurrent
                                  ? "text-primary font-bold"
                                  : isCompleted
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {step.label}
                            </button>
                            {isCurrent && (
                              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                                Estado Actual
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3): Client Info & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions Sticky Panel */}
          <Card className="border border-border/80 shadow-sm sticky top-6 bg-gradient-to-b from-card to-muted/20">
            <CardHeader className="border-b border-border/60 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-base font-semibold">Acciones Rápidas</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Responde y gestiona la cotización en 1 clic
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 space-y-3">
              {/* Send Quote button */}
              <Button
                size="lg"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition-all justify-start h-11"
                onClick={handleSendQuotation}
                disabled={actionLoading !== null}
              >
                {actionLoading === "send-quote" ? (
                  <Loader2 className="h-4 w-4 mr-2.5 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2.5" />
                )}
                🚀 Enviar Cotización
              </Button>

              {/* Contact client WhatsApp button */}
              <Button
                size="lg"
                variant="outline"
                className="w-full border-teal-300 text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/30 justify-start h-11"
                onClick={handleContactClient}
                disabled={actionLoading !== null}
              >
                {actionLoading === "contact-client" ? (
                  <Loader2 className="h-4 w-4 mr-2.5 animate-spin" />
                ) : (
                  <MessageCircle className="h-4 w-4 mr-2.5" />
                )}
                💬 Contactar Cliente
              </Button>

              {/* Cancel quote button */}
              {quotation.status !== "rechazada" && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 justify-start h-9 text-xs"
                  onClick={handleCancelQuotation}
                  disabled={actionLoading !== null}
                >
                  {actionLoading === "cancel-quote" ? (
                    <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 mr-2" />
                  )}
                  ✕ Cancelar Cotización
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Customer Info Card */}
          <Card className="border border-border/70 shadow-xs">
            <CardHeader className="bg-muted/30 border-b border-border/60 pb-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-semibold">Datos del Cliente</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                <Avatar className="h-11 w-11 border border-primary/20 bg-primary/10">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                    {initials(quotation.clientName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h4 className="font-semibold text-foreground truncate">{quotation.clientName}</h4>
                  <p className="text-xs text-muted-foreground">ID: {shortId(quotation.clientId)}</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                {quotation.clientEmail && (
                  <div className="flex items-center gap-2.5 text-foreground">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="truncate">{quotation.clientEmail}</span>
                  </div>
                )}

                <div className="flex items-center gap-2.5 text-foreground">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <a
                    href={`https://wa.me/${quotation.clientPhone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    {quotation.clientPhone}
                  </a>
                </div>

                <div className="flex items-center gap-2.5 text-foreground">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{quotation.clientCity || "Ciudad no especificada"}</span>
                </div>

                <div className="flex items-center gap-2.5 text-foreground pt-1">
                  <MessageCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Canal originario: <strong className="text-foreground">WhatsApp / Web</strong></span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
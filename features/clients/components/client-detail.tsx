"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  FileText,
  MessageCircle,
  CheckCircle2,
  User,
  Edit,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getClientById } from "../services/clients.service";
import { ClientFormModal } from "./client-form-modal";
import { QuotationStatusBadge } from "@/features/quotations/components/quotation-status-badge";
import type { ClientWithQuotations } from "../types";

const money = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function initials(name: string) {
  if (!name) return "CL";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function formatDateFull(iso?: string) {
  if (!iso) return "No disponible";
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateShort(iso?: string) {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(iso?: string) {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  if (diffDays < 30) return `Hace ${diffDays} días`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return "Hace 1 mes";
  return `Hace ${diffMonths} meses`;
}

export function ClientDetail({ id }: { id: string }) {
  const router = useRouter();
  const [client, setClient] = useState<ClientWithQuotations | null>(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const fetchClient = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getClientById(id);
      if (data) {
        setClient(data);
      }
    } catch {
      setClient(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-8 w-64 rounded-md" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-destructive mx-auto opacity-80" />
        <h2 className="text-2xl font-bold font-serif">Cliente no encontrado</h2>
        <p className="text-muted-foreground text-sm">
          El cliente especificado no existe o no tiene datos disponibles.
        </p>
        <Button onClick={() => router.push("/admin/clientes")}>Volver a Clientes</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-16">
      {/* Top Navigation */}
      <div>
        <Link
          href="/admin/clientes"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver a clientes
        </Link>
      </div>

      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-card p-6 rounded-xl border border-border/70 shadow-xs">
        <div className="flex items-start md:items-center gap-4">
          <Avatar className="h-16 w-16 shrink-0 border-2 border-primary/20 bg-primary/10 shadow-xs">
            <AvatarFallback className="bg-primary/10 text-primary font-serif font-bold text-xl">
              {initials(client.name)}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-foreground">
                {client.name}
              </h1>
              {client.isActive ? (
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium px-2.5 py-0.5 rounded-full text-xs"
                >
                  ● Cliente activo
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-stone-100 text-stone-600 border-stone-200 font-medium px-2.5 py-0.5 rounded-full text-xs"
                >
                  Inactivo
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-0.5">
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <a
                  href={`https://wa.me/${client.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors font-medium"
                >
                  {client.phone}
                </a>
              </span>

              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span>{client.city || "Valledupar, Cesar"}</span>
              </span>

              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span>
                  Registrado el {formatDateFull(client.createdAt)}
                  {client.createdAt && ` · ${timeAgo(client.createdAt)}`}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditModalOpen(true)}
            className="h-9 gap-2 text-xs font-medium border-border/80"
          >
            <Edit className="h-3.5 w-3.5" />
            Editar cliente
          </Button>
        </div>
      </div>

      {/* Metrics Summary Panel (4 Grid Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Contact Info */}
        <Card className="border border-border/60 shadow-xs hover:border-border transition-colors">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Información de contacto
              </span>
              <Phone className="h-4 w-4 text-primary opacity-80" />
            </div>
            <div className="space-y-1 text-xs text-foreground pt-1">
              <p className="font-semibold">{client.phone}</p>
              {client.email ? (
                <p className="text-muted-foreground truncate">{client.email}</p>
              ) : (
                <p className="text-muted-foreground/60 italic">Sin correo registrado</p>
              )}
              <p className="text-muted-foreground">{client.city || "Valledupar, Cesar"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Quotations Summary */}
        <Card className="border border-border/60 shadow-xs hover:border-border transition-colors">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Resumen Cotizaciones
              </span>
              <FileText className="h-4 w-4 text-primary opacity-80" />
            </div>
            <div className="pt-1">
              <p className="text-2xl font-bold font-serif text-foreground">
                {client.quotations.length}
              </p>
              <p className="text-xs text-muted-foreground">
                {client.quotations.length === 1 ? "Cotización registrada" : "Cotizaciones solicitadas"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Messages Summary */}
        <Card className="border border-border/60 shadow-xs hover:border-border transition-colors">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Resumen Mensajes
              </span>
              <MessageCircle className="h-4 w-4 text-emerald-600 opacity-80" />
            </div>
            <div className="pt-1">
              <p className="text-2xl font-bold font-serif text-foreground">
                {client.totalMessages || Math.max(1, client.quotations.length)}
              </p>
              <p className="text-xs text-muted-foreground">Mensajes / contactos de WhatsApp</p>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Status / Last Activity */}
        <Card className="border border-border/60 shadow-xs hover:border-border transition-colors">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Última Actividad
              </span>
              <Clock className="h-4 w-4 text-amber-500 opacity-80" />
            </div>
            <div className="pt-1 space-y-1">
              <p className="text-sm font-bold text-foreground">
                {formatDateShort(client.lastActivityAt || client.createdAt)}
              </p>
              <div className="flex items-center gap-1.5">
                {client.isActive ? (
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] font-semibold px-2 py-0">
                    ★ Activo
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] font-medium">
                    Inactivo
                  </Badge>
                )}
                <span className="text-[11px] text-muted-foreground">
                  {timeAgo(client.lastActivityAt || client.createdAt)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Quotations History Table */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border/70 shadow-xs">
            <CardHeader className="bg-muted/30 border-b border-border/60 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-semibold">Historial de Cotizaciones</CardTitle>
                </div>
                <Link
                  href="/admin/cotizaciones"
                  className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
                >
                  Ver todas
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20 hover:bg-muted/20">
                    <TableHead className="font-semibold text-xs text-muted-foreground py-3"># Folio</TableHead>
                    <TableHead className="font-semibold text-xs text-muted-foreground py-3">Fecha</TableHead>
                    <TableHead className="font-semibold text-xs text-muted-foreground py-3">Producto</TableHead>
                    <TableHead className="font-semibold text-xs text-muted-foreground py-3">Personalización</TableHead>
                    <TableHead className="font-semibold text-xs text-muted-foreground py-3 text-right">Total</TableHead>
                    <TableHead className="font-semibold text-xs text-muted-foreground py-3">Estado</TableHead>
                    <TableHead className="text-right font-semibold text-xs text-muted-foreground py-3">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {client.quotations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                        El cliente aún no tiene cotizaciones registradas.
                      </TableCell>
                    </TableRow>
                  ) : (
                    client.quotations.map((q) => (
                      <TableRow key={q.id} className="hover:bg-accent/40 transition-colors">
                        <TableCell className="py-3 font-mono text-xs font-semibold text-foreground">
                          {q.folio}
                        </TableCell>
                        <TableCell className="py-3 text-xs text-muted-foreground">
                          {formatDateShort(q.createdAt)}
                        </TableCell>
                        <TableCell className="py-3 text-xs font-medium text-foreground">
                          {q.productNames.join(", ") || "Producto"}
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="flex flex-wrap gap-1">
                            {q.customizationBadges.map((badge, bIdx) => (
                              <Badge
                                key={bIdx}
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0 rounded bg-muted text-muted-foreground font-normal border border-border/50"
                              >
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-xs font-semibold font-mono text-right text-foreground">
                          {q.totalAmount > 0 ? money.format(q.totalAmount) : "A convenir"}
                        </TableCell>
                        <TableCell className="py-3">
                          <QuotationStatusBadge status={q.status} />
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <Link href={`/admin/cotizaciones/${q.id}`}>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3): Recent Activity Timeline */}
        <div>
          <Card className="border border-border/70 shadow-xs">
            <CardHeader className="bg-muted/30 border-b border-border/60 pb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-semibold">Actividad Reciente</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              {client.activityLogs.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">
                  Sin actividad registrada aún.
                </p>
              ) : (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/80">
                  {client.activityLogs.map((log) => {
                    let IconComponent = MessageCircle;
                    let iconBg = "bg-emerald-100 text-emerald-700 border-emerald-300";

                    if (log.type === "registered") {
                      IconComponent = User;
                      iconBg = "bg-blue-100 text-blue-700 border-blue-300";
                    } else if (log.type === "quotation_sent") {
                      IconComponent = FileText;
                      iconBg = "bg-amber-100 text-amber-700 border-amber-300";
                    } else if (log.type === "quotation_approved") {
                      IconComponent = CheckCircle2;
                      iconBg = "bg-emerald-100 text-emerald-700 border-emerald-300";
                    }

                    return (
                      <div key={log.id} className="relative flex items-start gap-3 group">
                        {/* Node Icon */}
                        <div
                          className={`absolute -left-6 top-0.5 h-5 w-5 rounded-full border flex items-center justify-center text-[10px] ${iconBg}`}
                        >
                          <IconComponent className="h-3 w-3" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground">{log.title}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                            {log.description}
                          </p>
                          <span className="text-[10px] text-muted-foreground/80 mt-1 block">
                            {formatDateShort(log.timestamp)} · {formatTime(log.timestamp)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Form Modal */}
      <ClientFormModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        clientToEdit={client}
        onSuccess={fetchClient}
      />
    </div>
  );
}
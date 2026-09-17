"use client";

import { Eye, Edit, MoreHorizontal, Phone, Mail, MapPin } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Client } from "../types";

interface ClientTableProps {
  clients: Client[];
  onViewDetail: (client: Client) => void;
  onEdit: (client: Client) => void;
}

function initials(name: string) {
  if (!name) return "CL";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function formatDate(iso: string) {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function ClientTable({ clients, onViewDetail, onEdit }: ClientTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/60 bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3.5">
              Nombre
            </TableHead>
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3.5">
              Teléfono
            </TableHead>
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3.5">
              Ciudad
            </TableHead>
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3.5">
              Cliente desde
            </TableHead>
            <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3.5">
              Estado
            </TableHead>
            <TableHead className="text-right font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3.5">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                No se encontraron clientes registrados.
              </TableCell>
            </TableRow>
          ) : (
            clients.map((client) => (
              <TableRow
                key={client.id}
                className="cursor-pointer hover:bg-accent/40 transition-colors group"
                onClick={() => onViewDetail(client)}
              >
                <TableCell className="py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 shrink-0 border border-primary/20 bg-primary/10">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {initials(client.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {client.name}
                      </p>
                      {client.email && (
                        <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                          <Mail className="h-3 w-3 shrink-0 opacity-70" />
                          <span className="truncate">{client.email}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-3.5">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>{client.phone}</span>
                  </div>
                </TableCell>

                <TableCell className="py-3.5">
                  <div className="flex items-center gap-1.5 text-sm text-foreground">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>{client.city || "Valledupar"}</span>
                  </div>
                </TableCell>

                <TableCell className="py-3.5">
                  <span className="text-sm text-muted-foreground">{formatDate(client.createdAt)}</span>
                </TableCell>

                <TableCell className="py-3.5">
                  {client.isActive ? (
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium px-2.5 py-0.5 rounded-full text-xs"
                    >
                      ● Activo
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-stone-100 text-stone-600 border-stone-200 font-medium px-2.5 py-0.5 rounded-full text-xs"
                    >
                      Inactivo
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      title="Ver detalle del cliente"
                      onClick={() => onViewDetail(client)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      title="Editar datos"
                      onClick={() => onEdit(client)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewDetail(client)}>
                          Ver Historial Completo
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(client)}>
                          Editar Información
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            const cleanPhone = client.phone.replace(/\D/g, "");
                            const formattedPhone = cleanPhone.startsWith("57") ? cleanPhone : `57${cleanPhone}`;
                            window.open(
                              `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
                                `Hola ${client.name}, te escribimos de Maros Pijamas.`
                              )}`,
                              "_blank"
                            );
                          }}
                        >
                          Enviar WhatsApp
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
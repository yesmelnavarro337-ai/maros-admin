"use client";

import { useCallback, useEffect, useState } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ContentCard } from "@/components/shared/content-card";
import { PageHeader } from "@/components/shared/page-header";
import { toast } from "@/lib/toast";
import { getContactMessages, toggleMessageRead, deleteContactMessage } from "../services/contact-messages.service";
import type { ContactMessage } from "../types";

export function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getContactMessages();
      setMessages(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar los mensajes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  async function handleToggleRead(id: string) {
    try {
      await toggleMessageRead(id);
      fetchMessages();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar el mensaje.");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteContactMessage(deleteTarget.id);
      toast.success("Mensaje eliminado");
      setDeleteTarget(null);
      fetchMessages();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar.");
    }
  }

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Mensajes de contacto"
        subtitle={`Mensajes recibidos desde el formulario del sitio público${unreadCount > 0 ? ` — ${unreadCount} sin leer` : ""}`}
      />

      {loading ? (
        <Skeleton className="h-96 w-full rounded-lg" />
      ) : messages.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-16">Sin mensajes todavía.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <ContentCard key={msg.id}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-foreground">{msg.fullName}</p>
                    {!msg.isRead && <Badge className="bg-accent text-accent-foreground">Nuevo</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {msg.phone}{msg.email ? ` · ${msg.email}` : ""} · {new Date(msg.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <p className="text-sm text-foreground mt-2">{msg.message}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => handleToggleRead(msg.id)}
                    title={msg.isRead ? "Marcar como no leído" : "Marcar como leído"}
                  >
                    {msg.isRead ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 hover:text-destructive"
                    onClick={() => setDeleteTarget(msg)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </ContentCard>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar mensaje"
        description={`¿Seguro que quieres eliminar el mensaje de "${deleteTarget?.fullName}"?`}
        confirmText="Eliminar"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
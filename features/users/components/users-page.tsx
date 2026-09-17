"use client";

import { useCallback, useEffect, useState } from "react";
import { Clock, Plus, UserCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ContentCard } from "@/components/shared/content-card";
import { toast } from "@/lib/toast";
import { useAuth } from "@/features/auth/context/auth-context";
import { UserTable } from "./user-table";
import { InviteUserDialog } from "./invite-user-dialog";
import { EditUserDialog } from "./edit-user-dialog";
import {
  getUsers,
  inviteUser,
  updateUser,
  updateUserRole,
  removeUser,
} from "../services/users.service";
import type { AdminUser, UserMetrics, UserRole } from "../types";

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [metrics, setMetrics] = useState<UserMetrics>({
    total: 0,
    active: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminUser | null>(null);
  const [removeTarget, setRemoveTarget] = useState<AdminUser | null>(null);

  const fetchUsersData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getUsers();
      setUsers(result.users);
      setMetrics(result.metrics);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsersData();
  }, [fetchUsersData]);

  async function handleInvite(data: { name: string; email: string; role: UserRole }) {
    try {
      await inviteUser(data);
      toast.success(`Invitación enviada exitosamente a ${data.email}`);
      await fetchUsersData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo invitar al usuario.");
    }
  }

  async function handleRoleChange(id: string, role: UserRole) {
    try {
      await updateUserRole(id, role);
      toast.success("Rol actualizado correctamente");
      await fetchUsersData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo cambiar el rol.");
    }
  }

  async function handleEditSave(id: string, data: { name: string; email: string }) {
    try {
      await updateUser(id, data);
      toast.success("Usuario actualizado correctamente");
      await fetchUsersData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar el usuario.");
    }
  }

  async function confirmRemove() {
    if (!removeTarget) return;
    try {
      await removeUser(removeTarget.id);
      toast.success(`${removeTarget.name} fue eliminado del panel`);
      setRemoveTarget(null);
      await fetchUsersData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar el usuario.");
    }
  }

  if (loading || !currentUser) {
    return (
      <div className="flex flex-col gap-6 p-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-semibold tracking-tight text-foreground">
            Usuarios
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gestiona los usuarios administrativos del sistema
          </p>
        </div>

        <Button
          onClick={() => setInviteOpen(true)}
          className="bg-[#2D4A3E] hover:bg-[#233a30] text-white font-medium shadow-xs w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Invitar usuario
        </Button>
      </div>

      {/* Grid de Métricas (3 Tarjetas) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Usuarios totales */}
        <div className="bg-card border border-border/80 rounded-xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Usuarios totales
            </p>
            <p className="text-3xl font-bold tracking-tight text-foreground mt-1">
              {metrics.total}
            </p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Users className="h-5.5 w-5.5 text-[#2D4A3E]" />
          </div>
        </div>

        {/* Card 2: Activos */}
        <div className="bg-card border border-border/80 rounded-xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Activos
            </p>
            <p className="text-3xl font-bold tracking-tight text-emerald-700 mt-1">
              {metrics.active}
            </p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0">
            <UserCheck className="h-5.5 w-5.5 text-emerald-700" />
          </div>
        </div>

        {/* Card 3: Pendientes */}
        <div className="bg-card border border-border/80 rounded-xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Pendientes
            </p>
            <p className="text-3xl font-bold tracking-tight text-amber-700 mt-1">
              {metrics.pending}
            </p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="h-5.5 w-5.5 text-amber-700" />
          </div>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <ContentCard noPadding className="border border-border/80 shadow-2xs overflow-hidden">
        <UserTable
          users={users}
          currentUserEmail={currentUser.email}
          onRoleChange={handleRoleChange}
          onEdit={setEditTarget}
          onRemove={setRemoveTarget}
        />
      </ContentCard>

      {/* Diálogos Modales */}
      <InviteUserDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onInvite={handleInvite}
      />

      <EditUserDialog
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
        user={editTarget}
        onSave={handleEditSave}
      />

      <ConfirmDialog
        open={!!removeTarget}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title="Eliminar usuario"
        description={`¿Seguro que deseas eliminar a "${removeTarget?.name}" del panel administrativo? El usuario perderá acceso de inmediato.`}
        confirmText="Eliminar usuario"
        onConfirm={confirmRemove}
      />
    </div>
  );
}
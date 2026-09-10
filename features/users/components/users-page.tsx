"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ContentCard } from "@/components/shared/content-card";
import { PageHeader } from "@/components/shared/page-header";
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
import type { AdminUser, UserRole } from "../types";

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminUser | null>(null);
  const [removeTarget, setRemoveTarget] = useState<AdminUser | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handleInvite(data: { name: string; email: string; role: UserRole }) {
    try {
      await inviteUser(data);
      toast.success(`Invitación enviada a ${data.email}`);
      fetchUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo invitar al usuario.");
    }
  }

  async function handleRoleChange(id: string, role: UserRole) {
    try {
      await updateUserRole(id, role);
      toast.success("Rol actualizado");
      fetchUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo cambiar el rol.");
    }
  }

  async function handleEditSave(id: string, data: { name: string; email: string }) {
    try {
      await updateUser(id, data);
      toast.success("Usuario actualizado");
      fetchUsers();
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
      fetchUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar el usuario.");
    }
  }

  if (loading || !currentUser) return <Skeleton className="h-96 w-full rounded-lg" />;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Usuarios"
        subtitle="Gestiona los usuarios administrativos del sistema"
        action={
          <Button onClick={() => setInviteOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Invitar usuario
          </Button>
        }
      />

      <ContentCard noPadding>
        <UserTable
          users={users}
          currentUserEmail={currentUser.email}
          onRoleChange={handleRoleChange}
          onEdit={setEditTarget}
          onRemove={setRemoveTarget}
        />
      </ContentCard>

      <InviteUserDialog open={inviteOpen} onOpenChange={setInviteOpen} onInvite={handleInvite} />
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
        description={`¿Seguro que quieres eliminar a "${removeTarget?.name}" del panel? Perderá acceso inmediatamente.`}
        confirmText="Eliminar"
        onConfirm={confirmRemove}
      />
    </div>
  );
}
import { apiFetch } from "@/lib/api/client-fetcher";
import type { AdminUser, UserRole, UserStatus } from "../types";

interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastAccessAt?: string | null;
}

const STATUS_FROM_API: Record<string, UserStatus> = {
  Activo: "activo",
  Inactivo: "inactivo",
  Pendiente: "pendiente",
};

function adaptUser(u: ApiUser): AdminUser {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role as UserRole,
    status: STATUS_FROM_API[u.status] ?? "pendiente",
    lastAccess: u.lastAccessAt
      ? new Date(u.lastAccessAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
      : "Nunca",
  };
}

export async function getUsers(): Promise<AdminUser[]> {
  const users = await apiFetch<ApiUser[]>("Users");
  return users.map(adaptUser);
}

export async function inviteUser(data: { name: string; email: string; role: UserRole }): Promise<AdminUser> {
  const created = await apiFetch<ApiUser>("Users/invite", {
    method: "POST",
    body: data,
  });
  return adaptUser(created);
}

export async function updateUser(id: string, data: { name: string; email: string }): Promise<AdminUser | undefined> {
  const updated = await apiFetch<ApiUser>(`Users/${id}`, {
    method: "PUT",
    body: data,
  });
  return adaptUser(updated);
}

export async function updateUserRole(id: string, role: UserRole): Promise<AdminUser | undefined> {
  const updated = await apiFetch<ApiUser>(`Users/${id}/role`, {
    method: "PUT",
    body: { role },
  });
  return adaptUser(updated);
}

export async function removeUser(id: string): Promise<void> {
  await apiFetch<void>(`Users/${id}`, { method: "DELETE" });
}
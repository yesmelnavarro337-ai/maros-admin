import { apiFetch } from "@/lib/api/client-fetcher";
import type { AdminUser, UserMetrics, UserRole, UserStatus } from "../types";

interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastAccessAt?: string | null;
}

interface ApiUserListResponse {
  users?: ApiUser[];
  items?: ApiUser[];
  totalCount?: number;
  activeCount?: number;
  pendingCount?: number;
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
    role: (u.role as UserRole) || "Viewer",
    status: STATUS_FROM_API[u.status] ?? "pendiente",
    lastAccess: u.lastAccessAt
      ? new Date(u.lastAccessAt).toLocaleDateString("es-CO", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Nunca",
  };
}

export interface GetUsersResult {
  users: AdminUser[];
  metrics: UserMetrics;
}

export async function getUsers(): Promise<GetUsersResult> {
  const response = await apiFetch<ApiUserListResponse | ApiUser[]>("Users");

  let rawUsers: ApiUser[] = [];
  let total = 0;
  let active = 0;
  let pending = 0;

  if (Array.isArray(response)) {
    rawUsers = response;
    total = rawUsers.length;
    active = rawUsers.filter((u) => u.status === "Activo").length;
    pending = rawUsers.filter((u) => u.status === "Pendiente").length;
  } else if (response && typeof response === "object") {
    rawUsers = response.users || response.items || [];
    total = response.totalCount ?? rawUsers.length;
    active = response.activeCount ?? rawUsers.filter((u) => u.status === "Activo").length;
    pending = response.pendingCount ?? rawUsers.filter((u) => u.status === "Pendiente").length;
  }

  const users = rawUsers.map(adaptUser);

  return {
    users,
    metrics: {
      total,
      active,
      pending,
    },
  };
}

export async function inviteUser(data: { name: string; email: string; role: UserRole }): Promise<AdminUser> {
  const created = await apiFetch<ApiUser>("Users/invite", {
    method: "POST",
    body: data,
  });
  return adaptUser(created);
}

export async function updateUser(id: string, data: { name: string; email: string }): Promise<AdminUser> {
  const updated = await apiFetch<ApiUser>(`Users/${id}`, {
    method: "PUT",
    body: data,
  });
  return adaptUser(updated);
}

export async function updateUserRole(id: string, role: UserRole): Promise<AdminUser> {
  const updated = await apiFetch<ApiUser>(`Users/${id}/role`, {
    method: "PUT",
    body: { role },
  });
  return adaptUser(updated);
}

export async function removeUser(id: string): Promise<void> {
  await apiFetch<void>(`Users/${id}`, { method: "DELETE" });
}
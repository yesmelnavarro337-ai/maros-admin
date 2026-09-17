export type UserRole = "Administrador" | "Viewer" | "Editor";
export type UserStatus = "activo" | "inactivo" | "pendiente";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastAccess: string;
}

export interface UserMetrics {
  total: number;
  active: number;
  pending: number;
}

export const USER_ROLES: UserRole[] = ["Administrador", "Viewer"];
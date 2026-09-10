export type UserRole = "Administrador" | "Editor" | "Viewer";
export type UserStatus = "activo" | "inactivo" | "pendiente";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastAccess: string;
}

export const USER_ROLES: UserRole[] = ["Administrador", "Editor", "Viewer"];
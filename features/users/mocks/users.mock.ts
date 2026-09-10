import type { AdminUser, PermissionMatrix } from "../types";

export const mockUsers: AdminUser[] = [
  { id: "u1", name: "Valentina Maro", email: "valentina@marospijamas.com", role: "Administrador", status: "activo", lastAccess: "Hoy, 10:30 a.m." },
  { id: "u2", name: "Camila Pérez", email: "camila@marospijamas.com", role: "Editor", status: "activo", lastAccess: "Ayer, 03:15 p.m." },
  { id: "u3", name: "Jorge García", email: "jorge@marospijamas.com", role: "Viewer", status: "inactivo", lastAccess: "10 Jul 2026" },
];

export const mockPermissionMatrix: PermissionMatrix = {
  Administrador: {
    "Productos": true,
    "Colecciones y Temporadas": true,
    "Cotizaciones y Clientes": true,
    "Contenido (Galería, Blog, Testimonios)": true,
    "Configuración y Apariencia": true,
    "Usuarios": true,
  },
  Editor: {
    "Productos": true,
    "Colecciones y Temporadas": true,
    "Cotizaciones y Clientes": true,
    "Contenido (Galería, Blog, Testimonios)": true,
    "Configuración y Apariencia": false,
    "Usuarios": false,
  },
  Viewer: {
    "Productos": false,
    "Colecciones y Temporadas": false,
    "Cotizaciones y Clientes": false,
    "Contenido (Galería, Blog, Testimonios)": false,
    "Configuración y Apariencia": false,
    "Usuarios": false,
  },
};
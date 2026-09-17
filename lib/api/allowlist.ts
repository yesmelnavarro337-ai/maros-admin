const GUID = "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}";

type Method = "GET" | "POST" | "PUT" | "DELETE";

interface AllowedRoute {
  method: Method;
  pattern: RegExp;
}

// Solo las rutas explícitamente listadas aquí pueden pasar por el proxy.
// Cualquier otra combinación de método+ruta se rechaza con 404, sin llegar
// nunca al backend real. Se amplía a medida que migramos cada módulo —
// hoy solo Auth está habilitado; el resto se agrega junto con cada fase.
export const ALLOWED_ROUTES: AllowedRoute[] = [
  { method: "GET", pattern: /^Auth\/me$/ },
  { method: "GET", pattern: /^Products(\?.*)?$/ },
  { method: "GET", pattern: /^Products\/.*$/ },
  { method: "POST", pattern: /^Products(\?.*)?$/ },
  { method: "POST", pattern: /^Products\/.*$/ },
  { method: "PUT", pattern: /^Products\/.*$/ },
  { method: "DELETE", pattern: /^Products\/.*$/ },
  { method: "GET", pattern: /^Categories(\?.*)?$/ },
  { method: "GET", pattern: /^Categories\/.*$/ },
  { method: "POST", pattern: /^Categories(\?.*)?$/ },
  { method: "POST", pattern: /^Categories\/.*$/ },
  { method: "PUT", pattern: /^Categories\/.*$/ },
  { method: "DELETE", pattern: /^Categories\/.*$/ },
  { method: "POST", pattern: /^Media\/upload$/ },
  { method: "GET", pattern: /^Collections(\?.*)?$/ },
  { method: "GET", pattern: /^Collections\/.*$/ },
  { method: "POST", pattern: /^Collections(\?.*)?$/ },
  { method: "POST", pattern: /^Collections\/.*$/ },
  { method: "PUT", pattern: /^Collections\/.*$/ },
  { method: "DELETE", pattern: /^Collections\/.*$/ },
  { method: "GET", pattern: /^Seasons$/ },
  { method: "GET", pattern: new RegExp(`^Seasons/${GUID}$`) },
  { method: "POST", pattern: /^Seasons$/ },
  { method: "PUT", pattern: new RegExp(`^Seasons/${GUID}$`) },
  { method: "POST", pattern: new RegExp(`^Seasons/${GUID}/activate$`) },
  { method: "DELETE", pattern: new RegExp(`^Seasons/${GUID}$`) },
  { method: "GET", pattern: /^Dashboard(\?.*)?$/ },
  { method: "GET", pattern: /^Dashboard\/trend(\?.*)?$/ },
  { method: "GET", pattern: /^Quotations(\?.*)?$/ },
  { method: "GET", pattern: /^Quotations\/.*$/ },
  { method: "POST", pattern: /^Quotations(\?.*)?$/ },
  { method: "POST", pattern: /^Quotations\/.*$/ },
  { method: "PUT", pattern: /^Quotations\/.*$/ },
  { method: "DELETE", pattern: /^Quotations\/.*$/ },
  { method: "GET", pattern: /^Customers(\?.*)?$/ },
  { method: "GET", pattern: /^Customers\/.*$/ },
  { method: "POST", pattern: /^Customers(\?.*)?$/ },
  { method: "POST", pattern: /^Customers\/.*$/ },
  { method: "PUT", pattern: /^Customers\/.*$/ },
  { method: "DELETE", pattern: /^Customers\/.*$/ },
  { method: "GET", pattern: /^Customization.*$/ },
  { method: "POST", pattern: /^Customization.*$/ },
  { method: "PUT", pattern: /^Customization.*$/ },
  { method: "DELETE", pattern: /^Customization.*$/ },
  { method: "GET", pattern: /^CustomizationOptions(\?.*)?$/ },
  { method: "POST", pattern: /^CustomizationOptions(\?.*)?$/ },
  { method: "PUT", pattern: /^CustomizationOptions\/.*$/ },
  { method: "DELETE", pattern: /^CustomizationOptions\/.*$/ },
  { method: "GET", pattern: /^Gallery(\?.*)?$/ },
  { method: "POST", pattern: /^Gallery$/ },
  { method: "DELETE", pattern: new RegExp(`^Gallery/${GUID}$`) },
  { method: "GET", pattern: /^ContactMessages$/ },
  { method: "PUT", pattern: new RegExp(`^ContactMessages/${GUID}/read$`) },
  { method: "DELETE", pattern: new RegExp(`^ContactMessages/${GUID}$`) },
  { method: "GET", pattern: /^Blog(\?.*)?$/ },
  { method: "POST", pattern: /^Blog$/ },
  { method: "PUT", pattern: new RegExp(`^Blog/${GUID}$`) },
  { method: "DELETE", pattern: new RegExp(`^Blog/${GUID}$`) },
  { method: "GET", pattern: /^BlogPosts(\?.*)?$/ },
  { method: "GET", pattern: /^BlogPosts\/.*$/ },
  { method: "POST", pattern: /^BlogPosts(\?.*)?$/ },
  { method: "POST", pattern: /^BlogPosts\/.*$/ },
  { method: "PUT", pattern: /^BlogPosts\/.*$/ },
  { method: "DELETE", pattern: /^BlogPosts\/.*$/ },
  { method: "GET", pattern: /^Testimonials(\?.*)?$/ },
  { method: "GET", pattern: /^Testimonials\/.*$/ },
  { method: "POST", pattern: /^Testimonials(\?.*)?$/ },
  { method: "POST", pattern: /^Testimonials\/.*$/ },
  { method: "PUT", pattern: /^Testimonials\/.*$/ },
  { method: "DELETE", pattern: /^Testimonials\/.*$/ },

  { method: "GET", pattern: /^Faq$/ },
  { method: "POST", pattern: /^Faq$/ },
  { method: "PUT", pattern: new RegExp(`^Faq/${GUID}$`) },
  { method: "PUT", pattern: new RegExp(`^Faq/${GUID}/reorder(\\?.*)?$`) },
  { method: "DELETE", pattern: new RegExp(`^Faq/${GUID}$`) },
  { method: "GET", pattern: /^Banners$/ },
  { method: "POST", pattern: /^Banners$/ },
  { method: "PUT", pattern: new RegExp(`^Banners/${GUID}$`) },
  { method: "DELETE", pattern: new RegExp(`^Banners/${GUID}$`) },
  { method: "GET", pattern: /^Users$/ },
  { method: "POST", pattern: /^Users\/invite$/ },
  { method: "PUT", pattern: new RegExp(`^Users/${GUID}$`) },
  { method: "PUT", pattern: new RegExp(`^Users/${GUID}/role$`) },
  { method: "DELETE", pattern: new RegExp(`^Users/${GUID}$`) },
  { method: "GET", pattern: /^Settings(\?.*)?$/ },
  { method: "GET", pattern: /^Settings\/.*$/ },
  { method: "PUT", pattern: /^Settings(\?.*)?$/ },
  { method: "PUT", pattern: /^Settings\/.*$/ },
  { method: "POST", pattern: /^Settings\/.*$/ },
  { method: "GET", pattern: /^admin\/page-headers$/ },
  { method: "PUT", pattern: /^admin\/page-headers\/[a-z]+$/ },
  { method: "GET", pattern: /^public\/invitations\/[A-Za-z0-9_-]+$/ },
  { method: "POST", pattern: /^public\/invitations\/accept$/ },
  { method: "GET", pattern: /^Profile\/me$/ },
  { method: "PUT", pattern: /^Profile$/ },
  { method: "POST", pattern: /^Profile\/change-password$/ },
  { method: "PUT", pattern: /^Profile\/preferences$/ },
  { method: "GET", pattern: /^Profile\/activity-logs$/ },
  { method: "POST", pattern: /^Profile\/request-email-change$/ },
  { method: "POST", pattern: /^Profile\/verify-email-change$/ },
];
export function isRouteAllowed(method: string, path: string): boolean {
  // 1. Elimina la barra inicial "/" si viene incluida
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // 2. Extrae solo la ruta sin parámetros de consulta (ej: "Auth/me?t=123" -> "Auth/me")
  const pathWithoutQuery = cleanPath.split('?')[0];

  return ALLOWED_ROUTES.some(
    (route) =>
      route.method === method.toUpperCase() &&
      (route.pattern.test(cleanPath) || route.pattern.test(pathWithoutQuery))
  );
}

export { GUID };
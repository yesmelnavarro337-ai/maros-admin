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
const ALLOWED_ROUTES: AllowedRoute[] = [
  { method: "GET", pattern: /^Auth\/me$/ },
  { method: "GET", pattern: /^Products(\?.*)?$/ },
  { method: "GET", pattern: new RegExp(`^Products/${GUID}$`) },
  { method: "POST", pattern: /^Products$/ },
  { method: "PUT", pattern: new RegExp(`^Products/${GUID}$`) },
  { method: "DELETE", pattern: new RegExp(`^Products/${GUID}$`) },
  { method: "GET", pattern: /^Categories$/ },
  { method: "POST", pattern: /^Categories$/ },
  { method: "PUT", pattern: new RegExp(`^Categories/${GUID}$`) },
  { method: "DELETE", pattern: new RegExp(`^Categories/${GUID}$`) },
  { method: "POST", pattern: /^Media\/upload$/ },
  { method: "GET", pattern: /^Collections$/ },
  { method: "GET", pattern: new RegExp(`^Collections/${GUID}$`) },
  { method: "POST", pattern: /^Collections$/ },
  { method: "PUT", pattern: new RegExp(`^Collections/${GUID}$`) },
  { method: "POST", pattern: new RegExp(`^Collections/${GUID}/set-default$`) },
  { method: "DELETE", pattern: new RegExp(`^Collections/${GUID}$`) },
  { method: "GET", pattern: /^Seasons$/ },
  { method: "GET", pattern: new RegExp(`^Seasons/${GUID}$`) },
  { method: "POST", pattern: /^Seasons$/ },
  { method: "PUT", pattern: new RegExp(`^Seasons/${GUID}$`) },
  { method: "POST", pattern: new RegExp(`^Seasons/${GUID}/activate$`) },
  { method: "DELETE", pattern: new RegExp(`^Seasons/${GUID}$`) },
  { method: "GET", pattern: /^Quotations(\?.*)?$/ },
  { method: "GET", pattern: new RegExp(`^Quotations/${GUID}$`) },
  { method: "PUT", pattern: new RegExp(`^Quotations/${GUID}/status$`) },
  { method: "GET", pattern: new RegExp(`^Quotations/${GUID}/whatsapp$`) },
  { method: "GET", pattern: /^Customers(\?.*)?$/ },
  { method: "GET", pattern: /^CustomizationOptions$/ },
  { method: "POST", pattern: /^CustomizationOptions$/ },
  { method: "PUT", pattern: new RegExp(`^CustomizationOptions/${GUID}$`) },
  { method: "DELETE", pattern: new RegExp(`^CustomizationOptions/${GUID}$`) },
  { method: "GET", pattern: new RegExp(`^Customers/${GUID}$`) },
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
  { method: "GET", pattern: /^Testimonials$/ },
  { method: "POST", pattern: /^Testimonials$/ },
  { method: "PUT", pattern: new RegExp(`^Testimonials/${GUID}/status$`) },
  { method: "DELETE", pattern: new RegExp(`^Testimonials/${GUID}$`) },

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
  { method: "GET", pattern: /^Settings$/ },
  { method: "PUT", pattern: /^Settings$/ },
  { method: "GET", pattern: /^admin\/page-headers$/ },
  { method: "PUT", pattern: /^admin\/page-headers\/[a-z]+$/ },
  { method: "GET", pattern: /^public\/invitations\/[A-Za-z0-9_-]+$/ },
  { method: "POST", pattern: /^public\/invitations\/accept$/ },

];
export function isRouteAllowed(method: string, path: string): boolean {
  return ALLOWED_ROUTES.some(
    (route) => route.method === method && route.pattern.test(path)
  );
}

export { GUID };
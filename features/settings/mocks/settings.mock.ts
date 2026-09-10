import type { SiteSettings } from "../types";

export const mockSiteSettings: SiteSettings = {
  general: {
    siteName: "Maro's Pijamas",
    description: "Pijamas hechas a mano con los mejores materiales",
    currency: "COP - Peso Colombiano",
    timezone: "UTC-05:00 Bogotá",
    language: "Español",
    maintenanceMode: false,
  },
  social: {
    instagram: "@marospijamas",
    facebook: "facebook.com/marospijamas",
    tiktok: "",
  },
  whatsapp: {
    phoneNumber: "+57 300 133 4567",
    defaultMessage: "¡Hola! Me interesa hacer un pedido de pijamas personalizadas.",
  },
  email: {
    fromName: "Maro's Pijamas",
    fromEmail: "hola@marospijamas.com",
    notifyNewQuotation: true,
  },
  seo: {
    metaTitle: "Maro's Pijamas — Pijamas personalizadas hechas a mano",
    metaDescription: "Descubre nuestra colección exclusiva de pijamas personalizadas. Calidad premium, envío a todo Colombia.",
  },
  legal: {
    termsUrl: "/legal/terminos",
    privacyUrl: "/legal/privacidad",
    returnsPolicy: "Aceptamos devoluciones dentro de los primeros 15 días con la prenda sin uso.",
  },
  domain: {
    customDomain: "marospijamas.com",
    sslEnabled: true,
  },
  backups: {
    autoBackupEnabled: true,
    frequency: "semanal",
    lastBackupDate: "2026-08-03",
  },
  security: {
    twoFactorEnabled: false,
    sessionTimeoutMinutes: 60,
  },
};
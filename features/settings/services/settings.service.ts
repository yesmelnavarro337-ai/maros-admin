import { apiFetch } from "@/lib/api/client-fetcher";
import type { SiteSettings } from "../types";
import type { HomeSection } from "@/features/appearance/types";

interface ApiSiteSettings {
  siteName?: string;
  description?: string;
  currency?: string;
  timezone?: string;
  language?: string;
  dateFormat?: string;
  maintenanceMode?: boolean;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  homeSections?: HomeSection[] | null;

  instagram?: string | null;
  facebook?: string | null;
  tikTok?: string | null;
  whatsapp?: string | null;
  youtube?: string | null;
  twitter?: string | null;

  whatsappNumber?: string;
  whatsappDefaultMessage?: string;
  whatsappButtonImageUrl?: string | null;
  whatsappPosition?: "right" | "left";
  whatsappButtonEnabled?: boolean;

  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  businessHours?: string;
  mapImageUrl?: string | null;
  showLocation?: boolean;

  emailFromName?: string;
  emailFromAddress?: string;
  defaultSubject?: string;
  autoReplyMessage?: string;
  notifyNewQuotation?: boolean;

  seoMetaTitle?: string;
  seoMetaDescription?: string;
  keywords?: string;
  canonicalUrl?: string;
  robotsTag?: string;
  seoSocialImageUrl?: string | null;

  legalPrivacyPolicy?: string;
  legalTermsAndConditions?: string;
  legalCookiesPolicy?: string;
  legalTermsUrl?: string;
  legalPrivacyUrl?: string;
  legalReturnsPolicy?: string;

  customDomain?: string;
  wwwRedirect?: boolean;
  serverIp?: string;
  sslEnabled?: boolean;

  autoBackupEnabled?: boolean;
  backupFrequency?: "diaria" | "semanal" | "mensual";
  backupTime?: string;
  backupRetentionDays?: string;
  lastBackupDate?: string | null;
  lastBackupSize?: string | null;

  twoFactorEnabled?: boolean;
  maxLoginAttempts?: number;
  lockoutDurationMinutes?: number;
  securityNotificationsEnabled?: boolean;
  sessionTimeoutMinutes?: number;
}

const DEFAULT_HOME_SECTIONS: HomeSection[] = [
  { id: "hero", label: "Hero principal", enabled: true, order: 1 },
  { id: "active-season", label: "Colección / Temporada activa", enabled: true, order: 2 },
  { id: "featured-products", label: "Productos destacados", enabled: true, order: 3 },
  { id: "testimonials", label: "Testimonios", enabled: true, order: 4 },
  { id: "blog", label: "Últimos artículos del blog", enabled: false, order: 5 },
  { id: "newsletter", label: "Suscripción por correo", enabled: false, order: 6 },
];

function adaptSettings(s: ApiSiteSettings): SiteSettings {
  return {
    general: {
      siteName: s.siteName || "Maros Pijamas",
      description: s.description || "Tienda oficial de pijamas y ropa de descanso",
      currency: s.currency || "COP ($)",
      timezone: s.timezone || "America/Bogota (UTC-5)",
      language: s.language || "Español (Colombia)",
      dateFormat: s.dateFormat || "DD/MM/YYYY",
      maintenanceMode: !!s.maintenanceMode,
      logo: s.logoUrl ?? undefined,
      favicon: s.faviconUrl ?? undefined,
    },
    social: {
      instagram: s.instagram ?? "https://instagram.com/marospijamas",
      facebook: s.facebook ?? "https://facebook.com/marospijamas",
      tiktok: s.tikTok ?? "https://tiktok.com/@marospijamas",
      whatsapp: s.whatsapp ?? "+573013169974",
      youtube: s.youtube ?? "",
      twitter: s.twitter ?? "",
    },
    whatsapp: {
      phoneNumber: s.whatsappNumber || "+573013169974",
      defaultMessage: s.whatsappDefaultMessage || "¡Hola! Me gustaría cotizar pijamas al por mayor.",
      buttonImage: s.whatsappButtonImageUrl ?? undefined,
      position: s.whatsappPosition || "right",
      buttonEnabled: s.whatsappButtonEnabled !== false,
    },
    contact: {
      phone: s.contactPhone || "+57 301 316 9974",
      email: s.contactEmail || "contacto@marospijamas.com",
      address: s.address || "Calle 10 # 43-12, Medellín, Colombia",
      businessHours: s.businessHours || "Lun - Vie: 8:00 AM - 6:00 PM",
      mapImage: s.mapImageUrl ?? undefined,
      showLocation: s.showLocation !== false,
    },
    email: {
      fromName: s.emailFromName || "Maros Pijamas",
      fromEmail: s.emailFromAddress || "ventas@marospijamas.com",
      defaultSubject: s.defaultSubject || "Confirmación de solicitud de cotización",
      autoReplyMessage: s.autoReplyMessage || "Gracias por escribirnos. Procesaremos tu solicitud en breve.",
      notifyNewQuotation: s.notifyNewQuotation !== false,
    },
    seo: {
      metaTitle: s.seoMetaTitle || "Maros Pijamas | Pijamas al por Mayor y Detal",
      metaDescription: s.seoMetaDescription || "Fabricantes de pijamas en Colombia. Diseños exclusivos en satén y algodón.",
      keywords: s.keywords || "pijamas, moda, satén, ropa de descanso, medellín",
      canonicalUrl: s.canonicalUrl || "https://marospijamas.com",
      robotsTag: s.robotsTag || "index, follow",
      language: s.language || "es",
      socialImage: s.seoSocialImageUrl ?? undefined,
    },
    legal: {
      privacyPolicy: s.legalPrivacyPolicy || "Aviso de Privacidad y Tratamiento de Datos Personales...",
      termsAndConditions: s.legalTermsAndConditions || "Términos y Condiciones de Uso del sitio web...",
      cookiesPolicy: s.legalCookiesPolicy || "Política de uso de cookies y almacenamiento local...",
      termsUrl: s.legalTermsUrl || "/terminos",
      privacyUrl: s.legalPrivacyUrl || "/privacidad",
      returnsPolicy: s.legalReturnsPolicy || "/devoluciones",
    },
    domain: {
      customDomain: s.customDomain || "marospijamas.com",
      wwwRedirect: s.wwwRedirect !== false,
      serverIp: s.serverIp || "185.199.108.153",
      sslEnabled: s.sslEnabled !== false,
    },
    backups: {
      autoBackupEnabled: s.autoBackupEnabled !== false,
      frequency: s.backupFrequency || "diaria",
      executionTime: s.backupTime || "02:00 AM",
      retentionDays: s.backupRetentionDays || "30 días",
      lastBackupDate: s.lastBackupDate ? s.lastBackupDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
      lastBackupSize: s.lastBackupSize || "24.5 MB",
    },
    security: {
      twoFactorEnabled: !!s.twoFactorEnabled,
      maxAttempts: s.maxLoginAttempts || 5,
      lockoutDurationMinutes: s.lockoutDurationMinutes || 15,
      securityNotificationsEnabled: s.securityNotificationsEnabled !== false,
      sessionTimeoutMinutes: s.sessionTimeoutMinutes || 60,
      activeSessionsCount: 1,
    },
    appearance: {
      favicon: s.faviconUrl ?? undefined,
      homeSections: s.homeSections ?? DEFAULT_HOME_SECTIONS,
    },
  };
}

function buildApiPayload(settings: SiteSettings) {
  return {
    siteName: settings.general.siteName,
    description: settings.general.description,
    currency: settings.general.currency,
    timezone: settings.general.timezone,
    language: settings.general.language,
    dateFormat: settings.general.dateFormat,
    maintenanceMode: settings.general.maintenanceMode,
    logoUrl: settings.general.logo ?? null,
    faviconUrl: settings.general.favicon ?? settings.appearance.favicon ?? null,
    homeSections: settings.appearance.homeSections,

    instagram: settings.social.instagram || null,
    facebook: settings.social.facebook || null,
    tikTok: settings.social.tiktok || null,
    whatsapp: settings.social.whatsapp || null,
    youtube: settings.social.youtube || null,
    twitter: settings.social.twitter || null,

    whatsappNumber: settings.whatsapp.phoneNumber,
    whatsappDefaultMessage: settings.whatsapp.defaultMessage,
    whatsappButtonImageUrl: settings.whatsapp.buttonImage ?? null,
    whatsappPosition: settings.whatsapp.position,
    whatsappButtonEnabled: settings.whatsapp.buttonEnabled,

    contactPhone: settings.contact.phone,
    contactEmail: settings.contact.email,
    address: settings.contact.address,
    businessHours: settings.contact.businessHours,
    mapImageUrl: settings.contact.mapImage ?? null,
    showLocation: settings.contact.showLocation,

    emailFromName: settings.email.fromName,
    emailFromAddress: settings.email.fromEmail,
    defaultSubject: settings.email.defaultSubject,
    autoReplyMessage: settings.email.autoReplyMessage,
    notifyNewQuotation: settings.email.notifyNewQuotation,

    seoMetaTitle: settings.seo.metaTitle,
    seoMetaDescription: settings.seo.metaDescription,
    keywords: settings.seo.keywords,
    canonicalUrl: settings.seo.canonicalUrl,
    robotsTag: settings.seo.robotsTag,
    seoSocialImageUrl: settings.seo.socialImage ?? null,

    legalPrivacyPolicy: settings.legal.privacyPolicy,
    legalTermsAndConditions: settings.legal.termsAndConditions,
    legalCookiesPolicy: settings.legal.cookiesPolicy,
    legalTermsUrl: settings.legal.termsUrl,
    legalPrivacyUrl: settings.legal.privacyUrl,
    legalReturnsPolicy: settings.legal.returnsPolicy,

    customDomain: settings.domain.customDomain,
    wwwRedirect: settings.domain.wwwRedirect,
    serverIp: settings.domain.serverIp,
    sslEnabled: settings.domain.sslEnabled,

    autoBackupEnabled: settings.backups.autoBackupEnabled,
    backupFrequency: settings.backups.frequency,
    backupTime: settings.backups.executionTime,
    backupRetentionDays: settings.backups.retentionDays,

    twoFactorEnabled: settings.security.twoFactorEnabled,
    maxLoginAttempts: settings.security.maxAttempts,
    lockoutDurationMinutes: settings.security.lockoutDurationMinutes,
    securityNotificationsEnabled: settings.security.securityNotificationsEnabled,
    sessionTimeoutMinutes: settings.security.sessionTimeoutMinutes,
  };
}

export async function getSiteSettings(section?: string): Promise<SiteSettings> {
  const path = section ? `Settings/${section}` : "Settings";
  const settings = await apiFetch<ApiSiteSettings>(path);
  return adaptSettings(settings);
}

export async function updateSiteSettings(settings: SiteSettings, section?: string): Promise<SiteSettings> {
  const path = section ? `Settings/${section}` : "Settings";
  const updated = await apiFetch<ApiSiteSettings>(path, {
    method: "PUT",
    body: buildApiPayload(settings),
  });
  return adaptSettings(updated);
}

export async function createBackupNow(): Promise<{ message: string; lastBackupDate: string; lastBackupSize: string }> {
  return await apiFetch<{ message: string; lastBackupDate: string; lastBackupSize: string }>("Settings/backups/create", {
    method: "POST",
  });
}
import { apiFetch } from "@/lib/api/client-fetcher";
import type { SiteSettings } from "../types";
import type { HomeSection } from "@/features/appearance/types";

interface ApiHomeSectionDto {
  id: string;
  label: string;
  enabled: boolean;
  order: number;
}

interface ApiSiteSettings {
  siteName: string;
  description: string;
  currency: string;
  timezone: string;
  language: string;
  maintenanceMode: boolean;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  homeSections?: ApiHomeSectionDto[] | null;
  instagram?: string | null;
  facebook?: string | null;
  tikTok?: string | null;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  address: string;
  businessHours: string;
  emailFromName: string;
  emailFromAddress: string;
  notifyNewQuotation: boolean;
  seoMetaTitle: string;
  seoMetaDescription: string;
  seoSocialImageUrl?: string | null;
  legalTermsUrl: string;
  legalPrivacyUrl: string;
  legalReturnsPolicy: string;
  customDomain: string;
  sslEnabled: boolean;
  autoBackupEnabled: boolean;
  backupFrequency: string;
  lastBackupDate?: string | null;
  twoFactorEnabled: boolean;
  sessionTimeoutMinutes: number;
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
      siteName: s.siteName,
      description: s.description,
      currency: s.currency,
      timezone: s.timezone,
      language: s.language,
      maintenanceMode: s.maintenanceMode,
      logo: s.logoUrl ?? undefined,
    },
    social: {
      instagram: s.instagram ?? "",
      facebook: s.facebook ?? "",
      tiktok: s.tikTok ?? "",
    },
    whatsapp: {
      phoneNumber: s.whatsappNumber,
      defaultMessage: s.whatsappDefaultMessage,
    },
    contact: {
      address: s.address,
      businessHours: s.businessHours,
    },
    email: {
      fromName: s.emailFromName,
      fromEmail: s.emailFromAddress,
      notifyNewQuotation: s.notifyNewQuotation,
    },
    seo: {
      metaTitle: s.seoMetaTitle,
      metaDescription: s.seoMetaDescription,
      socialImage: s.seoSocialImageUrl ?? undefined,
    },
    legal: {
      termsUrl: s.legalTermsUrl,
      privacyUrl: s.legalPrivacyUrl,
      returnsPolicy: s.legalReturnsPolicy,
    },
    domain: {
      customDomain: s.customDomain,
      sslEnabled: s.sslEnabled,
    },
    backups: {
      autoBackupEnabled: s.autoBackupEnabled,
      frequency: s.backupFrequency as SiteSettings["backups"]["frequency"],
      lastBackupDate: s.lastBackupDate ? s.lastBackupDate.slice(0, 10) : undefined,
    },
    security: {
      twoFactorEnabled: s.twoFactorEnabled,
      sessionTimeoutMinutes: s.sessionTimeoutMinutes,
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
    maintenanceMode: settings.general.maintenanceMode,
    logoUrl: settings.general.logo ?? null,
    faviconUrl: settings.appearance.favicon ?? null,
    homeSections: settings.appearance.homeSections,

    instagram: settings.social.instagram || null,
    facebook: settings.social.facebook || null,
    tikTok: settings.social.tiktok || null,

    whatsappNumber: settings.whatsapp.phoneNumber,
    whatsappDefaultMessage: settings.whatsapp.defaultMessage,

    address: settings.contact.address,
    businessHours: settings.contact.businessHours,

    emailFromName: settings.email.fromName,
    emailFromAddress: settings.email.fromEmail,
    notifyNewQuotation: settings.email.notifyNewQuotation,

    seoMetaTitle: settings.seo.metaTitle,
    seoMetaDescription: settings.seo.metaDescription,
    seoSocialImageUrl: settings.seo.socialImage ?? null,

    legalTermsUrl: settings.legal.termsUrl,
    legalPrivacyUrl: settings.legal.privacyUrl,
    legalReturnsPolicy: settings.legal.returnsPolicy,

    customDomain: settings.domain.customDomain,
    sslEnabled: settings.domain.sslEnabled,

    autoBackupEnabled: settings.backups.autoBackupEnabled,
    backupFrequency: settings.backups.frequency,

    twoFactorEnabled: settings.security.twoFactorEnabled,
    sessionTimeoutMinutes: settings.security.sessionTimeoutMinutes,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await apiFetch<ApiSiteSettings>("Settings");
  return adaptSettings(settings);
}

export async function updateSiteSettings(settings: SiteSettings): Promise<SiteSettings> {
  const updated = await apiFetch<ApiSiteSettings>("Settings", {
    method: "PUT",
    body: buildApiPayload(settings),
  });
  return adaptSettings(updated);
}
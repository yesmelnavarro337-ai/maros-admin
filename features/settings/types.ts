import type { HomeSection } from "@/features/appearance/types";

export interface GeneralSettings {
  siteName: string;
  description: string;
  currency: string;
  timezone: string;
  language: string;
  dateFormat: string;
  maintenanceMode: boolean;
  logo?: string;
  favicon?: string;
}

export interface SocialSettings {
  instagram: string;
  facebook: string;
  tiktok: string;
  whatsapp: string;
  youtube: string;
  twitter: string;
}

export interface WhatsappSettings {
  phoneNumber: string;
  defaultMessage: string;
  buttonImage?: string;
  position: "right" | "left";
  buttonEnabled: boolean;
}

export interface ContactSettings {
  phone: string;
  email: string;
  address: string;
  businessHours: string;
  mapImage?: string;
  showLocation: boolean;
}

export interface EmailSettings {
  fromEmail: string;
  fromName: string;
  defaultSubject: string;
  autoReplyMessage: string;
  notifyNewQuotation: boolean;
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl: string;
  robotsTag: string;
  language: string;
  socialImage?: string;
}

export interface LegalSettings {
  privacyPolicy: string;
  termsAndConditions: string;
  cookiesPolicy: string;
  termsUrl?: string;
  privacyUrl?: string;
  returnsPolicy?: string;
}

export interface DomainSettings {
  customDomain: string;
  wwwRedirect: boolean;
  serverIp: string;
  sslEnabled: boolean;
}

export interface BackupSettings {
  autoBackupEnabled: boolean;
  frequency: "diaria" | "semanal" | "mensual";
  executionTime: string;
  retentionDays: string;
  lastBackupDate?: string;
  lastBackupSize?: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  maxAttempts: number;
  lockoutDurationMinutes: number;
  securityNotificationsEnabled: boolean;
  sessionTimeoutMinutes: number;
  activeSessionsCount: number;
}

export interface AppearanceSettingsSection {
  favicon?: string;
  homeSections: HomeSection[];
}

export interface SiteSettings {
  general: GeneralSettings;
  social: SocialSettings;
  whatsapp: WhatsappSettings;
  contact: ContactSettings;
  email: EmailSettings;
  seo: SeoSettings;
  legal: LegalSettings;
  domain: DomainSettings;
  backups: BackupSettings;
  security: SecuritySettings;
  appearance: AppearanceSettingsSection;
}

export type SettingsSectionKey =
  | "general"
  | "social"
  | "whatsapp"
  | "contact"
  | "email"
  | "seo"
  | "legal"
  | "domain"
  | "backups"
  | "security";

export interface SettingsSectionOption {
  key: SettingsSectionKey;
  slug: string;
  label: string;
  description: string;
}

export const SETTINGS_SECTIONS: SettingsSectionOption[] = [
  { key: "general", slug: "general", label: "General", description: "Información básica y localización del sitio" },
  { key: "social", slug: "redes-sociales", label: "Redes sociales", description: "Enlaces a redes sociales y perfiles de marca" },
  { key: "whatsapp", slug: "whatsapp", label: "WhatsApp", description: "Configuración del botón flotante y respuestas rápidas" },
  { key: "contact", slug: "contacto", label: "Contacto", description: "Datos de contacto, dirección y mapa" },
  { key: "email", slug: "email", label: "Email", description: "Correos corporativos y plantillas de notificación" },
  { key: "seo", slug: "seo", label: "SEO", description: "Meta etiquetas, SERP y posicionamiento web" },
  { key: "legal", slug: "legal", label: "Legal", description: "Políticas de privacidad, términos y ley de cookies" },
  { key: "domain", slug: "dominio", label: "Dominio", description: "Configuración de dominio, DNS y SSL" },
  { key: "backups", slug: "copias-seguridad", label: "Copias de Seguridad", description: "Respaldos automáticos y restauración de BD" },
  { key: "security", slug: "seguridad", label: "Seguridad", description: "2FA, bloqueos, sesiones activas y seguridad" },
];
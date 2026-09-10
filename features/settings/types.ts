export interface GeneralSettings {
  siteName: string;
  description: string;
  currency: string;
  timezone: string;
  language: string;
  maintenanceMode: boolean;
  logo?: string;
}

export interface SocialSettings {
  instagram: string;
  facebook: string;
  tiktok: string;
}

export interface WhatsappSettings {
  phoneNumber: string;
  defaultMessage: string;
}

export interface ContactSettings {
  address: string;
  businessHours: string;
}

export interface EmailSettings {
  fromName: string;
  fromEmail: string;
  notifyNewQuotation: boolean;
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  socialImage?: string;
}

export interface LegalSettings {
  termsUrl: string;
  privacyUrl: string;
  returnsPolicy: string;
}

export interface DomainSettings {
  customDomain: string;
  sslEnabled: boolean;
}

export interface BackupSettings {
  autoBackupEnabled: boolean;
  frequency: "diaria" | "semanal" | "mensual";
  lastBackupDate?: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeoutMinutes: number;
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

export const SETTINGS_SECTIONS: { key: SettingsSectionKey; label: string }[] = [
  { key: "general", label: "General" },
  { key: "social", label: "Redes sociales" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "contact", label: "Contacto" },
  { key: "email", label: "Email" },
  { key: "seo", label: "SEO" },
  { key: "legal", label: "Legal" },
  { key: "domain", label: "Dominio" },
  { key: "backups", label: "Copias de Seguridad" },
  { key: "security", label: "Seguridad" },
];
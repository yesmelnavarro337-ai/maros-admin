"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { getSiteSettings, updateSiteSettings } from "../services/settings.service";
import { SettingsNav } from "./settings-nav";
import { SettingsGeneralPanel } from "./settings-general-panel";
import { SettingsSocialPanel } from "./settings-social-panel";
import { SettingsWhatsappPanel } from "./settings-whatsapp-panel";
import { SettingsContactPanel } from "./settings-contact-panel";
import { SettingsEmailPanel } from "./settings-email-panel";
import { SettingsSeoPanel } from "./settings-seo-panel";
import { SettingsLegalPanel } from "./settings-legal-panel";
import { SettingsDomainPanel } from "./settings-domain-panel";
import { SettingsBackupsPanel } from "./settings-backups-panel";
import { SettingsSecurityPanel } from "./settings-security-panel";
import { SETTINGS_SECTIONS } from "../types";
import type { SettingsSectionKey, SiteSettings } from "../types";

const SLUG_TO_KEY: Record<string, SettingsSectionKey> = {
  general: "general",
  "redes-sociales": "social",
  whatsapp: "whatsapp",
  contacto: "contact",
  email: "email",
  seo: "seo",
  legal: "legal",
  dominio: "domain",
  "copias-seguridad": "backups",
  seguridad: "security",
};

interface SettingsShellProps {
  initialSectionSlug?: string;
}

export function SettingsShell({ initialSectionSlug }: SettingsShellProps) {
  const router = useRouter();
  const pathname = usePathname();

  const activeKeyFromSlug = initialSectionSlug ? SLUG_TO_KEY[initialSectionSlug] : undefined;

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [active, setActive] = useState<SettingsSectionKey>(activeKeyFromSlug || "general");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Detect URL section slug if user navigates via browser back/forward or deep links
    const parts = pathname.split("/").filter(Boolean);
    const lastPart = parts[parts.length - 1];
    if (lastPart && SLUG_TO_KEY[lastPart]) {
      setActive(SLUG_TO_KEY[lastPart]);
    }
  }, [pathname]);

  useEffect(() => {
    getSiteSettings()
      .then(setSettings)
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "No se pudo cargar la configuración.");
      });
  }, []);

  function handleSectionChange(newKey: SettingsSectionKey) {
    setActive(newKey);
    const targetSection = SETTINGS_SECTIONS.find((s) => s.key === newKey);
    if (targetSection) {
      router.push(`/admin/configuracion/${targetSection.slug}`, { scroll: false });
    }
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await updateSiteSettings(settings);
      setSettings(updated);
      toast.success("Configuración guardada exitosamente");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar la configuración.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel() {
    try {
      const fresh = await getSiteSettings();
      setSettings(fresh);
      toast.info("Cambios descartados");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo recargar la configuración.");
    }
  }

  if (!settings) {
    return (
      <div className="flex flex-col gap-6 p-2">
        <Skeleton className="h-10 w-64" />
        <div className="flex flex-col lg:flex-row gap-6">
          <Skeleton className="h-96 w-64 rounded-xl shrink-0" />
          <Skeleton className="h-96 flex-1 rounded-xl" />
        </div>
      </div>
    );
  }

  const activeOption = SETTINGS_SECTIONS.find((s) => s.key === active);

  return (
    <div className="flex flex-col gap-6">
      {/* Header Corporativo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <h1 className="text-3xl font-serif font-semibold tracking-tight text-foreground">
            Configuración del Sistema
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {activeOption ? `${activeOption.label} — ${activeOption.description}` : "Gestiona las opciones globales del sitio web y panel de control"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="bg-[#4a5833] hover:bg-[#3d492a] text-white font-medium"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>

      {/* Contenedor Principal: Sidebar Tabs + Panel de Submódulo */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        <SettingsNav active={active} onChange={handleSectionChange} />

        <div className="flex-1 w-full bg-card border border-border/80 rounded-2xl p-6 shadow-2xs">
          {active === "general" && (
            <SettingsGeneralPanel value={settings.general} onChange={(v) => setSettings({ ...settings, general: v })} />
          )}
          {active === "social" && (
            <SettingsSocialPanel value={settings.social} onChange={(v) => setSettings({ ...settings, social: v })} />
          )}
          {active === "whatsapp" && (
            <SettingsWhatsappPanel value={settings.whatsapp} onChange={(v) => setSettings({ ...settings, whatsapp: v })} />
          )}
          {active === "contact" && (
            <SettingsContactPanel value={settings.contact} onChange={(v) => setSettings({ ...settings, contact: v })} />
          )}
          {active === "email" && (
            <SettingsEmailPanel value={settings.email} onChange={(v) => setSettings({ ...settings, email: v })} />
          )}
          {active === "seo" && (
            <SettingsSeoPanel value={settings.seo} onChange={(v) => setSettings({ ...settings, seo: v })} />
          )}
          {active === "legal" && (
            <SettingsLegalPanel value={settings.legal} onChange={(v) => setSettings({ ...settings, legal: v })} />
          )}
          {active === "domain" && (
            <SettingsDomainPanel value={settings.domain} onChange={(v) => setSettings({ ...settings, domain: v })} />
          )}
          {active === "backups" && (
            <SettingsBackupsPanel value={settings.backups} onChange={(v) => setSettings({ ...settings, backups: v })} />
          )}
          {active === "security" && (
            <SettingsSecurityPanel value={settings.security} onChange={(v) => setSettings({ ...settings, security: v })} />
          )}

          {/* Footer de Acciones */}
          <div className="flex justify-end items-center gap-3 mt-8 pt-5 border-t border-border/80">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#4a5833] hover:bg-[#3d492a] text-white font-medium shadow-xs"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
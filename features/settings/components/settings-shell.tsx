"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { toast } from "@/lib/toast";
import { getSiteSettings, updateSiteSettings } from "../services/settings.service";
import { SettingsNav } from "./settings-nav";
import { SettingsGeneralPanel } from "./settings-general-panel";
import { SettingsSocialPanel } from "./settings-social-panel";
import { SettingsWhatsappPanel } from "./settings-whatsapp-panel";
import { SettingsEmailPanel } from "./settings-email-panel";
import { SettingsSeoPanel } from "./settings-seo-panel";
import { SettingsLegalPanel } from "./settings-legal-panel";
import { SettingsDomainPanel } from "./settings-domain-panel";
import { SettingsBackupsPanel } from "./settings-backups-panel";
import { SettingsSecurityPanel } from "./settings-security-panel";
import type { SettingsSectionKey, SiteSettings } from "../types";

export function SettingsShell() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [active, setActive] = useState<SettingsSectionKey>("general");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSiteSettings()
      .then(setSettings)
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "No se pudo cargar la configuración.");
      });
  }, []);

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await updateSiteSettings(settings);
      setSettings(updated);
      toast.success("Configuración guardada");
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

  if (!settings) return <Skeleton className="h-96 w-full rounded-lg" />;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Configuración" subtitle="Ajustes generales del sitio" />

      <div className="flex flex-col lg:flex-row gap-6">
        <SettingsNav active={active} onChange={setActive} />

        <div className="flex-1 rounded-lg border border-border bg-card p-5">
          {active === "general" && (
            <SettingsGeneralPanel value={settings.general} onChange={(v) => setSettings({ ...settings, general: v })} />
          )}
          {active === "social" && (
            <SettingsSocialPanel value={settings.social} onChange={(v) => setSettings({ ...settings, social: v })} />
          )}
          {active === "whatsapp" && (
            <SettingsWhatsappPanel value={settings.whatsapp} onChange={(v) => setSettings({ ...settings, whatsapp: v })} />
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

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
            <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Guardar cambios"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
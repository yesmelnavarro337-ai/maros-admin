import { getSiteSettings, updateSiteSettings } from "@/features/settings/services/settings.service";
import type { AppearanceSettings } from "../types";

export async function getAppearanceSettings(): Promise<AppearanceSettings> {
  const settings = await getSiteSettings();
  return {
    logo: settings.general.logo,
    favicon: settings.appearance.favicon,
    sections: settings.appearance.homeSections,
  };
}

export async function updateAppearanceSettings(patch: AppearanceSettings): Promise<AppearanceSettings> {
  const current = await getSiteSettings();
  const updated = await updateSiteSettings({
    ...current,
    general: { ...current.general, logo: patch.logo },
    appearance: { favicon: patch.favicon, homeSections: patch.sections },
  });
  return {
    logo: updated.general.logo,
    favicon: updated.appearance.favicon,
    sections: updated.appearance.homeSections,
  };
}
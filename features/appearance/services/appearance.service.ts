import { mockAppearanceSettings } from "../mocks/appearance.mock";
import type { AppearanceSettings } from "../types";

let store: AppearanceSettings = { ...mockAppearanceSettings };

function delay<T>(data: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

export async function getAppearanceSettings(): Promise<AppearanceSettings> {
  return delay({ ...store });
}

export async function updateAppearanceSettings(patch: Partial<AppearanceSettings>): Promise<AppearanceSettings> {
  store = { ...store, ...patch };
  return delay({ ...store });
}
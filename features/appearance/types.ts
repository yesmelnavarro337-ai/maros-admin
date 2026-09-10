export interface HomeSection {
  id: string;
  label: string;
  enabled: boolean;
  order: number;
}

export interface AppearanceSettings {
  logo?: string;
  favicon?: string;
  sections: HomeSection[];
}
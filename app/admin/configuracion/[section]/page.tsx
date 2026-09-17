import { SettingsShell } from "@/features/settings/components/settings-shell";

interface PageProps {
  params: Promise<{
    section: string;
  }>;
}

export default async function ConfiguracionSectionPage({ params }: PageProps) {
  const { section } = await params;
  return <SettingsShell initialSectionSlug={section} />;
}

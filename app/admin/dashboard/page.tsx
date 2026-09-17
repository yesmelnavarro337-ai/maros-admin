import { DashboardView } from "@/features/dashboard/components/dashboard-view";
import { getDashboardSummary } from "@/features/dashboard/services/dashboard.server";

export default async function DashboardPage() {
  const summary = await getDashboardSummary().catch(() => null);

  return <DashboardView initialSummary={summary} />;
}
import { serverApiFetch } from "@/lib/api/server-client";
import type { DashboardSummary } from "../types";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return serverApiFetch<DashboardSummary>("Dashboard");
}

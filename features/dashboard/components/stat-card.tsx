import { Card, CardContent } from "@/components/ui/card";
import type { DashboardStat } from "../types";

export function StatCard({ stat }: { stat: DashboardStat }) {
  const Icon = stat.icon;

  return (
    <Card>
      <CardContent className="pt-5 pb-5 flex flex-col gap-3">
        <div className="rounded-full bg-secondary p-2.5 w-fit">
          <Icon className="h-4 w-4 text-foreground" />
        </div>
        <div>
          <p className="font-heading text-2xl text-foreground">{stat.value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
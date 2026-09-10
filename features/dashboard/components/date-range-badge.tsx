import { Calendar } from "lucide-react";

export function DateRangeBadge() {
  const today = new Date().toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
      <Calendar className="h-4 w-4" />
      {today}
    </div>
  );
}
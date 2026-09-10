import Link from "next/link";
import { CalendarRange } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ActiveSeasonCardProps {
  name: string;
  collection: string;
  collectionId: string;
  startDate: string;
  endDate: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

export function ActiveSeasonCard({ name, collection, collectionId, startDate, endDate }: ActiveSeasonCardProps) {
  return (
    <Card className="bg-primary text-primary-foreground">
      <CardContent className="pt-5 pb-5 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <CalendarRange className="h-3.5 w-3.5" />
          <span className="text-xs uppercase tracking-wide opacity-80">Colección activa</span>
        </div>
        <div>
          <p className="font-heading text-xl">{name}</p>
          <p className="text-sm opacity-80">{collection}</p>
        </div>
        <p className="text-xs opacity-70">
          Activa desde {formatDate(startDate)} hasta {formatDate(endDate)}
        </p>
        <Button asChild size="sm" variant="secondary" className="w-fit mt-1">
          <Link href={`/admin/colecciones/${collectionId}`}>Ver colección</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
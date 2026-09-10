import { Card, CardContent } from "@/components/ui/card";

export function ConversionRateCard({ rate }: { rate: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (rate / 100) * circumference;

  return (
    <Card>
      <CardContent className="pt-5 pb-5 flex items-center gap-3">
        <svg width={84} height={84} className="shrink-0 -rotate-90">
          <circle cx={42} cy={42} r={radius} stroke="var(--secondary)" strokeWidth={7} fill="none" />
          <circle
            cx={42}
            cy={42}
            r={radius}
            stroke="var(--primary)"
            strokeWidth={7}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
          <text
            x={42}
            y={42}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontSize: "16px", fontWeight: 600, fill: "var(--foreground)", transform: "rotate(90deg)", transformOrigin: "42px 42px" }}
          >
            {rate}%
          </text>
        </svg>
        <div>
          <p className="text-sm text-foreground font-medium">Cotizaciones convertidas</p>
          <p className="text-xs text-muted-foreground mt-0.5">Últimos 30 días</p>
        </div>
      </CardContent>
    </Card>
  );
}
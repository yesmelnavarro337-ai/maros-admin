"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getSeasonIcon } from "../utils/season-icon";
import type { Season } from "../types";

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function dayOfYearPercent(dateStr: string) {
  const d = new Date(dateStr);
  const start = new Date(d.getFullYear(), 0, 1);
  const diffDays = (d.getTime() - start.getTime()) / 86400000;
  const isLeap = (d.getFullYear() % 4 === 0 && d.getFullYear() % 100 !== 0) || d.getFullYear() % 400 === 0;
  const daysInYear = isLeap ? 366 : 365;
  return (diffDays / daysInYear) * 100;
}

interface SeasonYearTimelineProps {
  seasons: Season[];
  activeSeasonId?: string;
}

export function SeasonYearTimeline({ seasons, activeSeasonId }: SeasonYearTimelineProps) {
  // Años derivados de los datos reales — no hardcodeados.
  const years = useMemo(() => {
    const set = new Set(seasons.map((s) => new Date(s.startDate).getFullYear()));
    return Array.from(set).sort((a, b) => a - b);
  }, [seasons]);

  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(() =>
    years.includes(currentYear) ? currentYear : years[0] ?? currentYear
  );

  const seasonsInYear = seasons.filter((s) => new Date(s.startDate).getFullYear() === year);
  const yearIndex = years.indexOf(year);

  return (
    <div className="rounded-lg border border-border bg-card p-4 overflow-x-auto">
      <div className="flex items-center justify-between mb-4 min-w-[640px]">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Línea de tiempo {year}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => yearIndex > 0 && setYear(years[yearIndex - 1])}
            disabled={yearIndex <= 0}
            className="rounded p-1 text-muted-foreground hover:bg-secondary disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-foreground w-12 text-center">{year}</span>
          <button
            onClick={() => yearIndex < years.length - 1 && setYear(years[yearIndex + 1])}
            disabled={yearIndex >= years.length - 1}
            className="rounded p-1 text-muted-foreground hover:bg-secondary disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="min-w-[640px]">
        <div className="grid grid-cols-12 text-xs text-muted-foreground pb-2 border-b border-border">
          {MONTHS.map((m) => (
            <span key={m} className="text-center">{m}</span>
          ))}
        </div>

        <div className="relative h-12 mt-3">
          {seasonsInYear.length === 0 ? (
            <p className="text-xs text-muted-foreground absolute inset-0 flex items-center justify-center">
              Sin temporadas programadas en {year}.
            </p>
          ) : (
            seasonsInYear.map((season) => {
              const left = dayOfYearPercent(season.startDate);
              const right = dayOfYearPercent(season.endDate);
              const width = Math.max(right - left, 4);
              const isActive = season.id === activeSeasonId;
              return (
                <div
                  key={season.id}
                  title={`${season.name}: ${season.startDate} — ${season.endDate}`}
                  className="absolute top-0 h-9 rounded-full flex items-center justify-center text-base shadow-sm"
                  style={{
                    left: `${left}%`,
                    width: `${width}%`,
                    backgroundColor: season.colors.primary,
                    outline: isActive ? "2px solid var(--accent)" : "none",
                    outlineOffset: "2px",
                  }}
                >
                  {getSeasonIcon(season)}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
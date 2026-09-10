import type { Season } from "../types";

const ICON_RULES: { keywords: string[]; icon: string }[] = [
  { keywords: ["navidad"], icon: "🎄" },
  { keywords: ["valentin", "valentín", "amor"], icon: "💕" },
  { keywords: ["madre"], icon: "🌸" },
  { keywords: ["padre"], icon: "👔" },
  { keywords: ["halloween"], icon: "🎃" },
  { keywords: ["verano"], icon: "☀️" },
  { keywords: ["invierno"], icon: "❄️" },
  { keywords: ["primavera"], icon: "🌷" },
];

export function getSeasonIcon(season: Pick<Season, "name" | "collectionId">): string {
  const haystack = `${season.name} ${season.collectionId}`.toLowerCase();
  const match = ICON_RULES.find((rule) => rule.keywords.some((k) => haystack.includes(k)));
  return match?.icon ?? "🏷️";
}
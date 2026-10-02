import type { CSSProperties } from "react";

export interface ColorLike {
  primaryHex?: string | null;
  secondaryHex?: string | null;
  isCombined?: boolean | null;
  hex?: string | null;
  colorHex?: string | null;
}

export function getColorPreviewStyle(color: ColorLike): CSSProperties {
  const primary = color.primaryHex || color.colorHex || color.hex || "#6B6832";
  const secondary = color.secondaryHex;
  const isCombined = Boolean(color.isCombined && secondary);

  if (isCombined && secondary) {
    return {
      background: `linear-gradient(135deg, ${primary} 50%, ${secondary} 50%)`,
    };
  }

  return {
    backgroundColor: primary,
  };
}

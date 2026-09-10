"use client";

import { useState } from "react";
import type { SeasonColors } from "../types";

interface SeasonColorTileProps {
  colors: SeasonColors;
  onChange: (colors: SeasonColors) => void;
}

export function SeasonColorTile({ colors, onChange }: SeasonColorTileProps) {
  const [showSecondary, setShowSecondary] = useState(false);

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
        Color principal
      </p>
      <label
        className="relative w-full aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer overflow-hidden"
        style={{ backgroundColor: `${colors.primary}22` }}
      >
        <span className="h-8 w-8 rounded-full border border-border" style={{ backgroundColor: colors.primary }} />
        <input
          type="color"
          value={colors.primary}
          onChange={(e) => onChange({ ...colors, primary: e.target.value })}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </label>

      <button
        type="button"
        onClick={() => setShowSecondary((v) => !v)}
        className="text-xs text-primary hover:underline mt-1.5"
      >
        {showSecondary ? "Ocultar colores secundarios" : "Editar acento y fondo"}
      </button>

      {showSecondary && (
        <div className="flex gap-3 mt-2">
          <div className="flex-1">
            <p className="text-[10px] text-muted-foreground mb-1">Acento</p>
            <input
              type="color"
              value={colors.accent}
              onChange={(e) => onChange({ ...colors, accent: e.target.value })}
              className="h-7 w-7 rounded border border-border cursor-pointer"
            />
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-muted-foreground mb-1">Fondo</p>
            <input
              type="color"
              value={colors.background}
              onChange={(e) => onChange({ ...colors, background: e.target.value })}
              className="h-7 w-7 rounded border border-border cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
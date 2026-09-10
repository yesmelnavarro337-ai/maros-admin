"use client";

import { ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { HomeSection } from "../types";

interface HomeSectionsEditorProps {
  sections: HomeSection[];
  onChange: (sections: HomeSection[]) => void;
}

export function HomeSectionsEditor({ sections, onChange }: HomeSectionsEditorProps) {
  const sorted = [...sections].sort((a, b) => a.order - b.order);

  function toggleSection(id: string, enabled: boolean) {
    onChange(sections.map((s) => (s.id === id ? { ...s, enabled } : s)));
  }

  function move(id: string, direction: "up" | "down") {
    const index = sorted.findIndex((s) => s.id === id);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const reordered = [...sorted];
    const currentOrder = reordered[index].order;
    reordered[index] = { ...reordered[index], order: reordered[targetIndex].order };
    reordered[targetIndex] = { ...reordered[targetIndex], order: currentOrder };
    onChange(reordered);
  }

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((section, index) => (
        <div
          key={section.id}
          className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2.5"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-sm text-foreground flex-1">{section.label}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => move(section.id, "up")}
              disabled={index === 0}
              className="rounded p-1 text-muted-foreground hover:bg-secondary disabled:opacity-30"
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => move(section.id, "down")}
              disabled={index === sorted.length - 1}
              className="rounded p-1 text-muted-foreground hover:bg-secondary disabled:opacity-30"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
          <Switch checked={section.enabled} onCheckedChange={(v) => toggleSection(section.id, v)} />
        </div>
      ))}
    </div>
  );
}
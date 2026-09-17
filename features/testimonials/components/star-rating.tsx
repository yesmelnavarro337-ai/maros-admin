"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StarRating({ value, onChange, readOnly = false, size = "md" }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const starSize = size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-6 w-6" : "h-4 w-4";

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const activeValue = hoverValue !== null ? hoverValue : value;
        const isFilled = star <= activeValue;

        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => !readOnly && setHoverValue(null)}
            className={cn(
              "transition-transform p-0.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#9FA367]",
              readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
            )}
          >
            <Star
              className={cn(
                starSize,
                "transition-colors",
                isFilled
                  ? "fill-[#9FA367] text-[#9FA367]"
                  : "fill-transparent text-[#EBE9DF]"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
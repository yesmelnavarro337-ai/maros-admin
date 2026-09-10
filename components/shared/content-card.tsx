import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ContentCardProps {
  children: ReactNode;
  toolbar?: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function ContentCard({ children, toolbar, className, noPadding = false }: ContentCardProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card overflow-hidden", className)}>
      {toolbar && (
        <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-4 border-b border-border">
          {toolbar}
        </div>
      )}
      <div className={noPadding ? "" : "p-5"}>{children}</div>
    </div>
  );
}
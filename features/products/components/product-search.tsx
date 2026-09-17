import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProductSearch({ value, onChange }: ProductSearchProps) {
  return (
    <div className="relative w-full max-w-sm sm:w-72">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
      <Input
        placeholder="Buscar por nombre, SKU o referencia..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 h-9 text-xs bg-card border-border/80 rounded-lg placeholder:text-muted-foreground/70"
      />
    </div>
  );
}
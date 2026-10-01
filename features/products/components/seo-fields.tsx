import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SeoFieldsProps {
  seoTitle: string;
  seoDescription: string;
  onSeoTitleChange: (value: string) => void;
  onSeoDescriptionChange: (value: string) => void;
}

export function SeoFields({
  seoTitle,
  seoDescription,
  onSeoTitleChange,
  onSeoDescriptionChange,
}: SeoFieldsProps) {
  return (
    <div className="flex flex-col gap-4 max-w-lg">
      <div>
        <Label className="mb-1.5 block">Título SEO</Label>
        <Input
          value={seoTitle}
          onChange={(e) => onSeoTitleChange(e.target.value)}
          placeholder="Ej. Pijama Satín Beige | Maro's Pijamas"
        />
      </div>
      <div>
        <Label className="mb-1.5 block">Meta descripción</Label>
        <Textarea
          value={seoDescription}
          onChange={(e) => onSeoDescriptionChange(e.target.value)}
          placeholder="Descripción breve para motores de búsqueda"
          rows={3}
          maxLength={500}
        />
      </div>
    </div>
  );
}
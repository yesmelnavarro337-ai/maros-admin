import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "./star-rating";
import type { Testimonial } from "../types";

interface TestimonialCardProps {
  testimonial: Testimonial;
  onToggle: () => void;
  onDelete: () => void;
}

export function TestimonialCard({ testimonial, onToggle, onDelete }: TestimonialCardProps) {
  return (
    <Card>
      <CardContent className="pt-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                {testimonial.clientName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground">{testimonial.clientName}</p>
              <StarRating value={testimonial.rating} readOnly />
            </div>
          </div>
          <Badge className={testimonial.status === "publicado" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}>
            {testimonial.status === "publicado" ? "Publicado" : "Oculto"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground italic">&quot;{testimonial.quote}&quot;</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onToggle}>
            {testimonial.status === "publicado" ? "Ocultar" : "Publicar"}
          </Button>
          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={onDelete}>
            Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
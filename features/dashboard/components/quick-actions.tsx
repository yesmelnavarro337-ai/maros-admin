import Link from "next/link";
import { Plus, Layers, Sparkles, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  whatsappNumber: string;
  whatsappMessage: string;
}

export function QuickActions({ whatsappNumber, whatsappMessage }: QuickActionsProps) {
  const cleanPhone = whatsappNumber.replace(/\D/g, "");
  const whatsappHref = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <Card>
      <CardContent className="pt-4 pb-4 flex flex-wrap gap-2">
        <Button variant="secondary" asChild>
          <Link href="/admin/productos/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo producto
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/admin/colecciones">
            <Layers className="h-4 w-4 mr-2" />
            Crear colección
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/admin/temporadas">
            <Sparkles className="h-4 w-4 mr-2" />
            Activar temporada
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4 mr-2" />
            Ver WhatsApp
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
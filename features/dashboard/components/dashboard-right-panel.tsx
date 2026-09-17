"use client";

import Link from "next/link";
import { Plus, PackagePlus, Sparkles, UserPlus, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DashboardRightPanel() {
  return (
    <div className="space-y-6">
      {/* Acciones Rápidas */}
      <Card className="border border-border/80 shadow-2xs">
        <CardHeader className="pb-3">
          <CardTitle className="font-heading text-lg font-semibold text-foreground">
            Acciones rápidas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5">
          <Button
            asChild
            className="w-full justify-start h-11 bg-[#5C5232] text-white hover:bg-[#4A4228] font-medium text-xs rounded-xl shadow-2xs"
          >
            <Link href="/admin/cotizaciones">
              <Plus className="h-4 w-4 mr-2" />
              Nueva cotización
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full justify-start h-11 border-border/80 text-foreground hover:bg-secondary text-xs rounded-xl"
          >
            <Link href="/admin/productos">
              <PackagePlus className="h-4 w-4 mr-2 text-muted-foreground" />
              Agregar producto
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full justify-start h-11 border-border/80 text-foreground hover:bg-secondary text-xs rounded-xl"
          >
            <Link href="/admin/colecciones">
              <Sparkles className="h-4 w-4 mr-2 text-muted-foreground" />
              Crear colección
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full justify-start h-11 border-border/80 text-foreground hover:bg-secondary text-xs rounded-xl"
          >
            <Link href="/admin/usuarios">
              <UserPlus className="h-4 w-4 mr-2 text-muted-foreground" />
              Nuevo usuario
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Card Ilustrada "La magia de cada pijama" */}
      <div className="relative rounded-2xl bg-[#F9F5EC] border border-[#EBE3D3] p-6 overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="h-8 w-8 rounded-full bg-[#EAE2D2] text-[#8C7A4A] flex items-center justify-center">
            <Heart className="h-4 w-4 fill-[#8C7A4A]/20" />
          </div>
          <h3 className="font-heading font-serif text-xl font-medium text-[#4A4028] leading-tight">
            La magia de<br />cada pijama
          </h3>
          <p className="text-xs text-[#7A6C4A] leading-relaxed">
            Gracias por ser parte de Maro&apos;s. Tu trabajo hace que más personas sueñen con sus pijamas.
          </p>
        </div>

        {/* Ilustración Botánica Decorativa (Esquina Inferior Derecha) */}
        <div className="absolute right-2 bottom-2 opacity-30 pointer-events-none">
          <svg width="90" height="110" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 110 C50 70, 80 40, 90 10" stroke="#8C7A4A" strokeWidth="2" strokeLinecap="round" />
            <path d="M50 80 C30 60, 20 40, 15 20" stroke="#8C7A4A" strokeWidth="2" strokeLinecap="round" />
            <path d="M50 90 C70 75, 85 65, 95 45" stroke="#8C7A4A" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M50 60 C35 45, 30 35, 25 15" stroke="#8C7A4A" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="90" cy="10" r="3" fill="#8C7A4A" />
            <circle cx="15" cy="20" r="3" fill="#8C7A4A" />
            <circle cx="95" cy="45" r="2.5" fill="#8C7A4A" />
          </svg>
        </div>
      </div>

      {/* EXCEPCIÓN: OMITIR TARJETA DE SOPORTE SOLICITADA POR EL USUARIO */}
    </div>
  );
}

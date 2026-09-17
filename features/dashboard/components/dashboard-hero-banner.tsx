"use client";

import Image from "next/image";
import { Heart } from "lucide-react";

export function DashboardHeroBanner({ userName = "YESMEL" }: { userName?: string }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
      {/* Left Greeting */}
      <div className="lg:col-span-2 flex flex-col justify-center space-y-2">
        <p className="text-xs font-bold tracking-widest text-[#968452] uppercase">
          BIENVENIDA, {userName.toUpperCase()} 👋
        </p>
        <h1 className="font-heading font-serif text-3xl md:text-4xl text-foreground font-semibold leading-tight">
          Aquí tienes un resumen<br />de tu tienda
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          Gestiona tus cotizaciones, clientes, productos y mucho más desde un solo lugar.
        </p>
      </div>

      {/* Right Hero Image Card */}
      <div className="relative rounded-2xl border border-[#E8DFC9] bg-[#F7F3EB] p-6 flex flex-col justify-between overflow-hidden min-h-[160px]">
        <div className="relative z-10 max-w-[200px]">
          <Heart className="h-4 w-4 text-[#8C7A4A] mb-2 fill-[#8C7A4A]/20" />
          <h2 className="font-heading text-xl text-[#4A4028] font-medium leading-snug">
            Maro&apos;s
          </h2>
          <p className="text-xs text-[#7A6C4A] mt-1 leading-relaxed">
            Pijamas que cuentan historias
          </p>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden rounded-r-2xl pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&auto=format&fit=crop&q=80"
            alt="Pijamas Maro's"
            fill
            className="object-cover object-center opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7F3EB] via-[#F7F3EB]/40 to-transparent" />
        </div>
      </div>
    </div>
  );
}

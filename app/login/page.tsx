import Image from "next/image";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen bg-background flex items-center justify-center p-6 overflow-hidden">
      {/* Elementos decorativos sutiles */}
      <div
        className="absolute -top-16 -left-16 h-64 w-64 rounded-full border-[24px] border-secondary/60 pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full border-[28px] border-secondary/50 pointer-events-none"
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        <Image
          src="/logo.png"
          alt="Maro's Pijamas"
          width={88}
          height={88}
          className="rounded-full mb-4"
        />
        <p className="font-heading text-xl tracking-wide text-foreground">MARO&apos;S</p>
        <p className="text-xs italic text-muted-foreground mb-8">Pijamas</p>

        <div className="w-full rounded-lg border border-border bg-card p-6">
          <h1 className="font-heading text-2xl text-foreground text-center">Bienvenida de nuevo</h1>
          <p className="text-sm text-muted-foreground text-center mt-1 mb-6">
            Inicia sesión para continuar
          </p>

          <LoginForm />
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()} Maro&apos;s Pijamas
        </p>
      </div>
    </main>
  );
}
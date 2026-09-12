import Image from "next/image";
import { AcceptInviteForm } from "@/features/invitations/components/accept-invite-form";

export default async function AcceptInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <main className="relative min-h-screen bg-background flex items-center justify-center p-6 overflow-hidden">
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
          <h1 className="font-heading text-2xl text-foreground text-center">Acepta tu invitación</h1>
          <p className="text-sm text-muted-foreground text-center mt-1 mb-6">
            Crea tu contraseña para acceder al panel
          </p>

          {token ? (
            <AcceptInviteForm token={token} />
          ) : (
            <p className="text-sm text-destructive text-center">
              El enlace de invitación no es válido. Pídele una nueva invitación al administrador.
            </p>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()} Maro&apos;s Pijamas
        </p>
      </div>
    </main>
  );
}
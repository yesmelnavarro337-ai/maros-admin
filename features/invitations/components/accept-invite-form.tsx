"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { acceptInvitation, getInvitationSummary, type InvitationSummary } from "../services/invitation.service";
import { acceptInviteSchema, type AcceptInviteFormValues } from "../schemas/accept-invite.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function AcceptInviteForm({ token }: { token: string }) {
  const router = useRouter();
  const [summary, setSummary] = useState<InvitationSummary | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    let active = true;
    getInvitationSummary(token)
      .then((data) => {
        if (active) setSummary(data);
      })
      .catch((error) => {
        if (active) setLoadError(error instanceof Error ? error.message : "La invitación no es válida.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  const form = useForm<AcceptInviteFormValues>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: AcceptInviteFormValues) {
    try {
      await acceptInvitation(token, values.password);
      toast.success("Cuenta activada con éxito. Ya puedes iniciar sesión.");
      router.push("/login");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo completar tu registro.";
      toast.error(message);
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-destructive">{loadError}</p>
        <p className="text-sm text-muted-foreground">
          Solicita una nueva invitación al administrador del panel.
        </p>
        <Button asChild variant="outline" className="mt-2">
          <Link href="/login">Ir al inicio de sesión</Link>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="text-center">
          <p className="text-lg text-foreground">
            Hola, <strong>{summary?.name}</strong>
          </p>
          <p className="text-sm text-muted-foreground mt-1">{summary?.email}</p>
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Crear contraseña</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    {...field}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar contraseña</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repite tu contraseña"
                    {...field}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
          {isSubmitting ? "Activando cuenta..." : "Aceptar invitación e iniciar sesión"}
        </Button>
      </form>
    </Form>
  );
}
"use client";

import { useState } from "react";
import { LogOut, Sprout } from "lucide-react";
import { useAuth } from "@/features/auth/context/auth-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarUserFooterProps {
  collapsed: boolean;
}

export function SidebarUserFooter({ collapsed }: SidebarUserFooterProps) {
  const { logout } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (collapsed) {
    return (
      <div className="border-t border-border p-3 flex justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setConfirmOpen(true)}
              className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-destructive transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Cerrar sesión</TooltipContent>
        </Tooltip>

        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Deseas salir de Maro&apos;s Admin?</AlertDialogTitle>
              <AlertDialogDescription>
                Tendrás que volver a ingresar tus credenciales para acceder al panel.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={logout}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Sí, salir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <div className="p-3 border-t border-border flex flex-col gap-3">
      {/* Card Ilustrada de Maro's Admin */}
      <div className="rounded-xl bg-[#F6F2E9] border border-[#E9E1D2] p-3.5 relative overflow-hidden">
        <div className="flex items-start gap-2.5 relative z-10">
          <div className="h-8 w-8 rounded-lg bg-[#EAE2D2] text-[#8C7A4A] flex items-center justify-center shrink-0">
            <Sprout className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#5A4F35]">Maro&apos;s Admin</p>
            <p className="text-[11px] text-[#8A7D63] leading-tight mt-0.5">
              Gestiona tu tienda, crece con nosotros.
            </p>
          </div>
        </div>
      </div>

      {/* Botón Cerrar Sesión */}
      <button
        onClick={() => setConfirmOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors w-full"
      >
        <LogOut className="h-4 w-4 shrink-0" />
        <span>Cerrar sesión</span>
      </button>

      {/* Modal de Confirmación de Logout */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Deseas salir de Maro&apos;s Admin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tendrás que volver a ingresar tus credenciales para acceder al panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={logout}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sí, salir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
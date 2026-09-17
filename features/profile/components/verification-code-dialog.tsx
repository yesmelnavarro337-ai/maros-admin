"use client";

import { useState } from "react";
import { Loader2, MailCheck, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { verifyEmailChange, type UserProfile } from "../services/profile.service";

interface VerificationCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentEmail: string;
  newEmail: string;
  onSuccess: (updatedUser: UserProfile) => void;
}

export function VerificationCodeDialog({
  open,
  onOpenChange,
  currentEmail,
  newEmail,
  onSuccess,
}: VerificationCodeDialogProps) {
  const [codeCurrentEmail, setCodeCurrentEmail] = useState("");
  const [codeNewEmail, setCodeNewEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanCurrent = codeCurrentEmail.trim();
    const cleanNew = codeNewEmail.trim();

    if (cleanCurrent.length !== 6 || cleanNew.length !== 6) {
      toast.error("Por favor ingresa ambos códigos de 6 dígitos.");
      return;
    }

    setSaving(true);
    try {
      const res = await verifyEmailChange({
        codeCurrentEmail: cleanCurrent,
        codeNewEmail: cleanNew,
      });

      toast.success(res.message || "Correo electrónico actualizado correctamente.");
      onSuccess(res.user);
      onOpenChange(false);
      setCodeCurrentEmail("");
      setCodeNewEmail("");
    } catch (err: any) {
      toast.error(err?.message || "No se pudo verificar el cambio de correo. Revisa los códigos.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center font-heading text-xl">
            Verificación en Dos Pasos (2FA)
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            Hemos enviado dos códigos numéricos de 6 dígitos. Ingresa ambos a continuación para autorizar el cambio de correo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleVerify} className="space-y-4 py-2">
          <div className="space-y-2 rounded-lg border p-3 bg-secondary/30">
            <Label htmlFor="codeCurrent" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <MailCheck className="h-3.5 w-3.5 text-primary" />
              Código A (Enviado a {currentEmail}):
            </Label>
            <Input
              id="codeCurrent"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              className="text-center text-lg font-mono tracking-widest uppercase"
              value={codeCurrentEmail}
              onChange={(e) => setCodeCurrentEmail(e.target.value.replace(/\D/g, "").slice(0, 6))}
              disabled={saving}
              required
            />
          </div>

          <div className="space-y-2 rounded-lg border p-3 bg-secondary/30">
            <Label htmlFor="codeNew" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <MailCheck className="h-3.5 w-3.5 text-brand-gold" />
              Código B (Enviado a {newEmail}):
            </Label>
            <Input
              id="codeNew"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="654321"
              className="text-center text-lg font-mono tracking-widest uppercase"
              value={codeNewEmail}
              onChange={(e) => setCodeNewEmail(e.target.value.replace(/\D/g, "").slice(0, 6))}
              disabled={saving}
              required
            />
          </div>

          <DialogFooter className="pt-2 sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving || codeCurrentEmail.length !== 6 || codeNewEmail.length !== 6}
              className="bg-brand-gold text-brand-gold-foreground hover:bg-brand-gold/90"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validando códigos...
                </>
              ) : (
                "Confirmar Cambio de Correo"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

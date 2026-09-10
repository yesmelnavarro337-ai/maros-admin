"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { USER_ROLES } from "../types";
import type { UserRole } from "../types";

interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (data: { name: string; email: string; role: UserRole }) => void;
}

export function InviteUserDialog({ open, onOpenChange, onInvite }: InviteUserDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("Editor");

  function handleSubmit() {
    if (!name.trim() || !email.trim()) return;
    onInvite({ name: name.trim(), email: email.trim(), role });
    setName("");
    setEmail("");
    setRole("Editor");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invitar usuario</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div>
            <Label className="mb-1.5 block">Nombre</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Camila Pérez" />
          </div>
          <div>
            <Label className="mb-1.5 block">Correo electrónico</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="camila@marospijamas.com" />
          </div>
          <div>
            <Label className="mb-1.5 block">Rol</Label>
            <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {USER_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">
            El usuario quedará en estado &quot;Pendiente&quot; hasta que acepte la invitación por correo — esto se activa cuando conectemos el envío de emails real.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>Enviar invitación</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
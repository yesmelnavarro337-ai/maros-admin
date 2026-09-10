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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRating } from "./star-rating";

interface TestimonialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { clientName: string; rating: number; quote: string }) => void;
}

export function TestimonialDialog({ open, onOpenChange, onSave }: TestimonialDialogProps) {
  const [clientName, setClientName] = useState("");
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState("");

  function handleSubmit() {
    if (!clientName.trim() || !quote.trim()) return;
    onSave({ clientName: clientName.trim(), rating, quote: quote.trim() });
    setClientName("");
    setRating(5);
    setQuote("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo testimonio</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div>
            <Label className="mb-1.5 block">Nombre del cliente</Label>
            <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Ej. Laura G." />
          </div>
          <div>
            <Label className="mb-1.5 block">Calificación</Label>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <div>
            <Label className="mb-1.5 block">Comentario del testimonio</Label>
            <Textarea rows={3} value={quote} onChange={(e) => setQuote(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>Crear testimonio</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
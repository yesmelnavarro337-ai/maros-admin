"use client";

import { useEffect, useState } from "react";
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
import { SingleImageUploader } from "@/components/shared/single-image-uploader";
import { getSeasons } from "@/features/seasons/services/seasons.service";
import { getCollections } from "@/features/collections/services/collections.service";
import { BANNER_POSITIONS } from "../types";
import type { Banner } from "../types";
import type { Season } from "@/features/seasons/types";
import type { Collection } from "@/features/collections/types";

interface BannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingBanner: Banner | null;
  onSave: (data: {
    title: string;
    image?: string;
    linkUrl: string;
    position: string;
    startDate?: string;
    endDate?: string;
    seasonId?: string;
    collectionId?: string;
  }) => void;
}

const NONE_VALUE = "__none__";

export function BannerDialog({ open, onOpenChange, editingBanner, onSave }: BannerDialogProps) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<string | undefined>();
  const [linkUrl, setLinkUrl] = useState("");
  const [position, setPosition] = useState<string>(BANNER_POSITIONS[0]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [seasonId, setSeasonId] = useState<string>(NONE_VALUE);
  const [collectionId, setCollectionId] = useState<string>(NONE_VALUE);

  const [seasons, setSeasons] = useState<Season[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    getSeasons().then(setSeasons);
    getCollections().then(setCollections);
  }, []);

  useEffect(() => {
    if (open) {
      setTitle(editingBanner?.title ?? "");
      setImage(editingBanner?.image);
      setLinkUrl(editingBanner?.linkUrl ?? "");
      setPosition(editingBanner?.position ?? BANNER_POSITIONS[0]);
      setStartDate(editingBanner?.startDate ?? "");
      setEndDate(editingBanner?.endDate ?? "");
      setSeasonId(editingBanner?.seasonId ?? NONE_VALUE);
      setCollectionId(editingBanner?.collectionId ?? NONE_VALUE);
    }
  }, [open, editingBanner]);

  function handleSubmit() {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      image,
      linkUrl: linkUrl.trim(),
      position,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      seasonId: seasonId === NONE_VALUE ? undefined : seasonId,
      collectionId: collectionId === NONE_VALUE ? undefined : collectionId,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingBanner ? "Editar banner" : "Nuevo banner"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 max-h-[65vh] overflow-y-auto pr-1">
          <div>
            <Label className="mb-1.5 block">Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Envío gratis en pedidos +$150.000" />
          </div>
          <SingleImageUploader label="Imagen del banner" value={image} onChange={setImage} folder="banners" />
          <div>
            <Label className="mb-1.5 block">Enlace</Label>
            <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="/coleccion/navidad" />
          </div>
          <div>
            <Label className="mb-1.5 block">Posición</Label>
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BANNER_POSITIONS.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5 block text-xs">Fecha inicio (opcional)</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs">Fecha fin (opcional)</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div>
            <Label className="mb-1.5 block text-xs">Vincular a Temporada (opcional)</Label>
            <p className="text-xs text-muted-foreground mb-1.5">
              Si eliges una, el banner solo se mostrará mientras esa temporada esté activa.
            </p>
            <Select value={seasonId} onValueChange={setSeasonId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE_VALUE}>Ninguna</SelectItem>
                {seasons.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 block text-xs">Vincular a Colección (opcional)</Label>
            <Select value={collectionId} onValueChange={setCollectionId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE_VALUE}>Ninguna</SelectItem>
                {collections.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>{editingBanner ? "Guardar cambios" : "Crear banner"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
"use client";

import { Settings, AlertTriangle, ShieldCheck, Truck, Eye, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DELIVERY_TIME_OPTIONS,
  SHIPPING_METHOD_OPTIONS,
  WARRANTY_OPTIONS,
  type ProductStatus,
  type ProductVisibility,
} from "../types";

interface ProductConfigSubmoduleProps {
  status: ProductStatus;
  setStatus: (val: ProductStatus) => void;
  featuredHome: boolean;
  setFeaturedHome: (val: boolean) => void;
  allowCustomization: boolean;
  setAllowCustomization: (val: boolean) => void;
  visibility: ProductVisibility;
  setVisibility: (val: ProductVisibility) => void;
  trackInventory: boolean;
  setTrackInventory: (val: boolean) => void;
  totalStock: number;
  setTotalStock: (val: number) => void;
  deliveryTime: string;
  setDeliveryTime: (val: string) => void;
  shippingMethod: string;
  setShippingMethod: (val: string) => void;
  warrantyPeriod: string;
  setWarrantyPeriod: (val: string) => void;
}

export function ProductConfigSubmodule({
  status,
  setStatus,
  featuredHome,
  setFeaturedHome,
  allowCustomization,
  setAllowCustomization,
  visibility,
  setVisibility,
  trackInventory,
  setTrackInventory,
  totalStock,
  setTotalStock,
  deliveryTime,
  setDeliveryTime,
  shippingMethod,
  setShippingMethod,
  warrantyPeriod,
  setWarrantyPeriod,
}: ProductConfigSubmoduleProps) {
  const isProductActive = status === "activo";

  const handleToggleActive = (checked: boolean) => {
    setStatus(checked ? "activo" : "borrador");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Columna Izquierda (Configuraciones Principales - 7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Card: Estado del producto */}
        <Card className="border-[#EBE9DF] shadow-xs bg-white">
          <CardHeader className="border-b border-[#FAF9F5] pb-4">
            <CardTitle className="font-heading font-serif text-lg font-bold text-[#34351f] flex items-center gap-2">
              <Settings className="h-5 w-5 text-[#555829]" /> Estado del producto
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Visibilidad general y publicación en la página principal
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            {/* Switch Producto Activo */}
            <div className="flex items-center justify-between p-3.5 rounded-lg border border-[#EBE9DF] bg-[#FAF9F5]">
              <div>
                <p className="text-xs font-semibold text-[#34351f]">Producto activo en catálogo</p>
                <p className="text-[11px] text-muted-foreground">
                  Permite que los clientes vean e interactúen con el producto
                </p>
              </div>
              <Switch checked={isProductActive} onCheckedChange={handleToggleActive} />
            </div>

            {/* Switch Destacado */}
            <div className="flex items-center justify-between p-3.5 rounded-lg border border-[#EBE9DF] bg-[#FAF9F5]">
              <div>
                <p className="text-xs font-semibold text-[#34351f]">Destacado en Home / Ofertas</p>
                <p className="text-[11px] text-muted-foreground">
                  Muestra la prenda en el carrusel de novedades de la landing pública
                </p>
              </div>
              <Switch checked={featuredHome} onCheckedChange={setFeaturedHome} />
            </div>

            {/* Switch Personalización */}
            <div className="flex items-center justify-between p-3.5 rounded-lg border border-[#EBE9DF] bg-[#FAF9F5]">
              <div>
                <p className="text-xs font-semibold text-[#34351f]">Permitir personalización de tela/bordado</p>
                <p className="text-[11px] text-muted-foreground">
                  Habilita la opción de monogramas o personalizaciones especiales
                </p>
              </div>
              <Switch checked={allowCustomization} onCheckedChange={setAllowCustomization} />
            </div>
          </CardContent>
        </Card>

        {/* Card: Visibilidad y Permisos */}
        <Card className="border-[#EBE9DF] shadow-xs bg-white">
          <CardHeader className="border-b border-[#FAF9F5] pb-4">
            <CardTitle className="font-heading font-serif text-lg font-bold text-[#34351f] flex items-center gap-2">
              <Eye className="h-5 w-5 text-[#555829]" /> Visibilidad y Permisos
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#34351f]">Nivel de Visibilidad</Label>
              <Select value={visibility} onValueChange={(val: ProductVisibility) => setVisibility(val)}>
                <SelectTrigger className="bg-white border-[#EBE9DF] focus:ring-[#555829]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="publico">Público (Todos los usuarios y visitantes)</SelectItem>
                  <SelectItem value="registrados">Solo usuarios registrados / Clientes VIP</SelectItem>
                  <SelectItem value="oculto">Oculto (Acceso solo con enlace directo)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Card: Inventario */}
        <Card className="border-[#EBE9DF] shadow-xs bg-white">
          <CardHeader className="border-b border-[#FAF9F5] pb-4">
            <CardTitle className="font-heading font-serif text-lg font-bold text-[#34351f]">
              Control de Inventario
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-lg border border-[#EBE9DF] bg-[#FAF9F5]">
              <div>
                <p className="text-xs font-semibold text-[#34351f]">Controlar inventario automáticamente</p>
                <p className="text-[11px] text-muted-foreground">
                  Descuenta stock en cada venta confirmada por la pasarela de pagos
                </p>
              </div>
              <Switch checked={trackInventory} onCheckedChange={setTrackInventory} />
            </div>

            {trackInventory && (
              <div className="space-y-1.5 pt-2">
                <Label className="text-xs font-semibold text-[#34351f]">Stock Total en Almacén</Label>
                <Input
                  type="number"
                  min={0}
                  value={totalStock}
                  onChange={(e) => setTotalStock(parseInt(e.target.value, 10) || 0)}
                  className="bg-white border-[#EBE9DF] focus-visible:ring-[#555829]"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card: Políticas del Producto */}
        <Card className="border-[#EBE9DF] shadow-xs bg-white">
          <CardHeader className="border-b border-[#FAF9F5] pb-4">
            <CardTitle className="font-heading font-serif text-lg font-bold text-[#34351f] flex items-center gap-2">
              <Truck className="h-5 w-5 text-[#555829]" /> Políticas de Despacho y Garantía
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            {/* Tiempo de Entrega */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#34351f]">Tiempo estimado de entrega</Label>
              <Select value={deliveryTime} onValueChange={setDeliveryTime}>
                <SelectTrigger className="bg-white border-[#EBE9DF] focus:ring-[#555829]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DELIVERY_TIME_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Método de Envío */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#34351f]">Método de envío principal</Label>
              <Select value={shippingMethod} onValueChange={setShippingMethod}>
                <SelectTrigger className="bg-white border-[#EBE9DF] focus:ring-[#555829]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SHIPPING_METHOD_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Garantía */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#34351f]">Garantía del producto</Label>
              <Select value={warrantyPeriod} onValueChange={setWarrantyPeriod}>
                <SelectTrigger className="bg-white border-[#EBE9DF] focus:ring-[#555829]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WARRANTY_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Columna Derecha (Ficha Técnica & Advertencias - 5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        {/* Card: Live Preview Ficha Técnica */}
        <Card className="border-[#EBE9DF] shadow-xs bg-white overflow-hidden">
          <CardHeader className="border-b border-[#FAF9F5] pb-3 bg-[#FAF9F5]">
            <CardTitle className="font-heading font-serif text-sm font-bold text-[#34351f] flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#9FA367]" /> Resumen de Configuración
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            <div className="p-3 rounded-lg border border-[#EBE9DF] bg-[#FAF9F5] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Estado Publicación:</span>
                <Badge className={isProductActive ? "bg-[#555829] text-white" : "bg-[#EBE9DF] text-[#666459]"}>
                  {isProductActive ? "Activo" : "Borrador"}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Visibilidad:</span>
                <span className="font-bold text-[#34351f] capitalize">{visibility}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Destacado Home:</span>
                <span className="font-bold text-[#34351f]">{featuredHome ? "Sí" : "No"}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tiempo Entrega:</span>
                <span className="font-medium text-[#555829]">{deliveryTime}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Garantía:</span>
                <span className="font-medium text-[#34351f] truncate max-w-[150px]">{warrantyPeriod}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card: Advertencias de Visibilidad */}
        <Card className="border-amber-200 bg-amber-50/60 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading font-serif text-sm font-bold text-amber-900 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" /> Control de Publicación
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-amber-800 space-y-2">
            <p>
              • Al cambiar el estado a <strong>Borrador</strong>, el producto dejará de ser accesible para compras en la landing pública inmediatamente.
            </p>
            <p>
              • Si desactivas el <strong>Control de Inventario</strong>, no se limitarán las cantidades comprables por los clientes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

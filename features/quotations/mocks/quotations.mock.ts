import type { Quotation } from "../types";

export const mockQuotations: Quotation[] = [
{
  id: "q1",
  clientId: "c1",
  clientName: "María López",
  clientPhone: "3001234567",
  clientCity: "Valledupar",
  items: [{
    productId: "p1",
    productName: "Pijama Satín Beige",
    modelo: "Clásico dos piezas",
    size: "M",
    color: "Beige",
    tela: "Satín",
    quantity: 1,
  }],
  referenceImages: [],
  status: "nueva",
  notes: "Preguntó por envío a Valledupar.",
  createdAt: "2026-08-05",
},
{
  id: "q2",
  clientId: "c2",
  clientName: "Carla Ramírez",
  clientPhone: "3009876543",
  clientCity: "Bogotá",
  items: [{
    productId: "p2",
    productName: "Conjunto Algodón Marfil",
    modelo: "Clásico dos piezas",
    size: "S",
    color: "Marfil",
    quantity: 2,
  }],
  referenceImages: [],
  status: "en_revision",
  notes: "",
  createdAt: "2026-08-05",
}]

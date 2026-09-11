import { serverApiFetch } from "@/lib/api/server-client";
import { adaptQuotation, type ApiQuotation } from "./quotations.service";
import type { Quotation } from "../types";

export async function getQuotationByIdServer(id: string): Promise<Quotation | undefined> {
  try {
    const quotation = await serverApiFetch<ApiQuotation>(`Quotations/${id}`);
    return adaptQuotation(quotation);
  } catch {
    return undefined;
  }
}
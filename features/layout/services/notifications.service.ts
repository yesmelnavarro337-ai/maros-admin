import { apiFetch } from "@/lib/api/client-fetcher";

interface PagedResult<T> {
  items: T[];
  totalCount: number;
}

interface ApiProductVariant {
  stock: number;
}

interface ApiProduct {
  id: string;
  name: string;
  variants: ApiProductVariant[];
}

export interface ClientNotification {
  id: string;
  text: string;
  time: string;
}

export async function getClientNotifications(): Promise<ClientNotification[]> {
  const [newQuotes, products] = await Promise.all([
    apiFetch<PagedResult<unknown>>("Quotations?status=Nueva&pageSize=1").catch(() => null),
    apiFetch<PagedResult<ApiProduct>>("Products?status=Activo&pageSize=100").catch(() => null),
  ]);

  const notifications: ClientNotification[] = [];

  const newCount = newQuotes?.totalCount ?? 0;
  if (newCount > 0) {
    notifications.push({
      id: "new-quotations",
      text: `${newCount} cotización${newCount === 1 ? "" : "es"} nueva${newCount === 1 ? "" : "s"} por revisar`,
      time: "pendientes",
    });
  }

  const lowStock = (products?.items ?? [])
    .map((p) => ({ id: p.id, name: p.name, totalStock: p.variants.reduce((sum, v) => sum + v.stock, 0) }))
    .filter((p) => p.totalStock < 10)
    .sort((a, b) => a.totalStock - b.totalStock)
    .slice(0, 3);

  lowStock.forEach((p) => {
    notifications.push({
      id: `low-stock-${p.id}`,
      text: `"${p.name}" con stock bajo (${p.totalStock})`,
      time: "stock crítico",
    });
  });

  return notifications;
}
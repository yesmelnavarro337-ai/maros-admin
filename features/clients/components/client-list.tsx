"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductSearch as ClientSearch } from "@/features/products/components/product-search";
import { ContentCard } from "@/components/shared/content-card";
import { PageHeader } from "@/components/shared/page-header";
import { getClients } from "../services/clients.service";
import { ClientTable } from "./client-table";
import type { Client } from "../types";

export function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getClients().then((data) => {
      setClients(data);
      setLoading(false);
    });
  }, []);

  const filtered = clients.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Clientes" subtitle="Historial de clientes de Maro's Pijamas" />

      <ContentCard noPadding toolbar={<ClientSearch value={search} onChange={setSearch} />}>
        {loading ? (
          <div className="p-5">
            <Skeleton className="h-72 w-full rounded-lg" />
          </div>
        ) : (
          <ClientTable clients={filtered} />
        )}
      </ContentCard>
    </div>
  );
}
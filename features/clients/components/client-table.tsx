import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Client } from "../types";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export function ClientTable({ clients }: { clients: Client[] }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Ciudad</TableHead>
            <TableHead>Cliente desde</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                      {initials(client.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">{client.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{client.phone}</TableCell>
              <TableCell className="text-muted-foreground">{client.city}</TableCell>
              <TableCell className="text-muted-foreground">{client.createdAt}</TableCell>
              <TableCell className="text-right">
                <Button asChild size="icon" variant="ghost" className="h-8 w-8" title="Ver cliente">
                  <Link href={`/admin/clientes/${client.id}`}>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
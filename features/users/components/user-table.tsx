"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserStatusBadge } from "./user-status-badge";
import { USER_ROLES } from "../types";
import type { AdminUser, UserRole } from "../types";

interface UserTableProps {
  users: AdminUser[];
  currentUserEmail: string;
  onRoleChange: (id: string, role: UserRole) => void;
  onEdit: (user: AdminUser) => void;
  onRemove: (user: AdminUser) => void;
}

function getInitials(name: string): string {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const ITEMS_PER_PAGE = 10;

export function UserTable({
  users,
  currentUserEmail,
  onRoleChange,
  onEdit,
  onRemove,
}: UserTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalUsers = users.length;
  const totalPages = Math.max(1, Math.ceil(totalUsers / ITEMS_PER_PAGE));

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalUsers);

  const paginatedUsers = users.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/80">
              <TableHead className="font-semibold text-foreground py-3.5">Usuario</TableHead>
              <TableHead className="font-semibold text-foreground py-3.5">Rol</TableHead>
              <TableHead className="font-semibold text-foreground py-3.5">Estado</TableHead>
              <TableHead className="font-semibold text-foreground py-3.5">Último acceso</TableHead>
              <TableHead className="font-semibold text-foreground text-right py-3.5">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No hay usuarios registrados.
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => {
                const isSelf = user.email.toLowerCase() === currentUserEmail.toLowerCase();
                return (
                  <TableRow key={user.id} className="hover:bg-muted/40">
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border/60">
                          <AvatarFallback className="bg-[#2D4A3E]/10 text-[#2D4A3E] text-xs font-medium">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-3">
                      {isSelf ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-foreground">{user.role}</span>
                          <span className="text-xs font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            (tú)
                          </span>
                        </div>
                      ) : (
                        <Select
                          value={user.role}
                          onValueChange={(v) => onRoleChange(user.id, v as UserRole)}
                        >
                          <SelectTrigger className="w-36 h-8 text-xs font-medium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {USER_ROLES.map((r) => (
                              <SelectItem key={r} value={r} className="text-xs">
                                {r}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>

                    <TableCell className="py-3">
                      <UserStatusBadge status={user.status} />
                    </TableCell>

                    <TableCell className="py-3">
                      <span className="text-xs text-muted-foreground">
                        {user.lastAccess || "—"}
                      </span>
                    </TableCell>

                    <TableCell className="text-right py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="Editar usuario"
                          onClick={() => onEdit(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        {!isSelf && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => onRemove(user)}
                            title="Eliminar usuario"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación Inferior */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-border/80">
        <p className="text-xs text-muted-foreground">
          {totalUsers > 0
            ? `Mostrando ${startIndex + 1} - ${endIndex} de ${totalUsers} usuarios`
            : "Mostrando 0 de 0 usuarios"}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-xs font-medium text-foreground px-2">
            {currentPage} / {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
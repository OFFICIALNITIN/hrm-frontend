"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  MoreHorizontal,
  Edit,
  UserX,
  UserCheck,
  Trash2,
  Shield,
  Mail,
  Clock,
} from "lucide-react";
import {
  getRoleDisplayName,
  getRoleBadgeColor,
  getStatusBadgeColor,
} from "@/utils/permissions";
import type { User } from "@/types";

interface UserTableProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (id: string) => Promise<boolean>;
  onSuspendUser: (id: string) => Promise<boolean>;
  onActivateUser: (id: string) => Promise<boolean>;
  loading?: boolean;
  currentUserId?: string;
}

export function UserTable({
  users,
  onEditUser,
  onDeleteUser,
  onSuspendUser,
  onActivateUser,
  loading = false,
  currentUserId,
}: UserTableProps) {
  const [actioningId, setActioningId] = useState<string | null>(null);

  const handleAction = async (
    action: () => Promise<boolean>,
    userId: string
  ) => {
    setActioningId(userId);
    await action();
    setActioningId(null);
  };

  const formatLastLogin = (lastLogin?: string) => {
    if (!lastLogin) return "Never";
    const date = new Date(lastLogin);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-gray-100">
          <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider pl-6">
            User
          </TableHead>
          <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Role
          </TableHead>
          <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Department
          </TableHead>
          <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </TableHead>
          <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Last Login
          </TableHead>
          <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider pr-6">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow
            key={user.id}
            className="border-gray-100 hover:bg-gray-50/50"
          >
            <TableCell className="font-medium pl-6">
              <div className="flex items-center gap-3">
                <div className="flex aspect-square size-10 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-medium">
                  {user?.employee?.firstName.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {user?.employee?.firstName || "NA"}
                    </span>
                    {user.id === currentUserId && (
                      <Badge
                        variant="outline"
                        className="text-xs px-1.5 py-0.5"
                      >
                        You
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="size-3" />
                    {user.email}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Shield className="size-4 text-muted-foreground" />
                <Badge className={`${getRoleBadgeColor(user.role)}`}>
                  {getRoleDisplayName(user.role)}
                </Badge>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <div className="font-medium text-gray-900">
                  {user?.employee?.department.name || "Not assigned"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {user?.employee?.jobTitle || "No position"}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                className={`${getStatusBadgeColor(
                  user.employee ? "Active" : "Inactive"
                )}`}
              >
                {user.employee ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>
              {/* <div className="flex items-center gap-2 text-sm">
                <Clock className="size-3 text-muted-foreground" />
                <span>{formatLastLogin(user?.lastLogin)}</span>
              </div> */}
            </TableCell>
            <TableCell className="pr-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    disabled={actioningId === user.id}
                  >
                    <span className="sr-only">Open menu</span>
                    {actioningId === user.id ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <MoreHorizontal className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => onEditUser(user)}>
                    <Edit className="mr-2 size-4" />
                    Edit User
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user.employee ? (
                    <DropdownMenuItem
                      className="text-orange-600"
                      onClick={() =>
                        handleAction(() => onSuspendUser(user.id), user.id)
                      }
                      disabled={user.id === currentUserId}
                    >
                      <UserX className="mr-2 size-4" />
                      Suspend User
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      className="text-green-600"
                      onClick={() =>
                        handleAction(() => onActivateUser(user.id), user.id)
                      }
                    >
                      <UserCheck className="mr-2 size-4" />
                      Activate User
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() =>
                      handleAction(() => onDeleteUser(user.id), user.id)
                    }
                    disabled={user.id === currentUserId}
                  >
                    <Trash2 className="mr-2 size-4" />
                    Delete User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

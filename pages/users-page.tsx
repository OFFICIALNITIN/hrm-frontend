"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Users,
  UserCheck,
  UserX,
  Shield,
  AlertTriangle,
  Crown,
  Activity,
  TrendingUp,
} from "lucide-react";
import { AddUserDialog } from "@/components/users/add-user-dialog";
import { EditUserDialog } from "@/components/users/edit-user-dialog";
import { UserTable } from "@/components/users/user-table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/contexts/auth-context";
import type { User } from "@/types";

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    users,
    total,
    totalPages,
    loading,
    error,
    refetch,
    createUser,
    updateUser,
    deleteUser,
    suspendUser,
    activateUser,
  } = useUsers(currentPage, 10, searchTerm);

  console.log(users);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDeleteUser = async (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return await deleteUser(id);
    }
    return false;
  };

  const handleSuspendUser = async (id: string) => {
    if (
      confirm(
        "Are you sure you want to suspend this user? They will not be able to access the system."
      )
    ) {
      return await suspendUser(id);
    }
    return false;
  };

  // Calculate stats
  const stats = {
    total: users.length,
    active: users.filter((u) => u.employee).length,
    inactive: users.filter((u) => u.employee === null).length,
    admins: users.filter((u) => u.role === "admin").length,
  };

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 bg-gray-50/50">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-700 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5 blur-2xl"></div>

        <div className="relative flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">User Management</h1>
                <p className="text-white/80">
                  Manage user accounts and permissions ({total} total users)
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/60" />
              <Input
                placeholder="Search users..."
                className="w-64 pl-9 h-10 bg-white/20 border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="h-10 bg-white/20 border-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
            >
              <Filter className="mr-2 size-4" />
              Filter
            </Button>
            <AddUserDialog onAddUser={createUser} loading={loading} />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Total Users
            </CardTitle>
            <div className="rounded-full bg-blue-500/20 p-2">
              <Users className="size-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {stats.total}
            </div>
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <TrendingUp className="size-3" />
              <span>All user accounts</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-emerald-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Active Users
            </CardTitle>
            <div className="rounded-full bg-green-500/20 p-2">
              <UserCheck className="size-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {stats.active}
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <Activity className="size-3" />
              <span>Currently active</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-amber-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Inactive
            </CardTitle>
            <div className="rounded-full bg-orange-500/20 p-2">
              <UserX className="size-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {stats.inactive}
            </div>
            <div className="flex items-center gap-1 text-xs text-orange-600">
              <AlertTriangle className="size-3" />
              <span>Inactive accounts</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-violet-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Administrators
            </CardTitle>
            <div className="rounded-full bg-purple-500/20 p-2">
              <Shield className="size-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {stats.admins}
            </div>
            <div className="flex items-center gap-1 text-xs text-purple-600">
              <Crown className="size-3" />
              <span>Admin accounts</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5" />
            System Users
          </CardTitle>
          <CardDescription>
            Manage user accounts, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading && users.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <LoadingSpinner size="lg" className="mx-auto mb-4" />
                <p className="text-muted-foreground">Loading users...</p>
              </div>
            </div>
          ) : (
            <UserTable
              users={users}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
              onSuspendUser={handleSuspendUser}
              onActivateUser={activateUser}
              loading={loading}
              currentUserId={currentUser?.id}
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {users.length} of {total} users
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Edit User Dialog */}
      <EditUserDialog
        user={selectedUser}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdateUser={updateUser}
      />
    </div>
  );
}

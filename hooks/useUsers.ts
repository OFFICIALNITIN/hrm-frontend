"use client";

import { useEffect, useState } from "react";
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  PaginatedResponse,
} from "@/types";
import { apiService } from "@/services/api";

export function useUsers(page = 1, limit = 10, search?: string) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter users based on search
  const getFilteredUsers = () => {
    if (!search) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase()) ||
        user.department?.toLowerCase().includes(search.toLowerCase()) ||
        user.position?.toLowerCase().includes(search.toLowerCase())
    );
  };

  // Get paginated data
  const getPaginatedData = (): PaginatedResponse<User> => {
    const filteredUsers = getFilteredUsers();
    const startIndex = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);

    return {
      data: paginatedUsers,
      total: filteredUsers.length,
      page,
      limit,
      totalPages: Math.ceil(filteredUsers.length / limit),
    };
  };

  const fetchUsers = async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await apiService.getUsers();

      setUsers(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async (userData: CreateUserDto): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);

      await apiService.createUser(userData);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (
    id: string,
    userData: UpdateUserDto
  ): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);

      await apiService.updateUser(id, userData);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUsers((prev) => prev.filter((user) => user.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const suspendUser = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUsers((prev) =>
        prev.map((user) =>
          user.id === id
            ? {
                ...user,
                status: "Suspended" as const,
                updatedAt: new Date().toISOString(),
              }
            : user
        )
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to suspend user");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const activateUser = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUsers((prev) =>
        prev.map((user) =>
          user.id === id
            ? {
                ...user,
                status: "Active" as const,
                updatedAt: new Date().toISOString(),
              }
            : user
        )
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to activate user");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    // For mock data, just clear any errors
    setError(null);
  };

  const paginatedData = getPaginatedData();

  return {
    users: paginatedData.data,
    total: paginatedData.total,
    totalPages: paginatedData.totalPages,
    currentPage: paginatedData.page,
    loading,
    error,
    refetch,
    createUser,
    updateUser,
    deleteUser,
    suspendUser,
    activateUser,
  };
}

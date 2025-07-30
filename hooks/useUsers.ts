"use client";

import { useEffect, useState } from "react";
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  PaginatedResponse,
} from "@/types";
import { apiService } from "@/services/api";

// Mock data for UI demonstration
const mockUsers: User[] = [
  {
    id: "USR001",
    name: "John Admin",
    email: "admin@company.com",
    role: "admin",
    status: "Active",
    department: "IT",
    position: "System Administrator",
    lastLogin: "2024-01-25T10:30:00Z",
    createdAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "USR002",
    name: "Sarah HR",
    email: "sarah@company.com",
    role: "hr",
    status: "Active",
    department: "Human Resources",
    position: "HR Manager",
    lastLogin: "2024-01-25T09:15:00Z",
    createdAt: "2023-02-20T00:00:00Z",
  },
  {
    id: "USR003",
    name: "Alex Thompson",
    email: "alex@company.com",
    role: "user",
    status: "Active",
    employeeId: "EMP001",
    department: "Engineering",
    position: "Senior Developer",
    lastLogin: "2024-01-25T08:45:00Z",
    createdAt: "2023-03-15T00:00:00Z",
  },
  {
    id: "USR004",
    name: "Maria Garcia",
    email: "maria@company.com",
    role: "user",
    status: "Active",
    employeeId: "EMP002",
    department: "Design",
    position: "UX Designer",
    lastLogin: "2024-01-24T16:20:00Z",
    createdAt: "2023-01-20T00:00:00Z",
  },
  {
    id: "USR005",
    name: "James Wilson",
    email: "james@company.com",
    role: "user",
    status: "Suspended",
    employeeId: "EMP003",
    department: "Marketing",
    position: "Marketing Manager",
    lastLogin: "2024-01-20T14:30:00Z",
    createdAt: "2023-11-08T00:00:00Z",
  },
  {
    id: "USR006",
    name: "Emily Chen",
    email: "emily@company.com",
    role: "user",
    status: "Active",
    employeeId: "EMP004",
    department: "Engineering",
    position: "Frontend Developer",
    lastLogin: "2024-01-25T07:30:00Z",
    createdAt: "2023-04-10T00:00:00Z",
  },
  {
    id: "USR007",
    name: "Michael Brown",
    email: "michael@company.com",
    role: "hr",
    status: "Active",
    department: "Human Resources",
    position: "HR Specialist",
    lastLogin: "2024-01-24T15:45:00Z",
    createdAt: "2023-06-01T00:00:00Z",
  },
  {
    id: "USR008",
    name: "Lisa Davis",
    email: "lisa@company.com",
    role: "user",
    status: "Inactive",
    employeeId: "EMP005",
    department: "Sales",
    position: "Sales Representative",
    lastLogin: "2024-01-15T12:00:00Z",
    createdAt: "2023-08-20T00:00:00Z",
  },
];

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

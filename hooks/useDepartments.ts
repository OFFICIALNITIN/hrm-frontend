"use client";

import { apiService } from "@/services/api";
import { useState, useEffect } from "react";

export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Mock departments data
const mockDepartments: Department[] = [
  {
    id: "DEPT001",
    name: "Engineering",
    description: "Software development and technical operations",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "DEPT002",
    name: "Design",
    description: "User experience and visual design",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "DEPT003",
    name: "Marketing",
    description: "Brand promotion and customer acquisition",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "DEPT004",
    name: "Sales",
    description: "Revenue generation and client relations",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "DEPT005",
    name: "Human Resources",
    description: "Employee management and organizational development",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "DEPT006",
    name: "Finance",
    description: "Financial planning and accounting",
    createdAt: "2023-01-01T00:00:00Z",
  },
];

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getDepartments();
      setDepartments(response.data);

      // Data is already set in state
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch departments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const createDepartment = async (
    departmentData: Partial<Department>
  ): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);

      // Simulate API delay
      await apiService.createDepartment(departmentData);

      const newDepartment: Department = {
        id: `DEPT${(departments.length + 1).toString().padStart(3, "0")}`,
        name: departmentData.name || "",
        description: departmentData.description,
        createdAt: new Date().toISOString(),
      };

      setDepartments((prev) => [...prev, newDepartment]);
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create department"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateDepartment = async (
    id: string,
    departmentData: Partial<Department>
  ): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setDepartments((prev) =>
        prev.map((dept) =>
          dept.id === id
            ? {
                ...dept,
                ...departmentData,
                updatedAt: new Date().toISOString(),
              }
            : dept
        )
      );
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update department"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 400));

      setDepartments((prev) => prev.filter((dept) => dept.id !== id));
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete department"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    departments,
    loading,
    error,
    refetch: fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  };
}

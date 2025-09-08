"use client";

import { useState, useEffect } from "react";
import type {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  PaginatedResponse,
} from "@/types";
import { apiService } from "@/services/api";
import { useDebounce } from "./use-debounce";

export function useEmployees(page = 1, limit = 10, search?: string) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  // Filter employees based on search
  const getFilteredEmployees = () => {
    if (!debouncedSearch) return employees;

    return employees.filter(
      (employee) =>
        employee.firstName
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        employee.user.email
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        employee.department.name
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        employee.jobTitle.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  };

  // Get paginated data
  const getPaginatedData = (): PaginatedResponse<Employee> => {
    const filteredEmployees = getFilteredEmployees();
    const startIndex = (page - 1) * limit;
    const paginatedEmployees = filteredEmployees.slice(
      startIndex,
      startIndex + limit
    );

    return {
      data: paginatedEmployees,
      total: filteredEmployees.length,
      page,
      limit,
      totalPages: Math.ceil(filteredEmployees.length / limit),
    };
  };

  const fetchEmployees = async (search?: string) => {
    try {
      setError(null);
      setLoading(true);
      const response = await apiService.getEmployees(search);
      setEmployees(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch employees"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(debouncedSearch);
  }, [debouncedSearch]);

  const createEmployee = async (
    employeeData: CreateEmployeeDto
  ): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);

      await apiService.createEmployee(employeeData);

      // Refetch employees after successful creation
      await fetchEmployees(debouncedSearch);

      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create employee"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (
    id: string,
    employeeData: UpdateEmployeeDto
  ): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);

      await apiService.updateEmployee(id, employeeData);

      // Refetch employees after successful update
      await fetchEmployees(debouncedSearch);

      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update employee"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);
      console.log(id);

      await apiService.deleteEmployee(id);

      // Refetch employees after successful deletion
      await fetchEmployees(debouncedSearch);

      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete employee"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchEmployees(debouncedSearch);
  };

  const paginatedData = getPaginatedData();

  return {
    employees: paginatedData.data,
    total: paginatedData.total,
    totalPages: paginatedData.totalPages,
    currentPage: paginatedData.page,
    loading,
    error,
    refetch,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
}

export function useEmployee(id: string) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const response = await apiService.getEmployee(id);
        setEmployee(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch employee"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  return { employee, loading, error };
}

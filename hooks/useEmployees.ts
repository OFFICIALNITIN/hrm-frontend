"use client";

import { useState, useEffect } from "react";
import type {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  PaginatedResponse,
} from "@/types";
import { apiService } from "@/services/api";

// // Mock data for UI demonstration
// const mockEmployees: Employee[] = [
//   {
//     id: "EMP001",
//     name: "Alex Thompson",
//     email: "alex@company.com",
//     department: "Engineering",
//     position: "Senior Developer",
//     status: "Active",
//     joinDate: "2022-03-15",
//     avatar: "/placeholder.svg?height=40&width=40",
//     phone: "+1 (555) 123-4567",
//     address: "123 Main St, San Francisco, CA",
//     salary: 95000,
//   },
//   {
//     id: "EMP002",
//     name: "Maria Garcia",
//     email: "maria@company.com",
//     department: "Design",
//     position: "UX Designer",
//     status: "Active",
//     joinDate: "2023-01-20",
//     avatar: "/placeholder.svg?height=40&width=40",
//     phone: "+1 (555) 234-5678",
//     address: "456 Oak Ave, San Francisco, CA",
//     salary: 78000,
//   },
//   {
//     id: "EMP003",
//     name: "James Wilson",
//     email: "james@company.com",
//     department: "Marketing",
//     position: "Marketing Manager",
//     status: "On Leave",
//     joinDate: "2021-11-08",
//     avatar: "/placeholder.svg?height=40&width=40",
//     phone: "+1 (555) 345-6789",
//     address: "789 Pine St, San Francisco, CA",
//     salary: 85000,
//   },
//   {
//     id: "EMP004",
//     name: "Emily Chen",
//     email: "emily@company.com",
//     department: "Engineering",
//     position: "Frontend Developer",
//     status: "Active",
//     joinDate: "2023-04-10",
//     avatar: "/placeholder.svg?height=40&width=40",
//     phone: "+1 (555) 456-7890",
//     address: "321 Elm St, San Francisco, CA",
//     salary: 82000,
//   },
//   {
//     id: "EMP005",
//     name: "David Rodriguez",
//     email: "david@company.com",
//     department: "Sales",
//     position: "Sales Manager",
//     status: "Active",
//     joinDate: "2022-08-22",
//     avatar: "/placeholder.svg?height=40&width=40",
//     phone: "+1 (555) 567-8901",
//     address: "654 Maple Ave, San Francisco, CA",
//     salary: 88000,
//   },
//   {
//     id: "EMP006",
//     name: "Sarah Johnson",
//     email: "sarah.j@company.com",
//     department: "Human Resources",
//     position: "HR Coordinator",
//     status: "Active",
//     joinDate: "2023-02-14",
//     avatar: "/placeholder.svg?height=40&width=40",
//     phone: "+1 (555) 678-9012",
//     address: "987 Cedar St, San Francisco, CA",
//     salary: 65000,
//   },
// ]

export function useEmployees(page = 1, limit = 10, search?: string) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter employees based on search
  const getFilteredEmployees = () => {
    if (!search) return employees;

    return employees.filter(
      (employee) =>
        employee.firstName.toLowerCase().includes(search.toLowerCase()) ||
        employee.user.email.toLowerCase().includes(search.toLowerCase()) ||
        employee.department.name.toLowerCase().includes(search.toLowerCase()) ||
        employee.jobTitle.toLowerCase().includes(search.toLowerCase())
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

  const fetchEmployees = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await apiService.getEmployees();
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
    fetchEmployees();
  }, []);

  const createEmployee = async (
    employeeData: CreateEmployeeDto
  ): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);

      await apiService.createEmployee(employeeData);
      return true;
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

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      setEmployees((prev) =>
        prev.map((employee) =>
          employee.id === id
            ? {
                ...employee,
                ...employeeData,
                updatedAt: new Date().toISOString(),
              }
            : employee
        )
      );
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
      // Simulate API delay
      await apiService.deleteEmployee(id);

      setEmployees((prev) => prev.filter((employee) => employee.id !== id));
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
    // For mock data, just clear any errors
    setError(null);
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

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        const foundEmployee = mockEmployees.find((emp) => emp.id === id);
        setEmployee(foundEmployee || null);

        if (!foundEmployee) {
          setError("Employee not found");
        }
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

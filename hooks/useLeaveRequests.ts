"use client";

import { useState } from "react";
import type {
  LeaveRequest,
  CreateLeaveRequestDto,
  PaginatedResponse,
  LeaveRequestStatus,
} from "@/types";
import { apiService } from "@/services/api";

// Mock leave requests data
const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "LR001",
    employee: {
      id: "EMP001",
      firstName: "Alex",
      lastName: "Thompson",
      email: "alex.thompson@example.com",
      department: { id: 1, name: "HR", employees: [] },
      jobTitle: "HR Manager",
      hireDate: "2020-01-15",
      departmentId: 1,
      user: {} as any,
    },
    type: "Vacation",
    startDate: "2024-02-15",
    endDate: "2024-02-20",
    days: 5,
    status: "Pending",
    reason: "Family vacation to Hawaii",
    createdAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "LR002",
    employee: {
      id: "EMP002",
      firstName: "Maria",
      lastName: "Garcia",
      email: "maria.garcia@example.com",
      department: { id: 2, name: "Finance", employees: [] },
      jobTitle: "Accountant",
      hireDate: "2019-03-10",
      departmentId: 2,
      user: {} as any,
    },
    type: "Sick Leave",
    startDate: "2024-01-28",
    endDate: "2024-01-30",
    days: 3,
    status: "Approved",
    reason: "Medical appointment and recovery",
    createdAt: "2024-01-25T14:30:00Z",
  },
  {
    id: "LR003",
    employee: {
      id: "EMP003",
      firstName: "James",
      lastName: "Wilson",
      email: "james.wilson@example.com",
      department: { id: 3, name: "IT", employees: [] },
      jobTitle: "Developer",
      hireDate: "2021-06-20",
      departmentId: 3,
      user: {} as any,
    },
    type: "Personal",
    startDate: "2024-02-10",
    endDate: "2024-02-12",
    days: 2,
    status: "Rejected",
    reason: "Personal matters - family event",
    createdAt: "2024-01-22T09:15:00Z",
  },
  {
    id: "LR004",
    employee: {
      id: "EMP004",
      firstName: "Emily",
      lastName: "Chen",
      email: "emily.chen@example.com",
      department: { id: 4, name: "Marketing", employees: [] },
      jobTitle: "Marketing Lead",
      hireDate: "2018-11-05",
      departmentId: 4,
      user: {} as any,
    },
    type: "Vacation",
    startDate: "2024-03-01",
    endDate: "2024-03-05",
    days: 5,
    status: "Approved",
    reason: "Spring break vacation",
    createdAt: "2024-01-18T16:45:00Z",
  },
  {
    id: "LR005",
    employee: {
      id: "EMP005",
      firstName: "David",
      lastName: "Rodriguez",
      email: "david.rodriguez@example.com",
      department: { id: 5, name: "Operations", employees: [] },
      jobTitle: "Operations Manager",
      hireDate: "2017-09-12",
      departmentId: 5,
      user: {} as any,
    },
    type: "Maternity/Paternity",
    startDate: "2024-04-01",
    endDate: "2024-04-15",
    days: 14,
    status: "Pending",
    reason: "Paternity leave for newborn",
    createdAt: "2024-01-26T11:20:00Z",
  },
  {
    id: "LR006",
    employee: {
      id: "EMP001",
      firstName: "Alex",
      lastName: "Thompson",
      email: "alex.thompson@example.com",
      department: { id: 1, name: "HR", employees: [] },
      jobTitle: "HR Manager",
      hireDate: "2020-01-15",
      departmentId: 1,
      user: {} as any,
    },
    type: "Sick Leave",
    startDate: "2024-01-15",
    endDate: "2024-01-16",
    days: 2,
    status: "Approved",
    reason: "Flu symptoms",
    createdAt: "2024-01-14T08:30:00Z",
  },
];

export function useLeaveRequests(
  page = 1,
  limit = 10,
  employeeId?: string,
  status?: string,
) {
  const [leaveRequests, setLeaveRequests] =
    useState<LeaveRequest[]>(mockLeaveRequests);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter leave requests based on criteria
  const getFilteredRequests = () => {
    let filtered = leaveRequests;

    if (employeeId) {
      filtered = filtered.filter(
        (request) => request.employee.id === employeeId,
      );
    }

    if (status) {
      filtered = filtered.filter((request) => request.status === status);
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.createdAt || "").getTime() -
        new Date(a.createdAt || "").getTime(),
    );
  };

  // Get paginated data
  const getPaginatedData = (): PaginatedResponse<LeaveRequest> => {
    const filteredRequests = getFilteredRequests();
    const startIndex = (page - 1) * limit;
    const paginatedRequests = filteredRequests.slice(
      startIndex,
      startIndex + limit,
    );

    return {
      data: paginatedRequests,
      total: filteredRequests.length,
      page,
      limit,
      totalPages: Math.ceil(filteredRequests.length / limit),
    };
  };

  const createLeaveRequest = async (
    requestData: CreateLeaveRequestDto,
  ): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);

      const res = await apiService.createLeaveRequest(requestData);

      // Log the response to debug the structure
      console.log("API Response:", res);

      // Handle different possible response structures
      const responseData = res.data || res;

      if (!responseData) {
        throw new Error("No data received from API");
      }

      const {
        id,
        employee,
        type,
        startDate,
        endDate,
        reason,
        updatedAt,
        status,
      } = responseData;

      const start_Date = new Date(requestData.startDate);
      const end_Date = new Date(requestData.endDate);
      const days =
        Math.ceil(
          (end_Date.getTime() - start_Date.getTime()) / (1000 * 60 * 60 * 24),
        ) + 1;

      const newRequest: LeaveRequest = {
        id: id,
        employee: employee,
        type: type,
        startDate: startDate,
        endDate: endDate,
        reason: reason,
        updatedAt: updatedAt,
        status: status,
        days: days,
      };

      setLeaveRequests((prev) => [newRequest, ...prev]);
      return true;
    } catch (err) {
      console.error("Create leave request error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create leave request",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateLeaveRequestStatus = async (
    id: string,
    status: "Approved" | "Rejected",
  ): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      setLeaveRequests((prev) =>
        prev.map((req) =>
          req.id === id
            ? { ...req, status, updatedAt: new Date().toISOString() }
            : req,
        ),
      );
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update leave request",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteLeaveRequest = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);

      const res = await apiService.deleteLeaveRequest(id);
      console.log(res);

      setLeaveRequests((prev) => prev.filter((req) => req.id !== id));
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete leave request",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    setError(null);
  };

  // Fetch leave requests from API
  const fetchLeaveRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getMyLeaveRequests();
      // Expecting res.data to be an array of LeaveRequest
      setLeaveRequests(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch leave requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllRequests = async (status: LeaveRequestStatus = "all") => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getAllRequests(status);
      setLeaveRequests(res);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch leave requests",
      );
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.approveLeaveRequest(id);
      fetchAllRequests();
      console.log(res);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to approve leave request",
      );
    } finally {
      setLoading(false);
    }
  };

  const rejectRequest = async (id: string, body?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiService.rejectLeaveRequest(id, body);
      console.log(res);
      fetchAllRequests();
      return true;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to reject the request",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const paginatedData = getPaginatedData();

  return {
    leaveRequests: paginatedData.data,
    total: paginatedData.total,
    totalPages: paginatedData.totalPages,
    currentPage: paginatedData.page,
    loading,
    error,
    refetch,
    createLeaveRequest,
    updateLeaveRequestStatus,
    deleteLeaveRequest,
    fetchLeaveRequests, // Export the fetch function
    fetchAllRequests,
    approveRequest,
    rejectRequest,
  };
}

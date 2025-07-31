import type {
  PaginatedResponse,
  ApiResponse,
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  LeaveRequest,
  CreateLeaveRequestDto,
  AttendanceRecord,
  DashboardStats,
  User,
  CreateUserDto,
  UpdateUserDto,
  LeaveRequestStatus,
} from "@/types";

/**
 * Base URL strategy
 * ──────────────────
 * 1. PROD / real-backend   → set NEXT_PUBLIC_API_URL (e.g. https://api.acme.com/v1)
 * 2. Local preview / dev   → env var absent ⇒ fallback to '' so that requests hit
 *    Next.js Route Handlers defined in /app/api (e.g. '/api/employees').
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://hrm-backend-kznh.onrender.com/api/v1";

/**
 * Helper that guarantees we never end up with double slashes when concatenating.
 * Ensures fetch('/')-style paths still work when a base URL is present.
 */
function buildUrl(endpoint: string) {
  if (!API_BASE_URL)
    return endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = buildUrl(endpoint);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    const config: RequestInit = {
      ...options,
      headers,
      credentials: "include",
    };

    try {
      const response = await fetch(url, config);

      // Handle unauthorized responses
      if (response.status === 401) {
        // Redirect to login or trigger logout
        // window.location.href = "/";
        console.log("Session expired. Please login again.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // User Management API methods
  async getUsers(page = 1, limit = 10, search?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });

    return this.request<PaginatedResponse<User>>(`/users?${params}`);
  }

  async getUser(id: string) {
    return this.request<ApiResponse<User>>(`/users/${id}`);
  }

  async createUser(data: CreateUserDto) {
    return this.request<ApiResponse<User>>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: UpdateUserDto) {
    return this.request<ApiResponse<User>>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string) {
    return this.request<ApiResponse<void>>(`/users/${id}`, {
      method: "DELETE",
    });
  }

  async suspendUser(id: string) {
    return this.request<ApiResponse<User>>(`/users/${id}/suspend`, {
      method: "PATCH",
    });
  }

  async activateUser(id: string) {
    return this.request<ApiResponse<User>>(`/users/${id}/activate`, {
      method: "PATCH",
    });
  }

  // Employee API methods - matching your NestJS routes
  async getEmployees() {
    return this.request<PaginatedResponse<Employee>>(`/employees`);
  }

  async getEmployee(id: string) {
    return this.request<ApiResponse<Employee>>(`/employees/${id}`);
  }

  async createEmployee(data: CreateEmployeeDto) {
    return this.request<ApiResponse<Employee>>("/employees", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateEmployee(id: string, data: UpdateEmployeeDto) {
    return this.request<ApiResponse<Employee>>(`/employees/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteEmployee(id: string) {
    return this.request<ApiResponse<void>>(`/employees/${id}`, {
      method: "DELETE",
    });
  }

  // Department API methods - matching your NestJS routes
  async getDepartments() {
    return this.request<ApiResponse<any[]>>("/departments");
  }

  async getDepartment(id: string) {
    return this.request<ApiResponse<any>>(`/departments/${id}`);
  }

  async createDepartment(data: any) {
    return this.request<ApiResponse<any>>("/departments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateDepartment(id: string, data: any) {
    return this.request<ApiResponse<any>>(`/departments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteDepartment(id: string) {
    return this.request<ApiResponse<void>>(`/departments/${id}`, {
      method: "DELETE",
    });
  }

  // Auth API methods - matching your NestJS routes
  async login(credentials: { email: string; password: string }) {
    return this.request<
      ApiResponse<{ email: string; userId: string; role: string }>
    >("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request<ApiResponse<void>>("/auth/logout", {
      method: "POST",
    });
  }

  async verifyAuth() {
    return this.request<
      ApiResponse<{ userId: string; email: string; role: string }>
    >("/auth/verify");
  }

  // Leave Request API methods (if you have these endpoints)
  async getMyLeaveRequests() {
    return this.request<PaginatedResponse<LeaveRequest[]>>(`leave/my/requests`);
  }

  async getAllRequests(status: LeaveRequestStatus = "all") {
    return this.request<ApiResponse<LeaveRequest[]>>(
      `leave/all/requests?status=${status}`
    );
  }

  async approveLeaveRequest(id: string) {
    return this.request<ApiResponse<LeaveRequest>>(`/leave/${id}/approve`, {
      method: "PATCH",
    });
  }

  async rejectLeaveRequest(id: string, reason?: string) {
    return this.request<ApiResponse<LeaveRequest>>(`leave/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify(reason),
    });
  }

  async deleteLeaveRequest(id: string) {
    return this.request<ApiResponse<LeaveRequest>>(`/leave/${id}`, {
      method: "DELETE",
    });
  }

  async createLeaveRequest(data: CreateLeaveRequestDto) {
    return this.request<ApiResponse<LeaveRequest>>("/leave", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateLeaveRequestStatus(id: string, status: "Approved" | "Rejected") {
    return this.request<ApiResponse<LeaveRequest>>(
      `/leave-requests/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }
    );
  }

  // Attendance API methods (if you have these endpoints)
  async getAttendance(date?: string, page = 1, limit = 10) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(date && { date }),
    });

    return this.request<PaginatedResponse<AttendanceRecord>>(
      `/attendance?${params}`
    );
  }

  async markAttendance(employeeId: string, checkIn: string) {
    return this.request<ApiResponse<AttendanceRecord>>("/attendance", {
      method: "POST",
      body: JSON.stringify({ employeeId, checkIn }),
    });
  }

  // Dashboard API methods (if you have these endpoints)
  async getDashboardStats() {
    return this.request<ApiResponse<DashboardStats>>("/dashboard/stats");
  }

  async checkIn() {
    return this.request<ApiResponse<AttendanceRecord>>;
  }
}

export const apiService = new ApiService();

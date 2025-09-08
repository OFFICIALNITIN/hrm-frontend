import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
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
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000, // 10 seconds timeout
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // equivalent to credentials: 'include'
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(
          `Making ${config.method?.toUpperCase()} request to: ${config.url}`
        );
        return config;
      },
      (error) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`Response received:`, response.status, response.statusText);
        return response;
      },
      (error) => {
        console.error("API request failed:", error);

        if (error.response) {
          // Server responded with error status
          const { status, data } = error.response;

          if (status === 401) {
            console.log("Session expired. Please login again.");
            throw new Error("Session expired. Please login again.");
          }

          const errorMessage = data?.message || `HTTP error! status: ${status}`;
          throw new Error(errorMessage);
        } else if (error.request) {
          // Request was made but no response received
          throw new Error("Network error: No response received from server");
        } else {
          // Something else happened
          throw new Error(`Request setup error: ${error.message}`);
        }
      }
    );
  }

  private async request<T>(
    endpoint: string,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.request<T>({
        url: endpoint,
        ...config,
      });
      return response.data;
    } catch (error) {
      // Error is already handled by the response interceptor
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
      data,
    });
  }

  async updateUser(id: string, data: UpdateUserDto) {
    return this.request<ApiResponse<User>>(`/users/${id}`, {
      method: "PATCH",
      data,
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

  async getEmployees(search?: string) {
    const params = new URLSearchParams();
    if (search) {
      params.append("searchTerm", search);
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/employees?${queryString}` : "/employees";

    return this.request<PaginatedResponse<Employee>>(endpoint);
  }

  async getEmployee(id: string) {
    return this.request<ApiResponse<Employee>>(`/employees/${id}`);
  }

  async createEmployee(data: CreateEmployeeDto) {
    return this.request<ApiResponse<Employee>>("/employees", {
      method: "POST",
      data,
    });
  }

  async updateEmployee(id: string, data: UpdateEmployeeDto) {
    return this.request<ApiResponse<Employee>>(`/employees/${id}`, {
      method: "PATCH",
      data,
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
      data,
    });
  }

  async updateDepartment(id: string, data: any) {
    return this.request<ApiResponse<any>>(`/departments/${id}`, {
      method: "PATCH",
      data,
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
      data: credentials,
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
      data: { reason },
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
      data,
    });
  }

  async updateLeaveRequestStatus(id: string, status: "Approved" | "Rejected") {
    return this.request<ApiResponse<LeaveRequest>>(
      `/leave-requests/${id}/status`,
      {
        method: "PATCH",
        data: { status },
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
      data: { employeeId, checkIn },
    });
  }

  // Dashboard API methods (if you have these endpoints)
  async getDashboardStats() {
    return this.request<ApiResponse<DashboardStats>>("/dashboard/stats");
  }

  async checkIn() {
    return this.request<ApiResponse<AttendanceRecord>>("/attendance/checkin", {
      method: "POST",
    });
  }
}

export const apiService = new ApiService();

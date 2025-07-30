export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: Department;
  jobTitle: string;
  // status: "Active" | "On Leave" | "Inactive";
  hireDate: string;
  // avatar: string;
  // phone?: string;
  // address?: string;
  departmentId: number;
  user: User;
  salary?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Department {
  id: number;
  name: string;
  employees: Employee[];
}

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  jobTitle: string;
  hireDate: string;
  salary?: number;
  userId: string;
  departmentId?: number;
}

export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {
  status?: "Active" | "On Leave" | "Inactive";
}

export interface LeaveRequest {
  id: string;
  employee: Employee;
  type: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
  reason: string;
  createdAt?: string;
  updatedAt?: string;
  days?: number;
}

export interface CreateLeaveRequestDto {
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: "Present" | "Absent" | "Late" | "Half Day";
  hoursWorked: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  onLeave: number;
  avgPerformance: number;
}

// Role-based types
export type UserRole = "user" | "hr" | "admin";
export type UserStatus = "Active" | "Inactive" | "Suspended";
export type LeaveRequestStatus = "pending" | "approved" | "rejected" | "all";

export interface User {
  id: string;
  email: string;
  // name: string;
  role: UserRole;
  // status: UserStatus;
  employee: Employee; // For USER role, links to employee record
  department?: Department;
  // position?: string;
  // avatar?: string;
  // permissions?: string[];
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserDto {
  email?: string;
  role?: UserRole;

  employeeId?: string;
}

export interface RolePermissions {
  canViewAllEmployees: boolean;
  canCreateEmployees: boolean;
  canEditEmployees: boolean;
  canDeleteEmployees: boolean;
  canViewPayroll: boolean;
  canManagePayroll: boolean;
  canViewReports: boolean;
  canManageReports: boolean;
  canViewAttendance: boolean;
  canManageAttendance: boolean;
  canViewLeaves: boolean;
  canManageLeaves: boolean;
  canViewDepartments: boolean;
  canManageDepartments: boolean;
  canViewSettings: boolean;
  canManageSettings: boolean;
  canManageUsers: boolean;
}

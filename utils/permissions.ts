import type { UserRole, RolePermissions } from "@/types";

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  user: {
    canViewAllEmployees: false,
    canCreateEmployees: false,
    canEditEmployees: false,
    canDeleteEmployees: false,
    canViewPayroll: false, // Can only view own payroll
    canManagePayroll: false,
    canViewReports: false,
    canManageReports: false,
    canViewAttendance: false, // Can only view own attendance
    canManageAttendance: false,
    canViewLeaves: true, // Can view own leaves
    canManageLeaves: false, // Can only create leave requests
    canViewDepartments: false,
    canManageDepartments: false,
    canViewSettings: false, // Can only view own profile settings
    canManageSettings: false,
    canManageUsers: false,
  },
  hr: {
    canViewAllEmployees: true,
    canCreateEmployees: true,
    canEditEmployees: true,
    canDeleteEmployees: false, // HR can't delete, only deactivate
    canViewPayroll: true,
    canManagePayroll: true,
    canViewReports: true,
    canManageReports: true,
    canViewAttendance: true,
    canManageAttendance: true,
    canViewLeaves: true,
    canManageLeaves: true, // Can approve/reject leaves
    canViewDepartments: true,
    canManageDepartments: true,
    canViewSettings: true,
    canManageSettings: false, // Can't manage system settings
    canManageUsers: false, // Can't manage users
  },
  admin: {
    canViewAllEmployees: true,
    canCreateEmployees: true,
    canEditEmployees: true,
    canDeleteEmployees: true,
    canViewPayroll: true,
    canManagePayroll: true,
    canViewReports: true,
    canManageReports: true,
    canViewAttendance: true,
    canManageAttendance: true,
    canViewLeaves: true,
    canManageLeaves: true,
    canViewDepartments: true,
    canManageDepartments: true,
    canViewSettings: true,
    canManageSettings: true,
    canManageUsers: true, // Only admins can manage users
  },
};

export function hasPermission(
  userRole: UserRole,
  permission: keyof RolePermissions
): boolean {
  return ROLE_PERMISSIONS[userRole][permission];
}

export function canAccessPage(userRole: UserRole, page: string): boolean {
  switch (page) {
    case "dashboard":
      return true; // All roles can access dashboard
    case "employees":
      return hasPermission(userRole, "canViewAllEmployees");
    case "departments":
      return hasPermission(userRole, "canViewDepartments");
    case "attendance":
      return (
        hasPermission(userRole, "canViewAttendance") || userRole === "user"
      ); // Users can view own
    case "leaves":
      return hasPermission(userRole, "canViewLeaves");
    case "payroll":
      return hasPermission(userRole, "canViewPayroll") || userRole === "user"; // Users can view own
    case "reports":
      return hasPermission(userRole, "canViewReports");
    case "settings":
      return true; // All roles can access settings (different views)
    case "profile":
      return true; // All roles can access their profile
    case "users":
      return hasPermission(userRole, "canManageUsers"); // Only admins
    default:
      return false;
  }
}

export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case "user":
      return "Employee";
    case "hr":
      return "HR Manager";
    case "admin":
      return "Administrator";
    default:
      return "User";
  }
}

export function getRoleBadgeColor(role: UserRole): string {
  switch (role) {
    case "user":
      return "bg-blue-100 text-blue-800";
    case "hr":
      return "bg-green-100 text-green-800";
    case "admin":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getStatusBadgeColor(status: string): string {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Inactive":
      return "bg-gray-100 text-gray-800";
    case "Suspended":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

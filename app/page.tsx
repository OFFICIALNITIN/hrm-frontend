"use client";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { AddEmployeeDialog } from "@/components/employees/add-employee-dialog";
import { RoleGuard } from "@/components/auth/role-guard";
import { useEmployees } from "@/hooks/useEmployees";
import { AuthProvider } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { canAccessPage } from "@/utils/permissions";
import dynamic from "next/dynamic";

// Dynamic imports to prevent SSR issues
const DashboardPage = dynamic(() => import("@/pages/dashboard-page"), {
  ssr: false,
});
const EmployeesPage = dynamic(() => import("@/pages/employees-page"), {
  ssr: false,
});
const DepartmentsPage = dynamic(() => import("@/pages/departments-page"), {
  ssr: false,
});
const ProfilePage = dynamic(() => import("@/pages/profile-page"), {
  ssr: false,
});
const UsersPage = dynamic(() => import("@/pages/users-page"), { ssr: false });
const AttendancePage = dynamic(() => import("@/pages/attendance-page"), {
  ssr: false,
});
const LeavesPage = dynamic(() => import("@/pages/leaves-page"), { ssr: false });
const PayrollPage = dynamic(() => import("@/pages/payroll-page"), {
  ssr: false,
});
const ReportsPage = dynamic(() => import("@/pages/reports-page"), {
  ssr: false,
});
const SettingsPage = dynamic(() => import("@/pages/settings-page"), {
  ssr: false,
});

function MainApp() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const { createEmployee } = useEmployees();
  const { user } = useAuth();

  const getPageTitle = () => {
    switch (currentPage) {
      case "dashboard":
        return "Dashboard";
      case "profile":
        return "My Profile";
      case "employees":
        return "Employees";
      case "departments":
        return "Departments";
      case "users":
        return "User Management";
      case "attendance":
        return user?.role === "user" ? "My Attendance" : "Attendance";
      case "leaves":
        return user?.role === "user" ? "My Leave Requests" : "Leave Requests";
      case "payroll":
        return user?.role === "user" ? "My Payroll" : "Payroll";
      case "reports":
        return "Reports";
      case "settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  const renderPage = () => {
    // Check if user can access the page
    if (!user || !canAccessPage(user.role, currentPage)) {
      return (
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
      );
    }

    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      case "profile":
        return <ProfilePage />;
      case "employees":
        return (
          <RoleGuard allowedRoles={["hr", "admin"]}>
            <EmployeesPage />
          </RoleGuard>
        );
      case "departments":
        return (
          <RoleGuard allowedRoles={["hr", "admin"]}>
            <DepartmentsPage />
          </RoleGuard>
        );
      case "users":
        return (
          <RoleGuard allowedRoles={["admin"]}>
            <UsersPage />
          </RoleGuard>
        );
      case "attendance":
        return <AttendancePage />;
      case "leaves":
        return <LeavesPage />;
      case "payroll":
        return <PayrollPage />;
      case "reports":
        return (
          <RoleGuard allowedRoles={["hr", "admin"]}>
            <ReportsPage />
          </RoleGuard>
        );
      case "settings":
        return (
          <RoleGuard allowedRoles={["hr", "admin"]}>
            <SettingsPage />
          </RoleGuard>
        );
      default:
        return <DashboardPage />;
    }
  };

  const showSearchAndAdd =
    currentPage === "dashboard" &&
    (user?.role === "hr" || user?.role === "admin");

  return (
    <SidebarProvider>
      <AppSidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {getPageTitle()}
              </h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user?.email || "User"}
              </p>
            </div>
            {showSearchAndAdd && (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search employees..."
                    className="w-64 pl-9 h-9 bg-gray-50 border-gray-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <AddEmployeeDialog onAddEmployee={createEmployee} />
              </div>
            )}
          </div>
        </header>
        {renderPage()}
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function Component() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <MainApp />
      </ProtectedRoute>
    </AuthProvider>
  );
}

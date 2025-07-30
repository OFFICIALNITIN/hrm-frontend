"use client";
import type * as React from "react";
import {
  BarChart3,
  Building2,
  Calendar,
  CreditCard,
  FileText,
  Home,
  MoreHorizontal,
  Settings,
  Users,
  Clock,
  LogOut,
  User,
  UserCog,
  Sparkles,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import {
  canAccessPage,
  getRoleDisplayName,
  getRoleBadgeColor,
} from "@/utils/permissions";
import type { UserRole } from "@/types";
import Router from "next/router";

const allNavItems = [
  {
    title: "Dashboard",
    url: "#",
    icon: Home,
    key: "dashboard",
    roles: ["user", "hr", "admin"] as UserRole[],
  },
  {
    title: "My Profile",
    url: "#",
    icon: User,
    key: "profile",
    roles: ["user"] as UserRole[],
  },
  {
    title: "Employees",
    url: "#",
    icon: Users,
    key: "employees",
    roles: ["hr", "admin"] as UserRole[],
  },
  {
    title: "Departments",
    url: "#",
    icon: Building2,
    key: "departments",
    roles: ["hr", "admin"] as UserRole[],
  },
  {
    title: "Attendance",
    url: "#",
    icon: Clock,
    key: "attendance",
    roles: ["user", "hr", "admin"] as UserRole[],
  },
  {
    title: "Leave Requests",
    url: "#",
    icon: Calendar,
    key: "leaves",
    roles: ["user", "hr", "admin"] as UserRole[],
  },
  {
    title: "Payroll",
    url: "#",
    icon: CreditCard,
    key: "payroll",
    roles: ["user", "hr", "admin"] as UserRole[],
  },
  {
    title: "Reports",
    url: "#",
    icon: BarChart3,
    key: "reports",
    roles: ["hr", "admin"] as UserRole[],
  },
  {
    title: "User Management",
    url: "#",
    icon: UserCog,
    key: "users",
    roles: ["admin"] as UserRole[],
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    key: "settings",
    roles: ["hr", "admin"] as UserRole[],
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export function AppSidebar({
  currentPage,
  setCurrentPage,
  ...props
}: AppSidebarProps) {
  const { user, logout, hasAnyRole } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  // Filter navigation items based on user role
  const navItems = allNavItems.filter((item) => {
    if (!user) return false;
    return hasAnyRole(item.roles) && canAccessPage(user.role, item.key);
  });

  // Group navigation items
  const userItems = navItems.filter((item) =>
    ["dashboard", "profile"].includes(item.key),
  );
  const managementItems = navItems.filter((item) =>
    ["employees", "departments", "attendance", "leaves", "payroll"].includes(
      item.key,
    ),
  );
  const adminItems = navItems.filter((item) =>
    ["reports", "users", "settings"].includes(item.key),
  );

  return (
    <Sidebar
      variant="inset"
      className="border-r-0 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900"
      {...props}
    >
      <SidebarHeader className="border-b border-slate-200/50 dark:border-slate-800/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
                <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                  <Sparkles className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-lg">HR Portal</span>
                  <span className="truncate text-xs text-blue-100">
                    Modern Workspace
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        {/* User Section */}
        {userItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
              Personal
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {userItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={currentPage === item.key}
                      className={`h-11 px-3 rounded-xl transition-all duration-200 cursor-pointer group ${
                        currentPage === item.key
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-md"
                      }`}
                      onClick={() => setCurrentPage(item.key)}
                    >
                      <item.icon
                        className={`size-5 ${
                          currentPage === item.key
                            ? "text-white"
                            : "text-slate-600 dark:text-slate-400"
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          currentPage === item.key
                            ? "text-white"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Management Section */}
        {managementItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
              Management
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {managementItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={currentPage === item.key}
                      className={`h-11 px-3 rounded-xl transition-all duration-200 cursor-pointer group ${
                        currentPage === item.key
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-md"
                      }`}
                      onClick={() => setCurrentPage(item.key)}
                    >
                      <item.icon
                        className={`size-5 ${
                          currentPage === item.key
                            ? "text-white"
                            : "text-slate-600 dark:text-slate-400"
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          currentPage === item.key
                            ? "text-white"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Admin Section */}
        {adminItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
              Administration
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={currentPage === item.key}
                      className={`h-11 px-3 rounded-xl transition-all duration-200 cursor-pointer group ${
                        currentPage === item.key
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-md"
                      }`}
                      onClick={() => setCurrentPage(item.key)}
                    >
                      <item.icon
                        className={`size-5 ${
                          currentPage === item.key
                            ? "text-white"
                            : "text-slate-600 dark:text-slate-400"
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          currentPage === item.key
                            ? "text-white"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="border-t border-slate-200/50 dark:border-slate-800/50 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800 rounded-xl p-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex aspect-square size-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold shadow-lg">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold text-slate-900 dark:text-slate-100">
                        {user?.name || "User"}
                      </span>
                      <Badge
                        className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(
                          user?.role || "user",
                        )}`}
                      >
                        {getRoleDisplayName(user?.role || "user")}
                      </Badge>
                    </div>
                    <span className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {user?.email || "user@company.com"}
                    </span>
                  </div>
                  <MoreHorizontal className="ml-auto size-4 text-slate-400" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl border-0 shadow-xl bg-white/95 backdrop-blur-sm dark:bg-slate-900/95"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-3 px-3 py-3 text-left text-sm">
                    <div className="flex aspect-square size-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-semibold text-slate-900 dark:text-slate-100">
                          {user?.name || "User"}
                        </span>
                        <Badge
                          className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(
                            user?.role || "user",
                          )}`}
                        >
                          {getRoleDisplayName(user?.role || "user")}
                        </Badge>
                      </div>
                      <span className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {user?.email || "user@company.com"}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
                <DropdownMenuItem
                  onClick={() => setCurrentPage("profile")}
                  className="rounded-lg mx-1 my-1"
                >
                  <User className="mr-3 size-4" />
                  My Profile
                </DropdownMenuItem>
                {user?.role === "admin" && (
                  <DropdownMenuItem
                    onClick={() => setCurrentPage("users")}
                    className="rounded-lg mx-1 my-1"
                  >
                    <UserCog className="mr-3 size-4" />
                    User Management
                  </DropdownMenuItem>
                )}
                {(user?.role === "hr" || user?.role === "admin") && (
                  <DropdownMenuItem
                    onClick={() => setCurrentPage("settings")}
                    className="rounded-lg mx-1 my-1"
                  >
                    <Settings className="mr-3 size-4" />
                    Settings
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="rounded-lg mx-1 my-1">
                  <FileText className="mr-3 size-4" />
                  Support
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600 rounded-lg mx-1 my-1"
                >
                  <LogOut className="mr-3 size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Users,
  UserPlus,
  TrendingUp,
  Building2,
  MapPin,
  Briefcase,
} from "lucide-react";
import { AddEmployeeDialog } from "@/components/employees/add-employee-dialog";
import { EmployeeTable } from "@/components/employees/employee-table";
import { EmployeeDetailsDialog } from "@/components/employees/employee-details-dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { useEmployees } from "@/hooks/useEmployees";
import type { Employee } from "@/types";
import { useUsers } from "@/hooks/useUsers";

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    employees,
    total,
    totalPages,
    loading,
    error,
    refetch,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  } = useEmployees(currentPage, 10, searchTerm);

  const { users } = useUsers();

  console.log(employees);

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDetailsOpen(true);
  };

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-8">
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  // Calculate department distribution
  const departmentStats = employees.reduce((acc, emp) => {
    console.log(emp);
    acc[emp.department.name] = (acc[emp.department.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topDepartments = Object.entries(departmentStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="space-y-8 p-8 animate-fade-in">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Users className="w-8 h-8" />
                Employee Management
              </h1>
              <p className="text-blue-100 text-lg">
                Manage your team of {total} talented individuals
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{total}</div>
                <div className="text-sm text-blue-200">Total Employees</div>
              </div>
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-white/10"></div>
        <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-white/5"></div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="modern-card border-0 overflow-hidden">
          <CardContent className="p-0">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <Badge className="bg-blue-100 text-blue-700 border-0">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12%
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{total}</p>
                <p className="text-sm text-gray-600">Total Employees</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card border-0 overflow-hidden">
          <CardContent className="p-0">
            <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50">
                  <Building2 className="w-6 h-6 text-green-600" />
                </div>
                <Badge className="bg-green-100 text-green-700 border-0">
                  {Object.keys(departmentStats).length}
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {Object.keys(departmentStats).length}
                </p>
                <p className="text-sm text-gray-600">Departments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card border-0 overflow-hidden">
          <CardContent className="p-0">
            <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                </div>
                <Badge className="bg-purple-100 text-purple-700 border-0">
                  Active
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {users.filter((u) => u.employee).length}
                </p>
                <p className="text-sm text-gray-600">Active Employees</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card border-0 overflow-hidden">
          <CardContent className="p-0">
            <div className="h-2 bg-gradient-to-r from-orange-500 to-red-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-red-50">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <Badge className="bg-orange-100 text-orange-700 border-0">
                  Remote
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {Math.floor(employees.length * 0.3)}
                </p>
                <p className="text-sm text-gray-600">Remote Workers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search employees..."
              className="w-80 pl-10 h-11 modern-input border-0 shadow-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="h-11 modern-input border-0 shadow-lg"
          >
            <Filter className="mr-2 size-4" />
            Filter
          </Button>
        </div>
        <AddEmployeeDialog onAddEmployee={createEmployee} loading={loading} />
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Employee Table */}
        <Card className="modern-card border-0 lg:col-span-3">
          <CardContent className="p-0">
            {loading && employees.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <LoadingSpinner size="lg" className="mx-auto mb-4" />
                  <p className="text-gray-500">Loading employees...</p>
                </div>
              </div>
            ) : (
              <EmployeeTable
                employees={employees}
                onEditEmployee={handleEditEmployee}
                onDeleteEmployee={deleteEmployee}
                loading={loading}
              />
            )}
          </CardContent>
        </Card>

        {/* Department Overview */}
        <div className="space-y-6">
          <Card className="modern-card border-0">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Top Departments
              </h3>
              <div className="space-y-4">
                {topDepartments.map(([dept, count], index) => (
                  <div key={dept} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          index === 0
                            ? "bg-blue-500"
                            : index === 1
                            ? "bg-green-500"
                            : "bg-purple-500"
                        }`}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">
                        {dept}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card border-0">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-green-600" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add New Employee
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start modern-input border-0"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Manage Departments
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start modern-input border-0"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Export Employee Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {employees.length} of {total} employees
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || loading}
              className="modern-input border-0"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-500 px-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages || loading}
              className="modern-input border-0"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <EmployeeDetailsDialog
        employee={selectedEmployee}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onUpdateEmployee={updateEmployee}
      />
    </div>
  );
}

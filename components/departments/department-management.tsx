"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { useDepartments, type Department } from "@/hooks/useDepartments";
import {
  Plus,
  Edit,
  Trash2,
  Building2,
  Users,
  MapPin,
  Calendar,
  TrendingUp,
  Activity,
} from "lucide-react";

export function DepartmentManagement() {
  const {
    departments,
    loading,
    error,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  } = useDepartments();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "" });

  console.log(departments);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const success = await updateDepartment(editingId, formData);
      if (success) {
        setEditingId(null);
        setFormData({ name: "" });
      }
    } else {
      const success = await createDepartment(formData);
      if (success) {
        setIsAdding(false);
        setFormData({ name: "" });
      }
    }
  };

  const handleEdit = (department: Department) => {
    setEditingId(department.id);
    setFormData({
      name: department.name,
    });
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this department?")) {
      await deleteDepartment(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  // Calculate stats
  const stats = {
    total: departments.length,
    active: departments.filter((d) => d.name).length,
    avgEmployees: departments.reduce(
      (acc, dept) => acc + (dept.employees?.length || 0),
      0
    ),
    growth: "+12%",
  };

  return (
    <div className="space-y-8">
      {/* Modern Header with Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5 blur-2xl"></div>

        <div className="relative flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
                <Building2 className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Department Management</h1>
                <p className="text-white/80">
                  Organize and manage your company departments
                </p>
              </div>
            </div>
          </div>
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/20 text-white shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Plus className="mr-2 size-4" />
            Add Department
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Total Departments
            </CardTitle>
            <div className="rounded-full bg-blue-500/20 p-2">
              <Building2 className="size-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {stats.total}
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="size-3" />
              <span>Active departments</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-emerald-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Active Departments
            </CardTitle>
            <div className="rounded-full bg-green-500/20 p-2">
              <Activity className="size-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {stats.active}
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="size-3" />
              <span>Operational units</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-violet-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Avg Employees
            </CardTitle>
            <div className="rounded-full bg-purple-500/20 p-2">
              <Users className="size-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {stats.avgEmployees}
            </div>
            <div className="flex items-center gap-1 text-xs text-purple-600">
              <TrendingUp className="size-3" />
              <span>Per department</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-amber-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Growth Rate
            </CardTitle>
            <div className="rounded-full bg-orange-500/20 p-2">
              <TrendingUp className="size-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {stats.growth}
            </div>
            <div className="flex items-center gap-1 text-xs text-orange-600">
              <TrendingUp className="size-3" />
              <span>This quarter</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm animate-in slide-in-from-top-4 duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-500/20 p-2">
                {editingId ? (
                  <Edit className="size-4 text-blue-600" />
                ) : (
                  <Plus className="size-4 text-blue-600" />
                )}
              </div>
              {editingId ? "Edit Department" : "Add New Department"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Department Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter department name"
                  className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  required
                />
              </div>
              {/* <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700"
                >
                  Description
                </Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter department description"
                  className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div> */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all duration-300 hover:scale-105"
                >
                  {editingId ? "Update Department" : "Create Department"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    setFormData({ name: "" });
                  }}
                  className="border-gray-200 hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Departments Table */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-500/20 p-2">
              <Building2 className="size-5 text-blue-600" />
            </div>
            Company Departments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-100 bg-gray-50/50">
                <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider pl-6">
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4" />
                    Department
                  </div>
                </TableHead>
                {/* <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4" />
                    Description
                  </div>
                </TableHead> */}
                <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Users className="size-4" />
                    Employees
                  </div>
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4" />
                    Created
                  </div>
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider pr-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((department, index) => (
                <TableRow
                  key={department.id}
                  className="border-gray-100 hover:bg-blue-50/30 transition-all duration-200 group animate-in slide-in-from-left-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <TableCell className="font-medium pl-6">
                    <div className="flex items-center gap-3">
                      <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold shadow-lg">
                        {department.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {department.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Department ID: {department.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  {/* <TableCell>
                    <div className="text-gray-700">
                      {department.description || "No description"}
                    </div>
                  </TableCell> */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-green-100 px-2 py-1">
                        <span className="text-sm font-medium text-green-700">
                          {department.employees?.length} members
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {department.createdAt
                        ? new Date(department.createdAt)
                            .toISOString()
                            .split("T")[0]
                        : "Invalid date"}
                    </div>
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(department)}
                        className="h-8 w-8 p-0 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                      >
                        <Edit className="size-4 text-blue-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(department.id)}
                        className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                      >
                        <Trash2 className="size-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

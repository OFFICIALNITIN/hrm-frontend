"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, Edit, Eye, UserX, Mail, Phone } from "lucide-react";
import type { Employee } from "@/types";

interface EmployeeTableProps {
  employees: Employee[];
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployee: (id: string) => Promise<boolean>;
  loading?: boolean;
}

export function EmployeeTable({
  employees,
  onEditEmployee,
  onDeleteEmployee,
  loading = false,
}: EmployeeTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    console.log(id);
    setDeletingId(id);
    await onDeleteEmployee(id);
    setDeletingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-gray-100">
          <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider pl-6">
            Employee
          </TableHead>
          <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Department
          </TableHead>
          <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Contact
          </TableHead>
          {/* <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </TableHead> */}
          <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Join Date
          </TableHead>
          <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider pr-6">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((employee) => (
          <TableRow
            key={employee.id}
            className="border-gray-100 hover:bg-gray-50/50"
          >
            <TableCell className="font-medium pl-6">
              <div className="flex items-center gap-3">
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold shadow-lg">
                  {employee.firstName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {employee.firstName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {employee.jobTitle}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="font-medium text-gray-900">
                {employee.department.name}
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="size-3" />
                  {employee.user.email}
                </div>
                {/* {employee.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="size-3" />
                    {employee.phone}
                  </div>
                )} */}
              </div>
            </TableCell>
            {/* <TableCell>
              <Badge
                variant={employee.status === "Active" ? "default" : "secondary"}
                className={
                  employee.status === "Active"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : employee.status === "On Leave"
                      ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                }
              >
                {employee.status}
              </Badge>
            </TableCell> */}
            <TableCell>
              <div className="text-sm text-gray-900">
                {employee.hireDate.split("T")[0]}
              </div>
            </TableCell>
            <TableCell className="pr-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    disabled={deletingId === employee.id}
                  >
                    <span className="sr-only">Open menu</span>
                    {deletingId === employee.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    ) : (
                      <MoreHorizontal className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => onEditEmployee(employee)}>
                    <Eye className="mr-2 size-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEditEmployee(employee)}>
                    <Edit className="mr-2 size-4" />
                    Edit Employee
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => handleDelete(employee.id)}
                  >
                    <UserX className="mr-2 size-4" />
                    Remove Employee
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

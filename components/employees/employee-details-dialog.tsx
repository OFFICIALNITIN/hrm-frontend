"use client";
import { useState, useEffect } from "react";
import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { Employee, UpdateEmployeeDto } from "@/types";
import { useDepartments } from "@/hooks/useDepartments";

interface EmployeeDetailsDialogProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateEmployee: (
    id: string,
    employee: UpdateEmployeeDto
  ) => Promise<boolean>;
}

export function EmployeeDetailsDialog({
  employee,
  open,
  onOpenChange,
  onUpdateEmployee,
}: EmployeeDetailsDialogProps) {
  const [formData, setFormData] = useState<Employee | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const {
    departments,
    loading: departmentsLoading,
    error: departmentsError,
  } = useDepartments();

  console.log(departments);

  useEffect(() => {
    if (employee) {
      setFormData({ ...employee });
    }
  }, [employee]);

  if (!employee || !formData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const updateData: UpdateEmployeeDto = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      jobTitle: formData.jobTitle,
      salary: formData.salary,
      departmentId: formData.department.id,
      hireDate: formData.hireDate,
    };

    const success = await onUpdateEmployee(employee.id, updateData);

    if (success) {
      onOpenChange(false);
    }

    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Employee Details
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            View and edit employee information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <img
                src={"/placeholder.svg"}
                alt={formData.firstName}
                className="size-16 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold">
                  {formData.firstName} {formData.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {formData.jobTitle}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="editName" className="text-sm font-medium">
                  First Name
                </Label>
                <Input
                  id="editName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="h-9"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editName" className="text-sm font-medium">
                  Last Name
                </Label>
                <Input
                  id="editName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="h-9"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editEmail" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={formData.user.email}
                  disabled={true}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="h-9"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editPosition" className="text-sm font-medium">
                  Position
                </Label>
                <Input
                  id="editPosition"
                  value={formData.jobTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, jobTitle: e.target.value })
                  }
                  className="h-9"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="editDepartment" className="text-sm font-medium">
                  Department
                </Label>
                <Select
                  value={formData.department.id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, departmentId: Number(value) })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editSalary" className="text-sm font-medium">
                  Salary
                </Label>
                <Input
                  id="editSalary"
                  type="number"
                  value={formData.salary || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salary: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  className="h-9"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* <div className="grid gap-2">
                <Label htmlFor="editPhone" className="text-sm font-medium">
                  Phone
                </Label>
                <Input
                  id="editPhone"
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="h-9"
                />
              </div> */}

              <div className="grid gap-2">
                <Label htmlFor="editJoinDate" className="text-sm font-medium">
                  Join Date
                </Label>
                <Input
                  id="editJoinDate"
                  type="date"
                  value={
                    formData.hireDate
                      ? new Date(formData.hireDate).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, hireDate: e.target.value })
                  }
                  className="h-9"
                />
              </div>
            </div>
            {/* <div className="grid gap-2">
              <Label htmlFor="editAddress" className="text-sm font-medium">
                Address
              </Label>
              <Input
                id="editAddress"
                value={formData.address || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="h-9"
              />
            </div> */}
            <div className="grid grid-cols-2 gap-4">
              {/* <div className="grid gap-2">
                <Label htmlFor="editStatus" className="text-sm font-medium">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "Active" | "On Leave" | "Inactive") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";
import { useState } from "react";
import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { UserPlus } from "lucide-react";
import type { CreateEmployeeDto } from "@/types";
import { useDepartments } from "@/hooks/useDepartments";
import { useUsers } from "@/hooks/useUsers";

interface AddEmployeeDialogProps {
  onAddEmployee: (employee: CreateEmployeeDto) => Promise<boolean>;
  loading?: boolean;
}

export function AddEmployeeDialog({
  onAddEmployee,
  loading = false,
}: AddEmployeeDialogProps) {
  const { departments, loading: departmentsLoading } = useDepartments();
  const { users, loading: usersLoading } = useUsers();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateEmployeeDto>({
    firstName: "",
    lastName: "",
    departmentId: undefined,
    jobTitle: "",
    salary: undefined,
    hireDate: "",
    userId: "",
  });

  console.log(formData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const success = await onAddEmployee(formData);

    if (success) {
      setFormData({
        firstName: "",
        lastName: "",
        departmentId: undefined,
        jobTitle: "",
        salary: undefined,
        hireDate: "",
        userId: "",
      });
      setOpen(false);
    }

    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
          <UserPlus className="mr-2 size-4" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New Employee
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill in the employee details below to add them to the system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="Enter first name"
                  className="h-9"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="Enter Last name"
                  className="h-9"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="users" className="text-sm font-medium">
                Users
              </Label>
              <Select
                value={formData.userId}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    userId: value,
                  })
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select users" />
                </SelectTrigger>
                <SelectContent>
                  {usersLoading ? (
                    <SelectItem value="" disabled>
                      Loading users...
                    </SelectItem>
                  ) : (
                    users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.email}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            {/* <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter email address"
                className="h-9"
                required
              />
            </div> */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="department" className="text-sm font-medium">
                  Department
                </Label>
                <Select
                  value={
                    formData.departmentId !== undefined
                      ? String(formData.departmentId)
                      : ""
                  }
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      departmentId: value ? Number(value) : undefined,
                    })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentsLoading ? (
                      <SelectItem value="" disabled>
                        Loading departments...
                      </SelectItem>
                    ) : (
                      departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>
                          {dept.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="jobTitle" className="text-sm font-medium">
                  Job Title
                </Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, jobTitle: e.target.value })
                  }
                  placeholder="Enter position"
                  className="h-9"
                  required
                />
              </div>
            </div>
            {/* <div className="grid gap-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Enter phone number"
                className="h-9"
              />
            </div> */}
            {/* <div className="grid gap-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Address
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Enter address"
                className="h-9"
              />
            </div> */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="salary" className="text-sm font-medium">
                  Salary
                </Label>
                <Input
                  id="salary"
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
                  placeholder="Enter salary"
                  className="h-9"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hireDate" className="text-sm font-medium">
                  Hire Date
                </Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) =>
                    setFormData({ ...formData, hireDate: e.target.value })
                  }
                  className="h-9"
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
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
                  Adding...
                </>
              ) : (
                "Add Employee"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

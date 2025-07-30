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
import { useDepartments } from "@/hooks/useDepartments";
import { useEmployees } from "@/hooks/useEmployees";
import type { User, UpdateUserDto, UserRole, UserStatus } from "@/types";

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateUser: (id: string, user: UpdateUserDto) => Promise<boolean>;
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
  onUpdateUser,
}: EditUserDialogProps) {
  const { departments, loading: departmentsLoading } = useDepartments();
  const { employees, loading: employeesLoading } = useEmployees(1, 100);
  const [formData, setFormData] = useState<UpdateUserDto>({
    role: "user",
  });
  const [submitting, setSubmitting] = useState(false);
  console.log("user edit dialog", user);
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        role: user.role,

        employeeId: user?.employee?.id,
      });
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const success = await onUpdateUser(user.id, formData);
    console.log(formData);

    if (success) {
      onOpenChange(false);
    }

    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit User</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update user information and permissions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex aspect-square size-16 items-center justify-center rounded-full bg-blue-600 text-white text-xl font-medium">
                {user?.employee?.firstName.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {user?.employee?.firstName}
                  {""} {user?.employee?.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground">
                  User ID: {user.id}
                </p>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="editEmail" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="editEmail"
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="h-9"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="editRole" className="text-sm font-medium">
                  Role
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: UserRole) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Employee</SelectItem>
                    <SelectItem value="hr">HR Manager</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* <div className="grid gap-2">
                <Label htmlFor="editStatus" className="text-sm font-medium">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: UserStatus) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
              {formData.role === "user" && (
                <div className="grid gap-2">
                  <Label
                    htmlFor="editEmployeeId"
                    className="text-sm font-medium"
                  >
                    Linked Employee Record
                  </Label>
                  <Select
                    value={formData.employeeId || "NoEmployee"}
                    onValueChange={(value) =>
                      setFormData({ ...formData, employeeId: value })
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null">No employee linked</SelectItem>
                      {employeesLoading ? (
                        <SelectItem value="" disabled>
                          Loading employees...
                        </SelectItem>
                      ) : (
                        employees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.firstName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* {formData.role !== "user" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label
                    htmlFor="editDepartment"
                    className="text-sm font-medium"
                  >
                    Department
                  </Label>
                  <Select
                    value={formData. || "NoDepartment"}
                    onValueChange={(value) =>
                      setFormData({ ...formData, department: value })
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
                          <SelectItem key={dept.id} value={dept.name}>
                            {dept.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editPosition" className="text-sm font-medium">
                    Position
                  </Label>
                  <Input
                    id="editPosition"
                    value={formData.position || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    placeholder="Enter position"
                    className="h-9"
                  />
                </div>
              </div>
            )} */}
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

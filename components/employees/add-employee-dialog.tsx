"use client";
import { useState } from "react";
import type React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { UserPlus } from "lucide-react";
import type { CreateEmployeeDto } from "@/types";
import { useDepartments } from "@/hooks/useDepartments";
import { useUsers } from "@/hooks/useUsers";

// Zod validation schema
const createEmployeeSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters"),
  userId: z.string().min(1, "User is required"),
  departmentId: z
    .number({
      required_error: "Department is required",
      invalid_type_error: "Please select a valid department",
    })
    .int("Department must be a valid number")
    .positive("Please select a valid department"),
  jobTitle: z
    .string()
    .min(1, "Job title is required")
    .min(2, "Job title must be at least 2 characters")
    .max(100, "Job title must not exceed 100 characters"),
  salary: z
    .number({
      required_error: "Salary is required",
      invalid_type_error: "Salary must be a valid number",
    })
    .positive("Salary must be greater than 0")
    .max(10000000, "Salary seems unreasonably high"),
  hireDate: z
    .string()
    .min(1, "Hire date is required")
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(today.getFullYear() + 1);

      return selectedDate <= oneYearFromNow;
    }, "Hire date cannot be more than 1 year in the future")
    .refine((date) => {
      const selectedDate = new Date(date);
      const minimumDate = new Date("1900-01-01");

      return selectedDate >= minimumDate;
    }, "Please enter a valid hire date"),
});

type CreateEmployeeFormData = z.infer<typeof createEmployeeSchema>;

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

  const form = useForm<CreateEmployeeFormData>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      userId: "",
      departmentId: undefined,
      jobTitle: "",
      salary: undefined,
      hireDate: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    watch,
  } = form;

  // Watch form values for debugging
  const formValues = watch();
  console.log("Form values:", formValues);

  const onSubmit = async (data: CreateEmployeeFormData) => {
    try {
      const employeeData: CreateEmployeeDto = {
        ...data,
      };

      const success = await onAddEmployee(employeeData);

      if (success) {
        reset();
        setOpen(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
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
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter first name"
                          className="h-9"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter last name"
                          className="h-9"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">User</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                      </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Department
                      </FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value ? String(field.value) : ""}
                      >
                        <FormControl>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departmentsLoading ? (
                            <SelectItem value="" disabled>
                              Loading departments...
                            </SelectItem>
                          ) : (
                            departments.map((dept) => (
                              <SelectItem
                                key={dept.id}
                                value={dept.id.toString()}
                              >
                                {dept.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Job Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter position"
                          className="h-9"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Salary
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter salary"
                          className="h-9"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hireDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Hire Date
                      </FormLabel>
                      <FormControl>
                        <Input type="date" className="h-9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
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
        </Form>
      </DialogContent>
    </Dialog>
  );
}

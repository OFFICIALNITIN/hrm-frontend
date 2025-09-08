import { z } from "zod";

// Zod validation schema for creating a new employee
export const createEmployeeSchema = z.object({
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

// Type inference for the form data
export type CreateEmployeeFormData = z.infer<typeof createEmployeeSchema>;
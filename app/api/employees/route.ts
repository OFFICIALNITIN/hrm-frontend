import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Employee, PaginatedResponse, Department } from "@/types";

// the same seed data you used in the UI
const employees: Employee[] = [
  {
    id: "EMP001",
    firstName: "Alex",
    lastName: "Thompson",
    email: "alex@company.com",
    department: {
      id: 1,
      name: "Engineering",
      employees: [],
    },
    jobTitle: "Senior Developer",
    hireDate: "2022-03-15",
    departmentId: 1,
    user: {
      id: "user1",
      email: "alex@company.com",
      role: "user",
      employee: {} as Employee,
      lastLogin: "2024-01-01",
      createdAt: "2022-03-15",
      updatedAt: "2024-01-01",
    },
    salary: 95000,
    createdAt: "2022-03-15",
    updatedAt: "2024-01-01",
  },
  {
    id: "EMP002",
    firstName: "Maria",
    lastName: "Garcia",
    email: "maria@company.com",
    department: {
      id: 2,
      name: "Design",
      employees: [],
    },
    jobTitle: "UX Designer",
    hireDate: "2023-01-20",
    departmentId: 2,
    user: {
      id: "user2",
      email: "maria@company.com",
      role: "user",
      employee: {} as Employee,
      lastLogin: "2024-01-01",
      createdAt: "2023-01-20",
      updatedAt: "2024-01-01",
    },
    salary: 78000,
    createdAt: "2023-01-20",
    updatedAt: "2024-01-01",
  },
  {
    id: "EMP003",
    firstName: "James",
    lastName: "Wilson",
    email: "james@company.com",
    department: {
      id: 3,
      name: "Marketing",
      employees: [],
    },
    jobTitle: "Marketing Manager",
    hireDate: "2021-11-08",
    departmentId: 3,
    user: {
      id: "user3",
      email: "james@company.com",
      role: "user",
      employee: {} as Employee,
      lastLogin: "2024-01-01",
      createdAt: "2021-11-08",
      updatedAt: "2024-01-01",
    },
    salary: 85000,
    createdAt: "2021-11-08",
    updatedAt: "2024-01-01",
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? employees.length);

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated: PaginatedResponse<Employee> = {
    data: employees.slice(start, end),
    total: employees.length,
    page,
    limit,
    totalPages: Math.ceil(employees.length / limit),
  };

  return NextResponse.json(paginated);
}

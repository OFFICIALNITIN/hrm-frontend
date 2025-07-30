import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Employee, PaginatedResponse } from "@/types"

// the same seed data you used in the UI
const employees: Employee[] = [
  {
    id: "EMP001",
    name: "Alex Thompson",
    email: "alex@company.com",
    department: "Engineering",
    position: "Senior Developer",
    status: "Active",
    joinDate: "2022-03-15",
    avatar: "/placeholder.svg?height=40&width=40",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, San Francisco, CA",
    salary: 95000,
  },
  {
    id: "EMP002",
    name: "Maria Garcia",
    email: "maria@company.com",
    department: "Design",
    position: "UX Designer",
    status: "Active",
    joinDate: "2023-01-20",
    avatar: "/placeholder.svg?height=40&width=40",
    phone: "+1 (555) 234-5678",
    address: "456 Oak Ave, San Francisco, CA",
    salary: 78000,
  },
  {
    id: "EMP003",
    name: "James Wilson",
    email: "james@company.com",
    department: "Marketing",
    position: "Marketing Manager",
    status: "On Leave",
    joinDate: "2021-11-08",
    avatar: "/placeholder.svg?height=40&width=40",
    phone: "+1 (555) 345-6789",
    address: "789 Pine St, San Francisco, CA",
    salary: 85000,
  },
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get("page") ?? 1)
  const limit = Number(searchParams.get("limit") ?? employees.length)

  const start = (page - 1) * limit
  const end = start + limit

  const paginated: PaginatedResponse<Employee> = {
    data: employees.slice(start, end),
    total: employees.length,
    page,
    limit,
    totalPages: Math.ceil(employees.length / limit),
  }

  return NextResponse.json(paginated)
}

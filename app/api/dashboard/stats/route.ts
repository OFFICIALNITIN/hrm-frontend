import { NextResponse } from "next/server"
import type { DashboardStats, Employee, ApiResponse } from "@/types"

import employeesRaw from "@/app/api/employees/route" // re-use the same list

const employees: Employee[] = (employeesRaw as any).employees ?? []

export async function GET() {
  const stats: DashboardStats = {
    totalEmployees: employees.length,
    presentToday: employees.filter((e) => e.status === "Active").length,
    onLeave: employees.filter((e) => e.status === "On Leave").length,
    avgPerformance: 8.7,
  }

  const res: ApiResponse<DashboardStats> = {
    data: stats,
    message: "Dashboard stats",
    statusCode: 200,
  }

  return NextResponse.json(res)
}

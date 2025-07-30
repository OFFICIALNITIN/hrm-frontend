"use client"

import { useState } from "react"

export interface PayrollRecord {
  id: string
  employeeId: string
  employeeName: string
  month: string
  year: number
  basicSalary: number
  allowances: number
  deductions: number
  overtime: number
  bonus: number
  grossPay: number
  tax: number
  netPay: number
  status: "Processed" | "Pending" | "Draft"
  processedDate?: string
  createdAt: string
}

export interface PayrollSummary {
  totalEmployees: number
  totalGrossPay: number
  totalNetPay: number
  totalTax: number
  totalDeductions: number
  averageSalary: number
}

// Mock payroll data
const mockPayrollRecords: PayrollRecord[] = [
  {
    id: "PAY001",
    employeeId: "EMP001",
    employeeName: "Alex Thompson",
    month: "January",
    year: 2024,
    basicSalary: 95000,
    allowances: 5000,
    deductions: 2000,
    overtime: 1500,
    bonus: 3000,
    grossPay: 104500,
    tax: 18810,
    netPay: 85690,
    status: "Processed",
    processedDate: "2024-01-31T10:00:00Z",
    createdAt: "2024-01-25T09:00:00Z",
  },
  {
    id: "PAY002",
    employeeId: "EMP002",
    employeeName: "Maria Garcia",
    month: "January",
    year: 2024,
    basicSalary: 78000,
    allowances: 3000,
    deductions: 1500,
    overtime: 800,
    bonus: 2000,
    grossPay: 82300,
    tax: 14814,
    netPay: 67486,
    status: "Processed",
    processedDate: "2024-01-31T10:00:00Z",
    createdAt: "2024-01-25T09:00:00Z",
  },
  {
    id: "PAY003",
    employeeId: "EMP003",
    employeeName: "James Wilson",
    month: "January",
    year: 2024,
    basicSalary: 85000,
    allowances: 4000,
    deductions: 1800,
    overtime: 0,
    bonus: 1500,
    grossPay: 88700,
    tax: 15966,
    netPay: 72734,
    status: "Processed",
    processedDate: "2024-01-31T10:00:00Z",
    createdAt: "2024-01-25T09:00:00Z",
  },
  {
    id: "PAY004",
    employeeId: "EMP004",
    employeeName: "Emily Chen",
    month: "January",
    year: 2024,
    basicSalary: 82000,
    allowances: 3500,
    deductions: 1600,
    overtime: 1200,
    bonus: 2500,
    grossPay: 87600,
    tax: 15768,
    netPay: 71832,
    status: "Processed",
    processedDate: "2024-01-31T10:00:00Z",
    createdAt: "2024-01-25T09:00:00Z",
  },
  {
    id: "PAY005",
    employeeId: "EMP005",
    employeeName: "David Rodriguez",
    month: "January",
    year: 2024,
    basicSalary: 88000,
    allowances: 4500,
    deductions: 2200,
    overtime: 600,
    bonus: 2000,
    grossPay: 92900,
    tax: 16722,
    netPay: 76178,
    status: "Pending",
    createdAt: "2024-01-25T09:00:00Z",
  },
  {
    id: "PAY006",
    employeeId: "EMP006",
    employeeName: "Sarah Johnson",
    month: "January",
    year: 2024,
    basicSalary: 65000,
    allowances: 2500,
    deductions: 1200,
    overtime: 400,
    bonus: 1000,
    grossPay: 67700,
    tax: 12186,
    netPay: 55514,
    status: "Draft",
    createdAt: "2024-01-25T09:00:00Z",
  },
]

export function usePayroll(month?: string, year?: number, employeeId?: string) {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(mockPayrollRecords)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filter payroll records
  const getFilteredRecords = () => {
    let filtered = payrollRecords

    if (month) {
      filtered = filtered.filter((record) => record.month === month)
    }

    if (year) {
      filtered = filtered.filter((record) => record.year === year)
    }

    if (employeeId) {
      filtered = filtered.filter((record) => record.employeeId === employeeId)
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // Calculate payroll summary
  const getPayrollSummary = (): PayrollSummary => {
    const filtered = getFilteredRecords()

    return {
      totalEmployees: filtered.length,
      totalGrossPay: filtered.reduce((sum, record) => sum + record.grossPay, 0),
      totalNetPay: filtered.reduce((sum, record) => sum + record.netPay, 0),
      totalTax: filtered.reduce((sum, record) => sum + record.tax, 0),
      totalDeductions: filtered.reduce((sum, record) => sum + record.deductions, 0),
      averageSalary:
        filtered.length > 0 ? filtered.reduce((sum, record) => sum + record.basicSalary, 0) / filtered.length : 0,
    }
  }

  const processPayroll = async (recordId: string): Promise<boolean> => {
    try {
      setError(null)
      setLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setPayrollRecords((prev) =>
        prev.map((record) =>
          record.id === recordId
            ? {
                ...record,
                status: "Processed" as const,
                processedDate: new Date().toISOString(),
              }
            : record,
        ),
      )
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process payroll")
      return false
    } finally {
      setLoading(false)
    }
  }

  const generatePayslip = async (recordId: string): Promise<boolean> => {
    try {
      setError(null)
      setLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // In a real app, this would generate and download a PDF
      console.log("Generating payslip for record:", recordId)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate payslip")
      return false
    } finally {
      setLoading(false)
    }
  }

  const refetch = async () => {
    setError(null)
  }

  return {
    payrollRecords: getFilteredRecords(),
    payrollSummary: getPayrollSummary(),
    loading,
    error,
    refetch,
    processPayroll,
    generatePayslip,
  }
}

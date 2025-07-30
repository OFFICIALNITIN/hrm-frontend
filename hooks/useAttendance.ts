"use client"

import { useState } from "react"
import type { AttendanceRecord, PaginatedResponse } from "@/types"

// Mock attendance data
const mockAttendance: AttendanceRecord[] = [
  {
    id: "ATT001",
    employeeId: "EMP001",
    employeeName: "Alex Thompson",
    date: "2024-01-25",
    checkIn: "09:00",
    checkOut: "17:30",
    status: "Present",
    hoursWorked: 8.5,
  },
  {
    id: "ATT002",
    employeeId: "EMP002",
    employeeName: "Maria Garcia",
    date: "2024-01-25",
    checkIn: "09:15",
    checkOut: "17:45",
    status: "Late",
    hoursWorked: 8.5,
  },
  {
    id: "ATT003",
    employeeId: "EMP003",
    employeeName: "James Wilson",
    date: "2024-01-25",
    checkIn: "",
    checkOut: "",
    status: "Absent",
    hoursWorked: 0,
  },
  {
    id: "ATT004",
    employeeId: "EMP004",
    employeeName: "Emily Chen",
    date: "2024-01-25",
    checkIn: "08:45",
    checkOut: "17:15",
    status: "Present",
    hoursWorked: 8.5,
  },
  {
    id: "ATT005",
    employeeId: "EMP005",
    employeeName: "David Rodriguez",
    date: "2024-01-25",
    checkIn: "09:30",
    checkOut: "13:00",
    status: "Half Day",
    hoursWorked: 3.5,
  },
  {
    id: "ATT006",
    employeeId: "EMP001",
    employeeName: "Alex Thompson",
    date: "2024-01-24",
    checkIn: "08:55",
    checkOut: "17:25",
    status: "Present",
    hoursWorked: 8.5,
  },
  {
    id: "ATT007",
    employeeId: "EMP002",
    employeeName: "Maria Garcia",
    date: "2024-01-24",
    checkIn: "09:00",
    checkOut: "17:30",
    status: "Present",
    hoursWorked: 8.5,
  },
  {
    id: "ATT008",
    employeeId: "EMP004",
    employeeName: "Emily Chen",
    date: "2024-01-24",
    checkIn: "09:10",
    checkOut: "17:40",
    status: "Late",
    hoursWorked: 8.5,
  },
]

export function useAttendance(date?: string, page = 1, limit = 10, employeeId?: string) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filter attendance based on criteria
  const getFilteredAttendance = () => {
    let filtered = attendance

    if (date) {
      filtered = filtered.filter((record) => record.date === date)
    }

    if (employeeId) {
      filtered = filtered.filter((record) => record.employeeId === employeeId)
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  // Get paginated data
  const getPaginatedData = (): PaginatedResponse<AttendanceRecord> => {
    const filteredAttendance = getFilteredAttendance()
    const startIndex = (page - 1) * limit
    const paginatedAttendance = filteredAttendance.slice(startIndex, startIndex + limit)

    return {
      data: paginatedAttendance,
      total: filteredAttendance.length,
      page,
      limit,
      totalPages: Math.ceil(filteredAttendance.length / limit),
    }
  }

  const markAttendance = async (empId: string, checkIn: string, checkOut?: string): Promise<boolean> => {
    try {
      setError(null)
      setLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      const today = new Date().toISOString().split("T")[0]
      const existingRecord = attendance.find((record) => record.employeeId === empId && record.date === today)

      if (existingRecord) {
        // Update existing record
        setAttendance((prev) =>
          prev.map((record) =>
            record.id === existingRecord.id
              ? {
                  ...record,
                  checkOut: checkOut || record.checkOut,
                  hoursWorked: checkOut ? calculateHours(record.checkIn, checkOut) : record.hoursWorked,
                  status: determineStatus(record.checkIn, checkOut),
                }
              : record,
          ),
        )
      } else {
        // Create new record
        const newRecord: AttendanceRecord = {
          id: `ATT${(attendance.length + 1).toString().padStart(3, "0")}`,
          employeeId: empId,
          employeeName: "Employee Name", // In real app, fetch from employee ID
          date: today,
          checkIn,
          checkOut: checkOut || "",
          status: determineStatus(checkIn, checkOut),
          hoursWorked: checkOut ? calculateHours(checkIn, checkOut) : 0,
        }

        setAttendance((prev) => [...prev, newRecord])
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark attendance")
      return false
    } finally {
      setLoading(false)
    }
  }

  const calculateHours = (checkIn: string, checkOut: string): number => {
    const [inHour, inMin] = checkIn.split(":").map(Number)
    const [outHour, outMin] = checkOut.split(":").map(Number)

    const inMinutes = inHour * 60 + inMin
    const outMinutes = outHour * 60 + outMin

    return (outMinutes - inMinutes) / 60
  }

  const determineStatus = (checkIn: string, checkOut?: string): AttendanceRecord["status"] => {
    if (!checkIn) return "Absent"

    const [hour] = checkIn.split(":").map(Number)

    if (checkOut) {
      const hoursWorked = calculateHours(checkIn, checkOut)
      if (hoursWorked < 4) return "Half Day"
    }

    if (hour > 9) return "Late"
    return "Present"
  }

  const refetch = async () => {
    setError(null)
  }

  const paginatedData = getPaginatedData()

  return {
    attendance: paginatedData.data,
    total: paginatedData.total,
    totalPages: paginatedData.totalPages,
    currentPage: paginatedData.page,
    loading,
    error,
    refetch,
    markAttendance,
  }
}

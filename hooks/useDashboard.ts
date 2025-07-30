"use client"

import { useState, useEffect } from "react"
import type { DashboardStats } from "@/types"

// Mock dashboard stats
const mockStats: DashboardStats = {
  totalEmployees: 6,
  presentToday: 5,
  onLeave: 1,
  avgPerformance: 8.7,
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      setStats(mockStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch dashboard stats")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}

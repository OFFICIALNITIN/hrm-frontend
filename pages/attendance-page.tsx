"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { useAttendance } from "@/hooks/useAttendance";
import { useAuth } from "@/contexts/auth-context";
import {
  Clock,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Timer,
  TrendingUp,
  Activity,
  Target,
  MapPin,
  Coffee,
} from "lucide-react";

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");

  // Add a try-catch to handle SSR case where useAuth is not available
  let user = null;
  let authLoading = false;
  try {
    const auth = useAuth();
    user = auth.user;
    authLoading = auth.loading;
  } catch (error) {
    // During SSR, useAuth will throw an error
    // We'll handle this gracefully
    authLoading = true;
  }

  const employeeId = user?.role === "user" ? user.employee?.id : undefined;
  const {
    attendance,
    total,
    totalPages,
    loading,
    error,
    refetch,
    markAttendance,
  } = useAttendance(selectedDate, currentPage, 10, employeeId);

  // Show loading state during SSR or when auth is loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const handleMarkAttendance = async (type: "checkin" | "checkout") => {
    if (!user?.employee?.id) return;

    const time = type === "checkin" ? checkInTime : checkOutTime;
    if (!time) return;

    const success = await markAttendance(
      user.employee.id,
      type === "checkin" ? time : "",
      type === "checkout" ? time : undefined
    );

    if (success) {
      setCheckInTime("");
      setCheckOutTime("");
      refetch();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800";
      case "Late":
        return "bg-orange-100 text-orange-800";
      case "Absent":
        return "bg-red-100 text-red-800";
      case "Half Day":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Present":
        return <CheckCircle className="size-4" />;
      case "Late":
        return <AlertCircle className="size-4" />;
      case "Absent":
        return <XCircle className="size-4" />;
      case "Half Day":
        return <Timer className="size-4" />;
      default:
        return <Clock className="size-4" />;
    }
  };

  // Calculate stats
  const stats = {
    total: attendance.length,
    present: attendance.filter((a) => a.status === "Present").length,
    late: attendance.filter((a) => a.status === "Late").length,
    absent: attendance.filter((a) => a.status === "Absent").length,
    avgHours:
      attendance.length > 0
        ? attendance.reduce((sum, a) => sum + a.hoursWorked, 0) /
          attendance.length
        : 0,
  };

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-8">
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8 animate-fade-in">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Clock className="w-8 h-8" />
                {user?.role === "user"
                  ? "My Attendance"
                  : "Attendance Management"}
              </h1>
              <p className="text-purple-100 text-lg">
                {user?.role === "user"
                  ? "Track your time and productivity"
                  : "Monitor team attendance patterns"}
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.present}</div>
                <div className="text-sm text-purple-200">Present Today</div>
              </div>
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Activity className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-white/10"></div>
        <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-white/5"></div>
      </div>

      {/* Date Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Label htmlFor="date" className="text-lg font-semibold text-gray-700">
            Select Date:
          </Label>
          <Input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-48 h-11 modern-input border-0 shadow-lg"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-5">
        <Card className="modern-card border-0 overflow-hidden">
          <CardContent className="p-0">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <Badge className="bg-blue-100 text-blue-700 border-0">
                  Total
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stats.total}
                </p>
                <p className="text-sm text-gray-600">Records</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card border-0 overflow-hidden">
          <CardContent className="p-0">
            <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <Badge className="bg-green-100 text-green-700 border-0">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  On Time
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stats.present}
                </p>
                <p className="text-sm text-gray-600">Present</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card border-0 overflow-hidden">
          <CardContent className="p-0">
            <div className="h-2 bg-gradient-to-r from-orange-500 to-red-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-red-50">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <Badge className="bg-orange-100 text-orange-700 border-0">
                  Late
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stats.late}
                </p>
                <p className="text-sm text-gray-600">Late Arrivals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card border-0 overflow-hidden">
          <CardContent className="p-0">
            <div className="h-2 bg-gradient-to-r from-red-500 to-pink-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-red-50 to-pink-50">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <Badge className="bg-red-100 text-red-700 border-0">
                  Absent
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stats.absent}
                </p>
                <p className="text-sm text-gray-600">Absences</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card border-0 overflow-hidden">
          <CardContent className="p-0">
            <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50">
                  <Timer className="w-6 h-6 text-purple-600" />
                </div>
                <Badge className="bg-purple-100 text-purple-700 border-0">
                  Avg
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stats.avgHours.toFixed(1)}h
                </p>
                <p className="text-sm text-gray-600">Hours Worked</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions for Employees */}
      {user?.role === "user" && (
        <Card className="modern-card border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              Quick Check-In/Out
            </CardTitle>
            <CardDescription>Mark your attendance for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4 p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900">Check In</h3>
                    <p className="text-sm text-green-700">Start your workday</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="time"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    className="flex-1 modern-input border-green-200"
                  />
                  <Button
                    onClick={() => handleMarkAttendance("checkin")}
                    disabled={!checkInTime || loading}
                    className="bg-green-600 hover:bg-green-700 text-white px-6"
                  >
                    {loading ? <LoadingSpinner size="sm" /> : "Check In"}
                  </Button>
                </div>
              </div>

              <div className="space-y-4 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Coffee className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">Check Out</h3>
                    <p className="text-sm text-blue-700">End your workday</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="time"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                    className="flex-1 modern-input border-blue-200"
                  />
                  <Button
                    onClick={() => handleMarkAttendance("checkout")}
                    disabled={!checkOutTime || loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  >
                    {loading ? <LoadingSpinner size="sm" /> : "Check Out"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Table */}
      <Card className="modern-card border-0">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-600" />
            Attendance Records
          </CardTitle>
          <CardDescription>
            {user?.role === "user"
              ? "Your attendance history"
              : "Employee attendance for selected date"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading && attendance.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <LoadingSpinner size="lg" className="mx-auto mb-4" />
                <p className="text-gray-500">Loading attendance records...</p>
              </div>
            </div>
          ) : (
            <div className="modern-table">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-100">
                    <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider pl-6">
                      Employee
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check In
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check Out
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hours Worked
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider pr-6">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.map((record) => (
                    <TableRow
                      key={record.id}
                      className="border-gray-100 hover:bg-gray-50/50"
                    >
                      <TableCell className="font-medium pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {record.employeeName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {record.employeeName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {record.employeeId}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {new Date(record.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {record.checkIn || "—"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {record.checkOut || "—"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {record.hoursWorked.toFixed(1)}h
                        </div>
                      </TableCell>
                      <TableCell className="pr-6">
                        <Badge
                          className={`${getStatusColor(
                            record.status
                          )} flex items-center gap-1 w-fit`}
                        >
                          {getStatusIcon(record.status)}
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {attendance.length} of {total} records
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || loading}
              className="modern-input border-0"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-500 px-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages || loading}
              className="modern-input border-0"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

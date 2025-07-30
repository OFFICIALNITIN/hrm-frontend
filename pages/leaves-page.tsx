"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { useAuth } from "@/contexts/auth-context";
import {
  Calendar,
  Plus,
  Check,
  X,
  Clock,
  CalendarDays,
  FileText,
  Filter,
  Search,
  MoreHorizontal,
  Plane,
  Heart,
  Briefcase,
  Home,
  AlertTriangle,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiService } from "@/services/api";
import type { LeaveRequest, LeaveRequestStatus } from "@/types";
import { useLeaveRequests } from "@/hooks/useLeaveRequests";

// Helper to calculate days between two dates (inclusive)
function calculateDays(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  // Calculate difference in milliseconds, then convert to days
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? diffDays : 0;
}

export function LeavesPage() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newRequest, setNewRequest] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  // Use the custom hook for leave requests
  const {
    leaveRequests,
    total,
    totalPages,
    loading,
    error,
    refetch,
    createLeaveRequest,
    updateLeaveRequestStatus,
    fetchLeaveRequests,
    fetchAllRequests,
    deleteLeaveRequest,
    approveRequest,
    rejectRequest,
  } = useLeaveRequests(
    currentPage,
    10,
    user?.role === "user" ? user?.id : undefined,
    statusFilter && statusFilter !== "all" ? statusFilter : undefined,
  );

  console.log(leaveRequests);
  // Fetch leave requests on mount and when currentPage changes
  useEffect(() => {
    if (user?.role === "admin" || user?.role === "hr") return;
    fetchLeaveRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    if (user?.role === "user") return;
    fetchAllRequests(statusFilter as LeaveRequestStatus);
  }, [statusFilter]);

  const handleCreateRequest = async () => {
    if (
      !newRequest.type ||
      !newRequest.startDate ||
      !newRequest.endDate ||
      !newRequest.reason
    )
      return;

    setSubmitting(true);
    const success = await createLeaveRequest({
      type: newRequest.type,
      startDate: newRequest.startDate,
      endDate: newRequest.endDate,
      reason: newRequest.reason,
    });

    if (success) {
      setNewRequest({ type: "", startDate: "", endDate: "", reason: "" });
      setNewRequestOpen(false);
      fetchLeaveRequests();
    }
    setSubmitting(false);
  };

  const handleStatusUpdate = async (
    id: string,
    status: "Approved" | "Rejected",
  ) => {
    const success = await updateLeaveRequestStatus(id, status);
    if (success) {
      fetchLeaveRequests();
    }
  };

  const handleDeleteRequest = async (id: string) => {
    const success = await deleteLeaveRequest(id);
    if (success) {
      fetchAllRequests();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <Check className="size-4" />;
      case "Rejected":
        return <X className="size-4" />;
      case "Pending":
        return <Clock className="size-4" />;
      default:
        return <FileText className="size-4" />;
    }
  };

  const getLeaveTypeIcon = (type: string) => {
    switch (type) {
      case "annual":
        return <Plane className="size-4" />;
      case "sick":
        return <Heart className="size-4" />;
      case "unpaid":
        return <Home className="size-4" />;
      default:
        return <Briefcase className="size-4" />;
    }
  };

  // Calculate stats
  const stats = {
    total: leaveRequests.length || 0,
    pending: leaveRequests.filter((r) => r.status === "pending").length,
    approved: leaveRequests.filter((r) => r.status === "approved").length,
    rejected: leaveRequests.filter((r) => r.status === "rejected").length,
    totalDays: leaveRequests.reduce(
      (sum, r) => sum + calculateDays(r.startDate, r.endDate),
      0,
    ),
  };

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-8">
        <ErrorMessage message={error} onRetry={fetchLeaveRequests} />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8 animate-fade-in">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Calendar className="w-8 h-8" />
                {user?.role === "user"
                  ? "My Leave Requests"
                  : "Leave Management"}
              </h1>
              <p className="text-cyan-100 text-lg">
                {user?.role === "user"
                  ? "Manage your time off and work-life balance"
                  : "Review and approve employee leave requests"}
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.pending}</div>
                <div className="text-sm text-cyan-200">Pending Requests</div>
              </div>
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <CalendarDays className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-white/10"></div>
        <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-white/5"></div>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {user?.role !== "user" && (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search requests..."
                  className="w-80 pl-10 h-11 modern-input border-0 shadow-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 h-11 modern-input border-0 shadow-lg">
                  <Filter className="mr-2 size-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
        </div>
        <Dialog open={newRequestOpen} onOpenChange={setNewRequestOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white border-0 shadow-lg">
              <Plus className="mr-2 size-4" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] modern-card border-0">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Create Leave Request
              </DialogTitle>
              <DialogDescription>
                Submit a new leave request for approval.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Leave Type</Label>
                <Select
                  value={newRequest.type}
                  onValueChange={(value) =>
                    setNewRequest({ ...newRequest, type: value })
                  }
                >
                  <SelectTrigger className="modern-input">
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annual">
                      <div className="flex items-center gap-2">
                        <Plane className="w-4 h-4" />
                        Annual Leave
                      </div>
                    </SelectItem>
                    <SelectItem value="sick">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        Sick Leave
                      </div>
                    </SelectItem>
                    <SelectItem value="unpaid">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        Unpiad
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newRequest.startDate}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        startDate: e.target.value,
                      })
                    }
                    className="modern-input"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newRequest.endDate}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, endDate: e.target.value })
                    }
                    className="modern-input"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  placeholder="Please provide a reason for your leave request..."
                  value={newRequest.reason}
                  onChange={(e) =>
                    setNewRequest({ ...newRequest, reason: e.target.value })
                  }
                  rows={3}
                  className="modern-input"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setNewRequestOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateRequest}
                disabled={submitting}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
              >
                {submitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-5">
        <Card className="modern-card border-0 overflow-hidden">
          <CardContent className="p-0">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <Badge className="bg-blue-100 text-blue-700 border-0">
                  Total
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stats.total}
                </p>
                <p className="text-sm text-gray-600">Requests</p>
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
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <Badge className="bg-orange-100 text-orange-700 border-0">
                  Pending
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stats.pending}
                </p>
                <p className="text-sm text-gray-600">Awaiting</p>
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
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <Badge className="bg-green-100 text-green-700 border-0">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Approved
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stats.approved}
                </p>
                <p className="text-sm text-gray-600">Approved</p>
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
                  <X className="w-6 h-6 text-red-600" />
                </div>
                <Badge className="bg-red-100 text-red-700 border-0">
                  Rejected
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stats.rejected}
                </p>
                <p className="text-sm text-gray-600">Rejected</p>
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
                  <CalendarDays className="w-6 h-6 text-purple-600" />
                </div>
                <Badge className="bg-purple-100 text-purple-700 border-0">
                  Days
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stats.totalDays}
                </p>
                <p className="text-sm text-gray-600">Total Days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Requests Table */}
      <Card className="modern-card border-0">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="w-6 h-6 text-teal-600" />
            Leave Requests
          </CardTitle>
          <CardDescription>
            {user?.role === "user"
              ? "Your leave request history"
              : "Employee leave requests requiring review"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading && leaveRequests.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <LoadingSpinner size="lg" className="mx-auto mb-4" />
                <p className="text-gray-500">Loading leave requests...</p>
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
                      Type
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Days
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider pr-6">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests.map((request, idx) => (
                    <TableRow
                      key={request.id}
                      className="border-gray-100 hover:bg-gray-50/50"
                    >
                      <TableCell className="font-medium pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-semibold">
                            {request?.employee?.firstName
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {request?.employee?.firstName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.employee.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="font-medium flex items-center gap-1"
                        >
                          {getLeaveTypeIcon(request.type)}
                          {request.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {new Date(request.startDate).toLocaleDateString()}
                          </div>
                          <div className="text-gray-500">
                            to {new Date(request.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {calculateDays(request.startDate, request.endDate)}{" "}
                          days
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className="max-w-xs truncate text-sm text-gray-900"
                          title={request.reason}
                        >
                          {request.reason}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusColor(
                            request.status,
                          )} flex items-center gap-1 w-fit`}
                        >
                          {getStatusIcon(request.status)}
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6">
                        {user?.role !== "user" &&
                        request.status === "pending" ? (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => approveRequest(request.id)}
                              className="bg-green-600 hover:bg-green-700 text-white h-8 px-3"
                              disabled={loading}
                            >
                              <Check className="size-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => rejectRequest(request.id)}
                              className="text-red-600 border-red-200 hover:bg-red-50 h-8 px-3"
                              disabled={loading}
                            >
                              <X className="size-3" />
                            </Button>
                          </div>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="modern-card border-0"
                            >
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              {request.status === "pending" &&
                                user?.role === "user" && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDeleteRequest(request.id)
                                      }
                                      className="text-red-600"
                                    >
                                      Cancel Request
                                    </DropdownMenuItem>
                                  </>
                                )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
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
            Showing {leaveRequests.length} of {total} requests
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

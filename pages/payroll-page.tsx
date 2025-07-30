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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { usePayroll } from "@/hooks/usePayroll";
import { useAuth } from "@/contexts/auth-context";
import {
  DollarSign,
  Download,
  FileText,
  TrendingUp,
  Users,
  Calculator,
  CreditCard,
  PiggyBank,
  Receipt,
  Banknote,
  Wallet,
  TrendingDown,
  Activity,
  Calendar,
  Clock,
} from "lucide-react";

export function PayrollPage() {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedYear, setSelectedYear] = useState(2024);

  const employeeId = user?.role === "user" ? user.employeeId : undefined;
  const {
    payrollRecords,
    payrollSummary,
    loading,
    error,
    refetch,
    processPayroll,
    generatePayslip,
  } = usePayroll(selectedMonth, selectedYear, employeeId);

  const handleProcessPayroll = async (recordId: string) => {
    const success = await processPayroll(recordId);
    if (success) {
      refetch();
    }
  };

  const handleGeneratePayslip = async (recordId: string) => {
    const success = await generatePayslip(recordId);
    if (success) {
      alert("Payslip generated successfully!");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processed":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200";
      case "Draft":
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200";
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-8 p-6 bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Modern Header with Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5 blur-2xl"></div>

        <div className="relative flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
                <PiggyBank className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {user?.role === "user" ? "My Payroll" : "Payroll Management"}
                </h1>
                <p className="text-white/80">
                  {user?.role === "user"
                    ? "View your salary and payslips"
                    : "Manage employee payroll and compensation"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-32 h-10 bg-white/20 border-white/20 text-white backdrop-blur-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="January">January</SelectItem>
                <SelectItem value="February">February</SelectItem>
                <SelectItem value="March">March</SelectItem>
                <SelectItem value="April">April</SelectItem>
                <SelectItem value="May">May</SelectItem>
                <SelectItem value="June">June</SelectItem>
                <SelectItem value="July">July</SelectItem>
                <SelectItem value="August">August</SelectItem>
                <SelectItem value="September">September</SelectItem>
                <SelectItem value="October">October</SelectItem>
                <SelectItem value="November">November</SelectItem>
                <SelectItem value="December">December</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(Number(value))}
            >
              <SelectTrigger className="w-24 h-10 bg-white/20 border-white/20 text-white backdrop-blur-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {user?.role !== "user" && (
        <div className="grid gap-6 md:grid-cols-6">
          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Total Employees
              </CardTitle>
              <div className="rounded-full bg-blue-500/20 p-2">
                <Users className="size-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {payrollSummary.totalEmployees}
              </div>
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <Activity className="size-3" />
                <span>Active payroll</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-emerald-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Gross Pay
              </CardTitle>
              <div className="rounded-full bg-green-500/20 p-2">
                <DollarSign className="size-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(payrollSummary.totalGrossPay)}
              </div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="size-3" />
                <span>Before deductions</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-violet-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Net Pay
              </CardTitle>
              <div className="rounded-full bg-purple-500/20 p-2">
                <CreditCard className="size-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(payrollSummary.totalNetPay)}
              </div>
              <div className="flex items-center gap-1 text-xs text-purple-600">
                <Wallet className="size-3" />
                <span>After deductions</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-red-50 to-rose-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Total Tax
              </CardTitle>
              <div className="rounded-full bg-red-500/20 p-2">
                <Receipt className="size-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(payrollSummary.totalTax)}
              </div>
              <div className="flex items-center gap-1 text-xs text-red-600">
                <TrendingDown className="size-3" />
                <span>Tax withheld</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-amber-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Deductions
              </CardTitle>
              <div className="rounded-full bg-orange-500/20 p-2">
                <Calculator className="size-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(payrollSummary.totalDeductions)}
              </div>
              <div className="flex items-center gap-1 text-xs text-orange-600">
                <TrendingDown className="size-3" />
                <span>Total deductions</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-indigo-50 to-blue-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Avg Salary
              </CardTitle>
              <div className="rounded-full bg-indigo-500/20 p-2">
                <TrendingUp className="size-4 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(payrollSummary.averageSalary)}
              </div>
              <div className="flex items-center gap-1 text-xs text-indigo-600">
                <Banknote className="size-3" />
                <span>Average base salary</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payroll Records Table */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-lg bg-green-500/20 p-2">
              <PiggyBank className="size-5 text-green-600" />
            </div>
            {user?.role === "user" ? "My Payroll History" : "Payroll Records"}
          </CardTitle>
          <CardDescription>
            {user?.role === "user"
              ? "Your salary breakdown and payslip history"
              : `Payroll records for ${selectedMonth} ${selectedYear}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading && payrollRecords.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <LoadingSpinner size="lg" className="mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Loading payroll records...
                </p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100 bg-gray-50/50">
                  <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider pl-6">
                    <div className="flex items-center gap-2">
                      <Users className="size-4" />
                      Employee
                    </div>
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4" />
                      Period
                    </div>
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Banknote className="size-4" />
                      Basic Salary
                    </div>
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <DollarSign className="size-4" />
                      Gross Pay
                    </div>
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calculator className="size-4" />
                      Deductions
                    </div>
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Wallet className="size-4" />
                      Net Pay
                    </div>
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Activity className="size-4" />
                      Status
                    </div>
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollRecords.map((record, index) => (
                  <TableRow
                    key={record.id}
                    className="border-gray-100 hover:bg-green-50/30 transition-all duration-200 group animate-in slide-in-from-left-4"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <TableCell className="font-medium pl-6">
                      <div className="flex items-center gap-3">
                        <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white text-sm font-bold shadow-lg">
                          {record.employeeName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {record.employeeName}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {record.employeeId}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="size-4 text-gray-400" />
                        <div className="font-medium text-gray-900">
                          {record.month} {record.year}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(record.basicSalary)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(record.grossPay)}
                      </div>
                      <div className="text-xs text-green-600">
                        +
                        {formatCurrency(
                          record.allowances + record.overtime + record.bonus
                        )}{" "}
                        extras
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(record.deductions + record.tax)}
                      </div>
                      <div className="text-xs text-red-600">
                        Tax: {formatCurrency(record.tax)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-green-600 text-lg">
                        {formatCurrency(record.netPay)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getStatusColor(record.status)} border`}
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {record.status === "Processed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGeneratePayslip(record.id)}
                            className="h-8 px-3 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                            disabled={loading}
                          >
                            <Download className="size-3 mr-1 text-green-600" />
                            <span className="text-green-600">Payslip</span>
                          </Button>
                        )}
                        {user?.role !== "user" &&
                          record.status !== "Processed" && (
                            <Button
                              size="sm"
                              onClick={() => handleProcessPayroll(record.id)}
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-8 px-3 shadow-lg transition-all duration-300 hover:scale-105"
                              disabled={loading}
                            >
                              {loading ? (
                                <LoadingSpinner size="sm" />
                              ) : (
                                "Process"
                              )}
                            </Button>
                          )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Employee Payroll Details */}
      {user?.role === "user" && payrollRecords.length > 0 && (
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-500/20 p-2">
                <FileText className="size-5 text-blue-600" />
              </div>
              Salary Breakdown
            </CardTitle>
            <CardDescription>
              Detailed breakdown of your current salary components
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {payrollRecords.map((record) => (
              <div
                key={record.id}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
              >
                <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-100 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <TrendingUp className="size-5 text-green-600" />
                      Earnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Basic Salary:
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(record.basicSalary)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Allowances:</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(record.allowances)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Overtime:</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(record.overtime)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bonus:</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(record.bonus)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-red-50 to-rose-100 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <TrendingDown className="size-5 text-red-600" />
                      Deductions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Income Tax:</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(record.tax)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Other Deductions:
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(record.deductions)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Calculator className="size-5 text-blue-600" />
                      Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Gross Pay:</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(record.grossPay)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-3">
                      <span className="font-semibold text-gray-900">
                        Net Pay:
                      </span>
                      <span className="font-bold text-green-600 text-lg">
                        {formatCurrency(record.netPay)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-purple-50 to-violet-100 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <FileText className="size-5 text-purple-600" />
                      Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {record.status === "Processed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGeneratePayslip(record.id)}
                        className="w-full border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
                        disabled={loading}
                      >
                        <Download className="size-4 mr-2 text-purple-600" />
                        <span className="text-purple-600">
                          Download Payslip
                        </span>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

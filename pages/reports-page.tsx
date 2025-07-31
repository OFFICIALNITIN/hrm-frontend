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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useReports } from "@/hooks/useReports";
import {
  AreaChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
  RadialBarChart,
  RadialBar,
  ComposedChart,
  Legend,
} from "recharts";
import {
  FileText,
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  BarChart3,
  Activity,
  Target,
  Award,
  Clock,
  UserCheck,
  Briefcase,
  Heart,
  Plane,
  Home,
  AlertCircle,
  Baby,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const COLORS = [
  "#6366F1",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#EC4899",
  "#84CC16",
];
const GRADIENT_COLORS = [
  { start: "#6366F1", end: "#8B5CF6" },
  { start: "#10B981", end: "#06B6D4" },
  { start: "#F59E0B", end: "#EF4444" },
  { start: "#EC4899", end: "#F59E0B" },
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}:{" "}
            {typeof entry.value === "number" && entry.name.includes("$")
              ? `$${entry.value.toLocaleString()}`
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom legend component (handles undefined payload safely)
const CustomLegend = ({ payload }: any) => {
  if (!Array.isArray(payload) || payload.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-600">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState("employee-growth");
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf" | "excel">(
    "pdf"
  );
  const [timeRange, setTimeRange] = useState("6months");
  const { reportData, loading, error, refetch, generateReport, exportData } =
    useReports();

  const handleGenerateReport = async () => {
    const success = await generateReport(selectedReport);
    if (success) {
      alert("Report generated successfully!");
    }
  };

  const handleExportData = async (dataType: string) => {
    const success = await exportData(dataType, exportFormat);
    if (success) {
      alert(`Data exported as ${exportFormat.toUpperCase()} successfully!`);
    }
  };

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-8 p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 min-h-screen">
      {/* Modern Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <BarChart3 className="size-6" />
              </div>
              <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            </div>
            <p className="text-blue-100 text-lg">
              Comprehensive insights into your HR data and trends
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={exportFormat}
              onValueChange={(value: "csv" | "pdf" | "excel") =>
                setExportFormat(value)
              }
            >
              <SelectTrigger className="w-24 bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleGenerateReport}
              disabled={loading}
              className="bg-white/20 hover:bg-white/30 border-white/20 backdrop-blur-sm"
            >
              {loading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <FileText className="mr-2 size-4" />
              )}
              Generate Report
            </Button>
          </div>
        </div>
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Enhanced Quick Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Employees
            </CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Users className="size-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-gray-900 mb-1">45</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUpRight className="size-4" />
                <span className="text-sm font-medium">+6.7%</span>
              </div>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
            <Progress value={75} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-gray-600">
              Attendance Rate
            </CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <UserCheck className="size-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-gray-900 mb-1">92.4%</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUpRight className="size-4" />
                <span className="text-sm font-medium">+2.1%</span>
              </div>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
            <Progress value={92} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-100">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-500/10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Payroll
            </CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <DollarSign className="size-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-gray-900 mb-1">$450K</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUpRight className="size-4" />
                <span className="text-sm font-medium">+5.2%</span>
              </div>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
            <Progress value={68} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-100">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-gray-600">
              Turnover Rate
            </CardTitle>
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <TrendingDown className="size-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-gray-900 mb-1">8.5%</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-green-600">
                <ArrowDownRight className="size-4" />
                <span className="text-sm font-medium">-1.2%</span>
              </div>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
            <Progress value={15} className="mt-3 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Modern Charts Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Employee Growth - Modern Area Chart */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <TrendingUp className="size-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold">
                    Employee Growth Trend
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    Monthly hiring and departure analysis
                  </CardDescription>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExportData("employee-growth")}
                disabled={loading}
              >
                <Download className="size-4 mr-1" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={reportData.employeeGrowth ?? []}>
                <defs>
                  <linearGradient
                    id="employeeGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient
                    id="hiresGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
                <Area
                  type="monotone"
                  dataKey="employees"
                  stroke="#6366F1"
                  strokeWidth={3}
                  fill="url(#employeeGradient)"
                  name="Total Employees"
                />
                <Bar
                  dataKey="newHires"
                  fill="#10B981"
                  name="New Hires"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="departures"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name="Departures"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance Analytics - Radial Chart */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                  <Activity className="size-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold">
                    Attendance Overview
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    Department-wise attendance metrics
                  </CardDescription>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExportData("attendance-stats")}
                disabled={loading}
              >
                <Download className="size-4 mr-1" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="20%"
                outerRadius="90%"
                data={reportData.attendanceStats ?? []}
              >
                <RadialBar
                  dataKey="present"
                  cornerRadius={10}
                  fill="#10B981"
                  background={{ fill: "#F3F4F6" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconSize={12}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ paddingTop: "20px" }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Leave Analysis - Modern Donut Chart */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Calendar className="size-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold">
                    Leave Distribution
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    Leave requests by type and status
                  </CardDescription>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExportData("leave-analysis")}
                disabled={loading}
              >
                <Download className="size-4 mr-1" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reportData.leaveAnalysis ?? []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="total"
                  >
                    {reportData.leaveAnalysis.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-4">
                {reportData.leaveAnalysis.map((item, index) => {
                  const getLeaveIcon = (type: string) => {
                    switch (type.toLowerCase()) {
                      case "vacation":
                        return <Plane className="size-4" />;
                      case "sick leave":
                        return <Heart className="size-4" />;
                      case "personal":
                        return <Home className="size-4" />;
                      case "maternity/paternity":
                        return <Baby className="size-4" />;
                      case "emergency":
                        return <AlertCircle className="size-4" />;
                      default:
                        return <Calendar className="size-4" />;
                    }
                  };

                  return (
                    <div
                      key={item.type}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-lg text-white"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        >
                          {getLeaveIcon(item.type)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {item.type}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.total} requests
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {item.approved}
                        </div>
                        <div className="text-xs text-gray-500">approved</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payroll Trends - Gradient Area Chart */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg">
                  <DollarSign className="size-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold">
                    Payroll Analytics
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    Monthly payroll and overtime trends
                  </CardDescription>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExportData("payroll-trends")}
                disabled={loading}
              >
                <Download className="size-4 mr-1" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={reportData.payrollTrends ?? []}>
                <defs>
                  <linearGradient
                    id="payrollGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient
                    id="overtimeGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  content={<CustomTooltip />}
                  formatter={(value: any) => [`$${value.toLocaleString()}`, ""]}
                />
                <Legend content={<CustomLegend />} />
                <Area
                  type="monotone"
                  dataKey="totalPayroll"
                  stackId="1"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#payrollGradient)"
                  name="Total Payroll"
                />
                <Area
                  type="monotone"
                  dataKey="overtime"
                  stackId="2"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  fill="url(#overtimeGradient)"
                  name="Overtime"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Department Statistics */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                <Briefcase className="size-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">
                  Department Performance
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Comprehensive department-wise metrics and KPIs
                </CardDescription>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleExportData("department-stats")}
              disabled={loading}
            >
              <Download className="size-4 mr-1" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100 bg-gray-50/50">
                  <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider pl-6 py-4">
                    Department
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider py-4">
                    Team Size
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider py-4">
                    Avg Salary
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider py-4">
                    Turnover
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider py-4">
                    Performance
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider pr-6 py-4">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.departmentStats.map((dept, index) => {
                  const performanceScore = Math.round(100 - dept.turnoverRate);
                  const getStatusBadge = (score: number) => {
                    if (score >= 90)
                      return (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <Award className="size-3 mr-1" />
                          Excellent
                        </Badge>
                      );
                    if (score >= 80)
                      return (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          <Target className="size-3 mr-1" />
                          Good
                        </Badge>
                      );
                    if (score >= 70)
                      return (
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          <Clock className="size-3 mr-1" />
                          Average
                        </Badge>
                      );
                    return (
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        <AlertCircle className="size-3 mr-1" />
                        Needs Attention
                      </Badge>
                    );
                  };

                  return (
                    <TableRow
                      key={dept.department}
                      className="border-gray-100 hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-blue-50/30 transition-all duration-200"
                    >
                      <TableCell className="font-medium pl-6 py-4">
                        <div className="flex items-center gap-4">
                          <div
                            className="flex aspect-square size-10 items-center justify-center rounded-xl text-white text-sm font-semibold shadow-lg"
                            style={{
                              background: `linear-gradient(135deg, ${
                                COLORS[index % COLORS.length]
                              }, ${COLORS[(index + 1) % COLORS.length]})`,
                            }}
                          >
                            {dept.department.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {dept.department}
                            </div>
                            <div className="text-sm text-gray-500">
                              Department
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <Users className="size-4 text-gray-400" />
                          <span className="font-semibold text-gray-900">
                            {dept.employees}
                          </span>
                          <span className="text-sm text-gray-500">members</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="size-4 text-gray-400" />
                          <span className="font-semibold text-gray-900">
                            ${dept.avgSalary.toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="size-4 text-gray-400" />
                          <span className="font-semibold text-gray-900">
                            {dept.turnoverRate}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              {performanceScore}%
                            </span>
                            <Sparkles className="size-4 text-yellow-500" />
                          </div>
                          <Progress value={performanceScore} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell className="pr-6 py-4">
                        {getStatusBadge(performanceScore)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

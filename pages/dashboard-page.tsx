"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/contexts/auth-context";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import {
  Users,
  Building2,
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  UserCheck,
  AlertCircle,
  CheckCircle,
  XCircle,
  Activity,
  Target,
  Award,
  Zap,
} from "lucide-react";

export default function DashboardPage() {
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
  const { stats, loading, error } = useDashboard();

  // Show loading state during SSR or when auth is loading
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message="Failed to load dashboard data" />;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const statCards = [
    {
      title: "Total Employees",
      value: stats?.totalEmployees || 0,
      change: "+12%",
      trend: "up",
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      title: "Departments",
      value: 3, // Mock value since totalDepartments is not in DashboardStats
      change: "+2",
      trend: "up",
      icon: Building2,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
    },
    {
      title: "Present Today",
      value: stats?.presentToday || 0,
      change: "94%",
      trend: "up",
      icon: UserCheck,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
    },
    {
      title: "On Leave",
      value: stats?.onLeave || 0,
      change: "-3",
      trend: "down",
      icon: Calendar,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
    },
  ];

  return (
    <div className="space-y-8 p-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {getGreeting()}, {user?.email}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                Here's what's happening at your company today
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-blue-200">Today</p>
                <p className="text-xl font-semibold">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
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

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card
            key={stat.title}
            className={`modern-card animate-slide-up border-0 overflow-hidden`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-0">
              <div className={`h-2 bg-gradient-to-r ${stat.gradient}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgGradient}`}
                  >
                    <stat.icon
                      className={`w-6 h-6 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                    />
                  </div>
                  <Badge
                    variant={stat.trend === "up" ? "default" : "secondary"}
                    className={`${
                      stat.trend === "up"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    } border-0`}
                  >
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="modern-card lg:col-span-2 border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest updates from your team</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="modern-input">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                user: "Sarah Johnson",
                action: "submitted a leave request",
                time: "2 minutes ago",
                type: "leave",
                icon: Calendar,
                color: "text-orange-600",
                bg: "bg-orange-50",
              },
              {
                user: "Mike Chen",
                action: "clocked in",
                time: "15 minutes ago",
                type: "attendance",
                icon: Clock,
                color: "text-green-600",
                bg: "bg-green-50",
              },
              {
                user: "Emily Davis",
                action: "updated profile information",
                time: "1 hour ago",
                type: "profile",
                icon: Users,
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                user: "Alex Rodriguez",
                action: "completed training module",
                time: "2 hours ago",
                type: "training",
                icon: Award,
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${activity.bg}`}>
                  <activity.icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    <span className="font-semibold">{activity.user}</span>{" "}
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="modern-card border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0">
                <Users className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start modern-input"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Meeting
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start modern-input"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Process Payroll
              </Button>
            </CardContent>
          </Card>

          {/* Attendance Overview */}
          <Card className="modern-card border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Today's Attendance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Present</span>
                  <span className="font-medium">94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="space-y-1">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-2xl font-bold text-green-600">
                      {stats?.presentToday || 0}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Present</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-red-600 mr-1" />
                    <span className="text-2xl font-bold text-red-600">
                      {stats?.onLeave || 0}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Absent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pending Approvals (for HR/Admin) */}
      {(user?.role === "hr" || user?.role === "admin") && (
        <Card className="modern-card border-0">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Pending Approvals
            </CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  <Badge className="bg-amber-100 text-amber-700 border-0">
                    3
                  </Badge>
                </div>
                <h3 className="font-semibold text-amber-900">Leave Requests</h3>
                <p className="text-sm text-amber-700">Awaiting approval</p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <Badge className="bg-blue-100 text-blue-700 border-0">
                    2
                  </Badge>
                </div>
                <h3 className="font-semibold text-blue-900">New Employees</h3>
                <p className="text-sm text-blue-700">Pending onboarding</p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  <Badge className="bg-purple-100 text-purple-700 border-0">
                    1
                  </Badge>
                </div>
                <h3 className="font-semibold text-purple-900">
                  Expense Reports
                </h3>
                <p className="text-sm text-purple-700">Need review</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

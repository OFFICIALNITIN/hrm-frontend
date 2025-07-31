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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/contexts/auth-context";
import {
  Building2,
  Bell,
  Shield,
  Mail,
  Clock,
  Calendar,
  DollarSign,
  Users,
  Save,
  RefreshCw,
  Settings,
} from "lucide-react";

export default function SettingsPage() {
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
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    // Company Settings
    companyName: "Company Inc.",
    companyEmail: "admin@company.com",
    companyPhone: "+1 (555) 123-4567",
    companyAddress: "123 Business St, San Francisco, CA 94105",
    companyWebsite: "https://company.com",

    // HR Policies
    workingHoursStart: "09:00",
    workingHoursEnd: "17:00",
    lunchBreakDuration: "60",
    weeklyWorkingDays: "5",
    annualLeaveEntitlement: "25",
    sickLeaveEntitlement: "10",

    // Payroll Settings
    payrollFrequency: "monthly",
    payrollProcessingDay: "last",
    overtimeRate: "1.5",
    taxRate: "18",

    // Notification Settings
    emailNotifications: true,
    leaveRequestNotifications: true,
    payrollNotifications: true,
    attendanceAlerts: true,
    systemMaintenanceAlerts: true,

    // Security Settings
    passwordExpiry: "90",
    sessionTimeout: "480",
    twoFactorAuth: false,
    loginAttempts: "5",
  });

  // Show loading state during SSR or when auth is loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const handleSave = async (section: string) => {
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert(`${section} settings saved successfully!`);
    setLoading(false);
  };

  const handleReset = (section: string) => {
    if (
      confirm(`Are you sure you want to reset ${section} settings to default?`)
    ) {
      // Reset logic would go here
      alert(`${section} settings reset to default values.`);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 bg-gray-50/50">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-600 via-gray-600 to-zinc-700 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5 blur-2xl"></div>

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
              <Settings className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">System Settings</h1>
              <p className="text-white/80">
                Configure your HR management system preferences and policies
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Company Information */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm lg:col-span-2">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="size-5" />
              Company Information
            </CardTitle>
            <CardDescription>
              Basic company details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={settings.companyName}
                  onChange={(e) =>
                    setSettings({ ...settings, companyName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyEmail">Company Email</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={settings.companyEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, companyEmail: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyPhone">Phone Number</Label>
                <Input
                  id="companyPhone"
                  value={settings.companyPhone}
                  onChange={(e) =>
                    setSettings({ ...settings, companyPhone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyWebsite">Website</Label>
                <Input
                  id="companyWebsite"
                  value={settings.companyWebsite}
                  onChange={(e) =>
                    setSettings({ ...settings, companyWebsite: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyAddress">Address</Label>
              <Textarea
                id="companyAddress"
                value={settings.companyAddress}
                onChange={(e) =>
                  setSettings({ ...settings, companyAddress: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => handleReset("Company")}>
                <RefreshCw className="size-4 mr-2" />
                Reset
              </Button>
              <Button onClick={() => handleSave("Company")} disabled={loading}>
                {loading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Save className="size-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Users className="size-4 mr-2" />
              Backup User Data
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Mail className="size-4 mr-2" />
              Send System Announcement
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="size-4 mr-2" />
              Schedule Maintenance
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="size-4 mr-2" />
              Security Audit
            </Button>
          </CardContent>
        </Card>

        {/* Working Hours & Policies */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-5" />
              Working Hours & Policies
            </CardTitle>
            <CardDescription>
              Configure work schedules and leave policies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="workStart">Work Start Time</Label>
                <Input
                  id="workStart"
                  type="time"
                  value={settings.workingHoursStart}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      workingHoursStart: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workEnd">Work End Time</Label>
                <Input
                  id="workEnd"
                  type="time"
                  value={settings.workingHoursEnd}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      workingHoursEnd: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lunchBreak">Lunch Break (minutes)</Label>
                <Input
                  id="lunchBreak"
                  type="number"
                  value={settings.lunchBreakDuration}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      lunchBreakDuration: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workingDays">Weekly Working Days</Label>
                <Input
                  id="workingDays"
                  type="number"
                  min="1"
                  max="7"
                  value={settings.weeklyWorkingDays}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      weeklyWorkingDays: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="annualLeave">Annual Leave (days)</Label>
                <Input
                  id="annualLeave"
                  type="number"
                  value={settings.annualLeaveEntitlement}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      annualLeaveEntitlement: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sickLeave">Sick Leave (days)</Label>
                <Input
                  id="sickLeave"
                  type="number"
                  value={settings.sickLeaveEntitlement}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sickLeaveEntitlement: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => handleReset("HR Policies")}
              >
                <RefreshCw className="size-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={() => handleSave("HR Policies")}
                disabled={loading}
              >
                {loading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Save className="size-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payroll Settings */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="size-5" />
              Payroll Settings
            </CardTitle>
            <CardDescription>
              Configure payroll processing and tax settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payrollFreq">Payroll Frequency</Label>
              <Select
                value={settings.payrollFrequency}
                onValueChange={(value) =>
                  setSettings({ ...settings, payrollFrequency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payrollDay">Processing Day</Label>
              <Select
                value={settings.payrollProcessingDay}
                onValueChange={(value) =>
                  setSettings({ ...settings, payrollProcessingDay: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="first">1st of Month</SelectItem>
                  <SelectItem value="15th">15th of Month</SelectItem>
                  <SelectItem value="last">Last Day of Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="overtimeRate">Overtime Rate (x)</Label>
                <Input
                  id="overtimeRate"
                  type="number"
                  step="0.1"
                  value={settings.overtimeRate}
                  onChange={(e) =>
                    setSettings({ ...settings, overtimeRate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) =>
                    setSettings({ ...settings, taxRate: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => handleReset("Payroll")}>
                <RefreshCw className="size-4 mr-2" />
                Reset
              </Button>
              <Button onClick={() => handleSave("Payroll")} disabled={loading}>
                {loading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Save className="size-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Bell className="size-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Configure system notifications and alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, emailNotifications: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Leave Request Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Notify when leave requests are submitted
                </p>
              </div>
              <Switch
                checked={settings.leaveRequestNotifications}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    leaveRequestNotifications: checked,
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Payroll Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Notify about payroll processing
                </p>
              </div>
              <Switch
                checked={settings.payrollNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, payrollNotifications: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Attendance Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Alert for attendance irregularities
                </p>
              </div>
              <Switch
                checked={settings.attendanceAlerts}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, attendanceAlerts: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>System Maintenance</Label>
                <p className="text-sm text-muted-foreground">
                  Notify about system updates
                </p>
              </div>
              <Switch
                checked={settings.systemMaintenanceAlerts}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, systemMaintenanceAlerts: checked })
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => handleReset("Notifications")}
              >
                <RefreshCw className="size-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={() => handleSave("Notifications")}
                disabled={loading}
              >
                {loading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Save className="size-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Configure security policies and authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                <Input
                  id="passwordExpiry"
                  type="number"
                  value={settings.passwordExpiry}
                  onChange={(e) =>
                    setSettings({ ...settings, passwordExpiry: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">
                  Session Timeout (minutes)
                </Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) =>
                    setSettings({ ...settings, sessionTimeout: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="loginAttempts">Max Login Attempts</Label>
              <Input
                id="loginAttempts"
                type="number"
                value={settings.loginAttempts}
                onChange={(e) =>
                  setSettings({ ...settings, loginAttempts: e.target.value })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Require 2FA for all users
                </p>
              </div>
              <Switch
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, twoFactorAuth: checked })
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => handleReset("Security")}>
                <RefreshCw className="size-4 mr-2" />
                Reset
              </Button>
              <Button onClick={() => handleSave("Security")} disabled={loading}>
                {loading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Save className="size-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

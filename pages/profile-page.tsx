"use client";

import { useEffect, useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth-context";
import { getRoleDisplayName, getRoleBadgeColor } from "@/utils/permissions";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Briefcase,
  Edit,
  Save,
  X,
  Clock,
  CreditCard,
  FileText,
} from "lucide-react";

export function ProfilePage() {
  const { user, getCurrentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    email: user?.email || "",
  });

  const handleSave = () => {
    // TODO: Implement profile update API call
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      email: user?.email || "",
    });
    setIsEditing(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.userId) {
        return;
      }
      const res = await getCurrentUser(user?.userId);
      console.log(res);
    };

    fetchUser();
  }, [user?.id]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 bg-gray-50/50">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          <p className="text-muted-foreground">
            Manage your personal information and settings
          </p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
          className={
            isEditing ? "" : "bg-blue-600 hover:bg-blue-700 text-white"
          }
        >
          {isEditing ? (
            <>
              <X className="mr-2 size-4" />
              Cancel
            </>
          ) : (
            <>
              <Edit className="mr-2 size-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Overview */}
        <Card className="md:col-span-1 border-0 shadow-sm bg-white">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="flex aspect-square size-20 items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-medium">
                {user?.email?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>
            <CardTitle className="text-xl">{user?.name}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {user?.email}
            </CardDescription>
            <div className="flex justify-center mt-2">
              <Badge className={`${getRoleBadgeColor(user?.role || "user")}`}>
                {getRoleDisplayName(user?.role || "user")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Building2 className="size-4 text-muted-foreground" />
              <span>{user?.department || "Not specified"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Briefcase className="size-4 text-muted-foreground" />
              <span>{user?.position || "Not specified"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="size-4 text-muted-foreground" />
              <span>Joined March 2024</span>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="md:col-span-2 border-0 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                    <User className="size-4 text-muted-foreground" />
                    <span>{user?.name}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                    <Mail className="size-4 text-muted-foreground" />
                    <span>{user?.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Enter phone number"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                    <Phone className="size-4 text-muted-foreground" />
                    <span>{formData.phone || "Not provided"}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                {isEditing ? (
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Enter address"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                    <MapPin className="size-4 text-muted-foreground" />
                    <span>{formData.address || "Not provided"}</span>
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <>
                <Separator />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Save className="mr-2 size-4" />
                    Save Changes
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions for Employees */}
      {user?.role === "user" && (
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-4">
              <Button variant="outline" className="h-12 flex-col gap-1">
                <Calendar className="size-4" />
                <span className="text-xs">Request Leave</span>
              </Button>
              <Button variant="outline" className="h-12 flex-col gap-1">
                <Clock className="size-4" />
                <span className="text-xs">View Attendance</span>
              </Button>
              <Button variant="outline" className="h-12 flex-col gap-1">
                <CreditCard className="size-4" />
                <span className="text-xs">View Payslip</span>
              </Button>
              <Button variant="outline" className="h-12 flex-col gap-1">
                <FileText className="size-4" />
                <span className="text-xs">Documents</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

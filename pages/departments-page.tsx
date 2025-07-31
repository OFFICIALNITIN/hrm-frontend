"use client";

import { DepartmentManagement } from "@/components/departments/department-management";

export default function DepartmentsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 bg-gray-50/50">
      <DepartmentManagement />
    </div>
  );
}

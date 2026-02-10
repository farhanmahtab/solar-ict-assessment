"use client";

import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { useState } from "react";
import { 
  UserCircle, 
  Mail, 
  ShieldCheck, 
  Clock, 
  LayoutDashboard,
  Calendar,
  Shield,
  Fingerprint
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { useUserManagement } from "@/hooks/useUserManagement";
import { EditUserModal } from "@/components/dashboard/modals/EditUserModal";
import { formatRole } from "@/lib/utils";

export default function ProfilePage() {
  const { user, logout, loading: authLoading, refresh } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    openEditModal,
    isEditModalOpen,
    setIsEditModalOpen,
    selectedUser,
    formData,
    setFormData,
    handleUpdateUser,
  } = useUserManagement(user, authLoading, refresh);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-8 h-8 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50/30">
      <Sidebar
        currentUser={user}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onEditProfile={() => openEditModal(user)}
        onLogout={logout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center shadow-xl shadow-black/10">
                <UserCircle className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                  {user.username}
                </h1>
                <p className="text-gray-500 font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => openEditModal(user)} variant="outline" className="font-bold border-gray-200">
                Edit Profile
              </Button>
              <Button asChild variant="outline" className="font-bold border-gray-200 gap-2">
                <Link href="/dashboard">
                  <LayoutDashboard size={18} />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={<Shield className="text-gray-900" />}
              label="Account Role"
              value={formatRole(user.role)}
              description="System Identity"
            />
            <StatCard
              icon={<Fingerprint className="text-gray-900" />}
              label="User ID"
              value={`#${user.id}`}
              description="Unique Identifier"
            />
            <StatCard
              icon={<Clock className="text-gray-900" />}
              label="Status"
              value={user.isValidated ? "Active" : "Pending"}
              description="Account Verification"
              trend={user.isValidated ? "up" : "stable"}
            />
          </div>

          <Card className="border-none ring-1 ring-gray-100 shadow-xl shadow-gray-200/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold">Profile Details</CardTitle>
              <CardDescription>Comprehensive information about your workspace account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <DetailItem 
                  icon={<UserCircle size={18} />} 
                  label="Display Name" 
                  value={user.username} 
                />
                <DetailItem 
                  icon={<Mail size={18} />} 
                  label="Email Address" 
                  value={user.email} 
                />
                <DetailItem 
                  icon={<ShieldCheck size={18} />} 
                  label="Access Level" 
                  value={formatRole(user.role)} 
                  badge
                />
                <DetailItem 
                  icon={<Calendar size={18} />} 
                  label="Joined Workspace" 
                  value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "N/A"} 
                />
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      <EditUserModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        currentUser={user}
        selectedUser={selectedUser}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleUpdateUser}
      />
    </div>
  );
}

function DetailItem({ icon, label, value, badge = false }: { icon: React.ReactNode; label: string; value: string; badge?: boolean }) {
  return (
    <div className="space-y-1.5 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
      <div className="flex items-center gap-2 text-gray-400">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <div className="pl-6">
        {badge ? (
          <Badge className="bg-black text-white hover:bg-black font-bold uppercase tracking-tighter text-[10px]">
            {value}
          </Badge>
        ) : (
          <p className="font-bold text-gray-900">{value}</p>
        )}
      </div>
    </div>
  );
}

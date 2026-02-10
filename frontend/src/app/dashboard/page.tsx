"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserManagement } from "@/hooks/useUserManagement";
import { Role } from "@/types";
import { UserManagementTable } from "@/components/UserManagementTable";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { CreateUserModal } from "@/components/dashboard/modals/CreateUserModal";
import { EditUserModal } from "@/components/dashboard/modals/EditUserModal";
import { ResetPasswordModal } from "@/components/dashboard/modals/ResetPasswordModal";
import { Users, ShieldCheck, Activity, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const {
    user: currentUser,
    logout,
    loading: authLoading,
    refresh,
  } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const {
    users,
    loading,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isResetModalOpen,
    setIsResetModalOpen,
    selectedUser,
    formData,
    setFormData,
    resetPasswordData,
    setResetPasswordData,
    handleDelete,
    handleCreateUser,
    handleUpdateUser,
    handleAdminResetPassword,
    handleChangeRole,
    openCreateModal,
    openEditModal,
    openResetModal,
    accessLevelDescription,
  } = useUserManagement(currentUser, authLoading, refresh);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Loading Workspace
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="flex min-h-screen bg-gray-50/30">
      <Sidebar
        currentUser={currentUser}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onEditProfile={() => openEditModal(currentUser)}
        onLogout={logout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                System Workspace
              </h1>
              <p className="text-gray-500 font-medium text-lg">
                Detailed overview of your user network and system status.
              </p>
            </div>
            {currentUser.role === Role.GLOBAL_ADMIN && (
              <Button
                onClick={openCreateModal}
                className="bg-black hover:bg-gray-800 text-white shadow-lg shadow-black/5 gap-2 px-5 h-11 font-bold"
              >
                <Plus size={18} />
                Create New User
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={<Users className="text-gray-900" />}
              label="Active Users"
              value={users.length?.toString()}
              description="+2 from last hour"
              trend="up"
            />
            <StatCard
              icon={<ShieldCheck className="text-gray-900" />}
              label="Permissions Tier"
              value={currentUser.role.split("_")[0]}
              description={accessLevelDescription}
              secondary={currentUser.role.split("_")[1] || ""}
            />
          </div>
          {currentUser.role === Role.ADMIN_USER ||
          currentUser.role === Role.GLOBAL_ADMIN ? (
            <Card className="border-gray-200/60 shadow-xl shadow-gray-200/30 bg-white overflow-hidden border-none ring-1 ring-gray-100">
              <CardHeader className="flex flex-row items-center justify-between pb-6">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-bold tracking-tight">
                    User Management
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-medium">
                    View and manage all registered users across the platform.
                  </CardDescription>
                </div>
                <div className="flex gap-2"></div>
              </CardHeader>
              <CardContent className="p-0 border-t border-gray-50">
                <UserManagementTable
                  users={users}
                  currentUser={currentUser}
                  onDelete={handleDelete}
                  onEdit={openEditModal}
                  onChangeRole={handleChangeRole}
                  onResetPassword={openResetModal}
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-2 border-gray-200 bg-white/50 backdrop-blur-sm shadow-none p-12 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                <Activity size={32} />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Welcome, {currentUser.username}
                </CardTitle>
                <CardDescription className="max-w-md mt-2 text-balance leading-relaxed">
                  Your account is active. As a standard user, you can view your
                  profile details and activity here. Administrative tools are
                  restricted to authorized personnel.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                className="font-bold border-gray-200"
                onClick={() => router.push("/dashboard/profile")}
              >
                View Profile
              </Button>
            </Card>
          )}
        </main>
      </div>

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleCreateUser}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        currentUser={currentUser}
        selectedUser={selectedUser}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleUpdateUser}
      />

      <ResetPasswordModal
        isOpen={isResetModalOpen}
        onOpenChange={setIsResetModalOpen}
        selectedUser={selectedUser}
        resetPasswordData={resetPasswordData}
        setResetPasswordData={setResetPasswordData}
        onSubmit={handleAdminResetPassword}
      />
    </div>
  );
}

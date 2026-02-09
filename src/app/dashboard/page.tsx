"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { User as UserType, Role } from "@/types";
import { UserManagementTable } from "@/components/UserManagementTable";
import {
  Users,
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  Settings,
  Activity,
  UserCircle,
  Menu,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  trend?: "up" | "stable" | "down";
  secondary?: string;
}

export default function DashboardPage() {
  const { user: currentUser, logout, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Selected user for edit/reset
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: Role.STANDARD_USER,
  });
  const [resetPasswordData, setResetPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!authLoading && currentUser) {
      fetchUsers();
    }
  }, [authLoading, currentUser]);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch (err) {
      toast.error("Error", {
        description: "Failed to fetch users data.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
      toast.success("User deleted", {
        description: "The user has been successfully removed.",
      });
    } catch (err) {
      toast.error("Deletion failed", {
        description: "You don't have permission to perform this action.",
      });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/users", formData);
      setUsers([...users, data]);
      setIsCreateModalOpen(false);
      setFormData({ username: "", email: "", password: "", role: Role.STANDARD_USER });
      toast.success("User created", { description: `${data.username} has been added.` });
    } catch (err: any) {
      toast.error("Error", { description: err.response?.data?.message || "Failed to create user." });
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      const { data } = await api.put(`/users/${selectedUser.id}`, formData);
      setUsers(users.map((u) => (u.id === selectedUser.id ? data : u)));
      setIsEditModalOpen(false);
      setSelectedUser(null);
      toast.success("User updated", { description: "Profile has been updated successfully." });
    } catch (err: any) {
      toast.error("Error", { description: err.response?.data?.message || "Failed to update user." });
    }
  };

  const handleAdminResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      toast.error("Mismatch", { description: "Passwords do not match." });
      return;
    }
    try {
      await api.post(`/users/${selectedUser.id}/reset-password`, {
        newPassword: resetPasswordData.newPassword,
      });
      setIsResetModalOpen(false);
      setSelectedUser(null);
      setResetPasswordData({ newPassword: "", confirmPassword: "" });
      toast.success("Success", { description: "Password has been reset." });
    } catch (err: any) {
      toast.error("Error", { description: err.response?.data?.message || "Failed to reset password." });
    }
  };

  const handleChangeRole = async (id: number, role: Role) => {
    try {
      const { data } = await api.post(`/users/${id}/role`, { role });
      setUsers(users.map((u) => (u.id === id ? data : u)));
      toast.success("Role updated", { description: `User role changed to ${role}.` });
    } catch (err: any) {
      toast.error("Error", { description: "Failed to change role." });
    }
  };

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
      {/* Sidebar - Desktop */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transition-transform duration-300 lg:translate-x-0 lg:static
        ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-50">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-white h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              Admin
              <span className="text-gray-400 font-medium font-mono text-sm ml-1 select-none">
                v1.0
              </span>
            </span>
          </div>

          <nav className="flex-1 py-6 px-4 space-y-1">
            <NavItem
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
              active
            />
            <NavItem icon={<Users size={20} />} label="Users" />
            <NavItem icon={<Activity size={20} />} label="Logs" />
            <NavItem icon={<Settings size={20} />} label="Settings" />
          </nav>

          <div className="p-4 border-t border-gray-50">
            <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 shadow-sm">
                <UserCircle size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {currentUser.username}
                </p>
                <p className="text-[10px] font-bold text-gray-400 truncate uppercase tracking-widest">
                  {currentUser.role.replace("_", " ")}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-gray-500 hover:text-black hover:bg-gray-50 transition-all"
              onClick={() => {
                setSelectedUser(currentUser);
                setFormData({
                  username: currentUser.username,
                  email: currentUser.email,
                  password: "",
                  role: currentUser.role,
                });
                setIsEditModalOpen(true);
              }}
            >
              <Settings size={20} />
              <span className="font-semibold">Edit Profile</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all"
              onClick={logout}
            >
              <LogOut size={20} />
              <span className="font-semibold">Sign out</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Active System
              </p>
              <p className="text-sm font-bold text-gray-900 leading-none">
                Healthy
              </p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
          </div>
        </header>

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
                onClick={() => {
                  setFormData({ username: "", email: "", password: "", role: Role.STANDARD_USER });
                  setIsCreateModalOpen(true);
                }}
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
              value={users.length.toString()}
              description="+2 from last hour"
              trend="up"
            />
            <StatCard
              icon={<ShieldCheck className="text-gray-900" />}
              label="Permissions Tier"
              value={currentUser.role.split("_")[0]}
              description="High Access Level"
              secondary={currentUser.role.split("_")[1] || ""}
            />
            <StatCard
              icon={<Activity className="text-gray-900" />}
              label="System Uptime"
              value="99.9%"
              description="Operational"
              trend="stable"
            />
          </div>

          {/* User Management Section */}
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
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="text-xs font-bold border-gray-200"
                  >
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 border-t border-gray-50">
                <UserManagementTable
                  users={users}
                  currentUser={currentUser}
                  onDelete={handleDelete}
                  onEdit={(user) => {
                    setSelectedUser(user);
                    setFormData({
                      username: user.username,
                      email: user.email,
                      password: "",
                      role: user.role,
                    });
                    setIsEditModalOpen(true);
                  }}
                  onChangeRole={handleChangeRole}
                  onResetPassword={(id) => {
                    const user = users.find((u) => u.id === id);
                    if (user) {
                        setSelectedUser(user);
                        setIsResetModalOpen(true);
                    }
                  }}
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
              <Button variant="outline" className="font-bold border-gray-200">
                View Public Profile
              </Button>
            </Card>
          )}
        </main>
      </div>

      {/* Create User Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new member to the workspace.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Temporary Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                className="w-full h-10 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2"
              >
                <option value={Role.STANDARD_USER}>Standard User</option>
                <option value={Role.ADMIN_USER}>Admin User</option>
                <option value={Role.GLOBAL_ADMIN}>Global Admin</option>
              </select>
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full bg-black hover:bg-gray-800">
                Create User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User/Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update user information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateUser} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            {currentUser.id === selectedUser?.id && (
              <div className="space-y-2 border-t pt-4 mt-4">
                <Label htmlFor="edit-password">New Password (optional)</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Leave blank to keep current"
                />
              </div>
            )}
            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full bg-black hover:bg-gray-800">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Admin Reset Password Modal */}
      <Dialog open={isResetModalOpen} onOpenChange={setIsResetModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Force reset password for {selectedUser?.username}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdminResetPassword} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={resetPasswordData.newPassword}
                onChange={(e) => setResetPasswordData({ ...resetPasswordData, newPassword: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={resetPasswordData.confirmPassword}
                onChange={(e) => setResetPasswordData({ ...resetPasswordData, confirmPassword: e.target.value })}
                required
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full bg-black hover:bg-gray-800">
                Reset Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`
      w-full flex items-center gap-3 px-3 py-2 rounded-lg font-bold text-sm transition-all
      ${
        active
          ? "bg-gray-100/60 text-black shadow-sm ring-1 ring-gray-200/50"
          : "text-gray-400 hover:text-black hover:bg-gray-50/50"
      }
    `}
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
  trend,
  secondary,
}: StatCardProps) {
  return (
    <Card className="border-none ring-1 ring-gray-100 shadow-xl shadow-gray-200/20 bg-white hover:ring-gray-200 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
            {icon}
          </div>
          {trend === "up" && (
            <Badge
              variant="secondary"
              className="bg-green-50 text-green-700 border-green-100 text-[10px] font-bold"
            >
              LIVE
            </Badge>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">
              {value}
            </h3>
            {secondary && (
              <span className="text-sm font-black text-gray-400 uppercase">
                {secondary}
              </span>
            )}
          </div>
          <p className="text-xs font-bold text-gray-400/80">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

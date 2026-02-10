import { useState, useEffect } from "react";
import { User, Role } from "@/types";
import api from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
}

interface UpdateUserPayload {
  username?: string;
  email?: string;
  password?: string;
  role?: Role;
}

export function useUserManagement(
  currentUser: User | null,
  authLoading: boolean,
  onUpdateSuccess?: () => void,
) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const accessLevelDescription =
    currentUser?.role === Role.GLOBAL_ADMIN
      ? "Full System Access"
      : currentUser?.role === Role.ADMIN_USER
        ? "Administrative Access"
        : "Basic Access Level";

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
        description: `Failed to fetch users data`,
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
      setFormData({
        username: "",
        email: "",
        password: "",
        role: Role.STANDARD_USER,
      });
      toast.success("User created", {
        description: `${data.username} has been added.`,
      });
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to create user.",
      });
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      const payload: UpdateUserPayload = { ...formData };
      if (!payload.password || payload.password.trim() === "") {
        delete payload.password;
      }
      const { data } = await api.put(`/users/${selectedUser.id}`, payload);
      setUsers(users.map((u) => (u.id === selectedUser.id ? data : u)));
      setIsEditModalOpen(false);

      // If the updated user is the current user, refresh the auth state
      if (
        currentUser &&
        selectedUser.id === currentUser.id &&
        onUpdateSuccess
      ) {
        onUpdateSuccess();
      }

      setSelectedUser(null);
      toast.success("User updated", {
        description: "Profile has been updated successfully.",
      });
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to update user.",
      });
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
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      toast.error("Error", {
        description:
          error.response?.data?.message || "Failed to reset password.",
      });
    }
  };

  const handleChangeRole = async (id: number, role: Role) => {
    try {
      const { data } = await api.post(`/users/${id}/role`, { role });
      setUsers(users.map((u) => (u.id === id ? data : u)));
      toast.success("Role updated", {
        description: `User role changed to ${role}.`,
      });
    } catch (err) {
      toast.error("Error", { description: "Failed to change role." });
    }
  };

  const openCreateModal = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: Role.STANDARD_USER,
    });
    setIsCreateModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
    });
    setIsEditModalOpen(true);
  };

  const openResetModal = (id: number) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setSelectedUser(user);
      setIsResetModalOpen(true);
    }
  };

  return {
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
    fetchUsers,
    accessLevelDescription,
  };
}

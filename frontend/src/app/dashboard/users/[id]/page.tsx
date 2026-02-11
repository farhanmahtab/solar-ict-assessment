"use client";

import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { formatRole } from "@/lib/utils";
import { User, Role } from "@/types";
import {
  UserCircle,
  Mail,
  ShieldCheck,
  Clock,
  ArrowLeft,
  Calendar,
  Shield,
  Fingerprint,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
}

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user: currentUser, logout, loading: authLoading } = useAuth();
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && currentUser) {
      fetchTargetUser();
    }
  }, [authLoading, currentUser, id]);

  const fetchTargetUser = async () => {
    try {
      const { data } = await api.get(`/users/${id}`);
      setTargetUser(data);
    } catch (err: unknown) {
      const error = err as AxiosError<ApiErrorResponse>;
      if (error.response?.status === 403) {
        setError("Unauthorized: You do not have permission to view this user.");
      } else if (error.response?.status === 404) {
        setError("User not found.");
      } else {
        setError("Failed to fetch user details.");
      }
      toast.error("Error", { description: "Could not load user data." });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  if (!currentUser) return null;

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50/30">
        <Sidebar
          currentUser={currentUser}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          onEditProfile={() => {}}
          onLogout={logout}
        />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto border border-red-100">
              <AlertTriangle className="text-red-500 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {error}
            </h2>
            <Button
              onClick={() => router.push("/dashboard")}
              className="font-bold bg-black shadow-lg"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!targetUser) return null;

  console.log({ targetUser });
  return (
    <div className="flex min-h-screen bg-gray-50/30">
      <Sidebar
        currentUser={currentUser}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onEditProfile={() => router.push("/dashboard/profile")}
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="rounded-full border border-gray-100 hover:bg-white"
              >
                <ArrowLeft size={20} />
              </Button>
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
                <UserCircle className="w-8 h-8 text-gray-500" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                  {targetUser.username}
                </h1>
                <p className="text-gray-500 font-medium">
                  {formatRole(targetUser.role)}
                </p>
              </div>
            </div>

            {(currentUser.role === Role.GLOBAL_ADMIN ||
              (currentUser.role === Role.ADMIN_USER &&
                targetUser.role !== Role.GLOBAL_ADMIN)) && (
              <div className="flex gap-2">
                <Button variant="outline" className="font-bold border-gray-200">
                  Manage Account
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={<Shield className="text-gray-900" />}
              label="Role"
              value={formatRole(targetUser.role).split(" ")[0]}
              description="Access Permissions"
              secondary={formatRole(targetUser.role).split(" ")[1] || ""}
            />
            <StatCard
              icon={<Mail className="text-gray-900" />}
              label="Contact"
              value="Verified"
              description={targetUser.email}
              trend="up"
            />
            <StatCard
              icon={<Clock className="text-gray-900" />}
              label="Status"
              value={targetUser.isValidated ? "Active" : "Pending"}
              description="System Eligibility"
              trend={targetUser.isValidated ? "up" : "stable"}
            />
          </div>

          <Card className="border-none ring-1 ring-gray-100 shadow-xl shadow-gray-200/20">
            <CardHeader className="pb-4 border-b border-gray-50">
              <CardTitle className="text-xl font-bold">
                Comprehensive Overview
              </CardTitle>
              <CardDescription>
                Detailed metadata and status for this user identity.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                <DetailRow
                  icon={<UserCircle size={18} />}
                  label="Username"
                  value={targetUser.username}
                />
                <DetailRow
                  icon={<Mail size={18} />}
                  label="Email Address"
                  value={targetUser.email}
                />
                <DetailRow
                  icon={<ShieldCheck size={18} />}
                  label="Permissions Tier"
                  value={formatRole(targetUser.role)}
                  badge
                />
                <DetailRow
                  icon={<Fingerprint size={18} />}
                  label="System ID"
                  value={`#${targetUser.id.toString().padStart(4, "0")}`}
                />
                <DetailRow
                  icon={<Calendar size={18} />}
                  label="Account Created"
                  value={new Date(targetUser.createdAt).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "2-digit", year: "numeric" },
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  badge = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400">
          {icon}
        </div>
        <span className="text-sm font-black text-gray-400 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <div>
        {badge ? (
          <Badge className="bg-black text-white hover:bg-black font-bold uppercase tracking-tight text-[10px] px-3">
            {value}
          </Badge>
        ) : (
          <p className="font-bold text-gray-900">{value}</p>
        )}
      </div>
    </div>
  );
}

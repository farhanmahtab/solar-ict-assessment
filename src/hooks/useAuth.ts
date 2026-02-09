"use client";
import { useEffect, useState } from "react";
import { User, Role } from "@/types";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({
        id: payload.sub,
        username: payload.username,
        role: payload.role as Role,
        email: payload.email,
        permissions: payload.permissions || [],
        isValidated: true,
        createdAt: payload.createdAt || "",
      });
    } catch (e) {
      console.error(`Failed to parse token\n error: ${e}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return;

    try {
      const { data } = await api.post("/auth/refresh", { refreshToken });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      
      const payload = JSON.parse(atob(data.accessToken.split(".")[1]));
      setUser({
        id: payload.sub,
        username: payload.username,
        role: payload.role as Role,
        email: payload.email,
        permissions: payload.permissions || [],
        isValidated: true,
        createdAt: payload.createdAt || "",
      });
    } catch (e) {
      console.error("Refresh failed", e);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  };

  return { user, loading, logout, refresh };
}

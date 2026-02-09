"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, User, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/api";
import { AxiosError } from "axios";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      toast.success("Welcome back!", {
        description: "You have successfully signed in.",
      });
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error("Authentication failed", {
        description:
          error.response?.data?.message ||
          "Invalid credentials. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4 animate-fade-in">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] background-size:16px_16px mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)" />

      <Card className="w-full max-w-md relative border-gray-200/60 shadow-xl shadow-gray-200/40 backdrop-blur-sm bg-white/80">
        <CardHeader className="space-y-1 pb-8">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-black/10">
            <Lock className="text-white w-6 h-6" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back
          </CardTitle>
          <CardDescription className="text-gray-500 text-base">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-semibold text-gray-700"
              >
                Username
              </Label>
              <div className="relative group">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors" />
                <Input
                  id="username"
                  placeholder="johndoe"
                  className="pl-10 h-11 border-gray-200 bg-gray-50/50 focus:bg-white transition-all duration-200 rounded-lg"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700"
                >
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-gray-400 hover:text-black transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors z-10" />
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  className="pl-10 h-11 border-gray-200 bg-gray-50/50 focus:bg-white transition-all duration-200 rounded-lg"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-12 bg-black hover:bg-gray-800 text-white font-semibold text-base transition-all duration-200 shadow-lg shadow-black/5 active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-2">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100" />
            </div>
          </div>
          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-gray-900 hover:underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

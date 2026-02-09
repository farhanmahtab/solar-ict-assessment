"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { KeyRound, ShieldCheck, Lock, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });
      setIsSuccess(true);
      toast.success("Password reset successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-gray-100 shadow-2xl text-center pt-10 pb-8 px-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black text-gray-900 mb-2">Success!</CardTitle>
          <p className="text-gray-500 font-medium mb-8">Your password has been reset securely.</p>
          <Button asChild className="w-full h-12 bg-black hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg shadow-black/5">
            <Link href="/login">Go to Login</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white/50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      </div>

      <Card className="w-full max-w-md border-gray-100 shadow-2xl shadow-black/5 z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <CardHeader className="text-center pt-10 pb-6 px-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center shadow-xl shadow-black/10">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black tracking-tight text-gray-900">
            Reset Password
          </CardTitle>
          <CardDescription className="text-gray-400 font-medium text-lg mt-2">
            Enter the 6-digit code and your new credentials.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Account Email</Label>
              <Input
                type="email"
                placeholder="name@company.com"
                className="h-12 border-gray-100 bg-gray-50/50 rounded-xl focus:ring-black focus:border-black font-medium"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Security Code</Label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <Input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  className="h-12 border-gray-100 bg-gray-50/50 pl-11 rounded-xl focus:ring-black focus:border-black font-black tracking-[0.5em] transition-all"
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-12 border-gray-100 bg-gray-50/50 pl-11 rounded-xl focus:ring-black focus:border-black font-medium"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-12 border-gray-100 bg-gray-50/50 pl-11 rounded-xl focus:ring-black focus:border-black font-medium"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-black hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg shadow-black/5 flex gap-2 mt-4"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reset Workspace Password"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-black transition-colors">
              Remembered? Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

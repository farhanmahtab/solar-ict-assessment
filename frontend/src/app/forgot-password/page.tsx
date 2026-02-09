"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Loader2, Send } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/request-password-reset", { email });
      setIsSent(true);
      toast.success("Security code sent successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

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
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black tracking-tight text-gray-900">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-gray-400 font-medium text-lg mt-2 leading-relaxed">
            Enter your email and we'll send a 6-digit security code.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-10">
          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    className="h-12 border-gray-100 bg-gray-50/50 pl-11 rounded-xl focus:ring-black focus:border-black font-medium transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-black hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg shadow-black/5 transition-all flex gap-2"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>Send Security Code <Send className="w-4 h-4" /></>
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-6 animate-in zoom-in-95 duration-500">
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                <p className="text-sm font-medium text-gray-600">
                  If <span className="text-black font-bold">{email}</span> is registered, you will receive a code shortly.
                </p>
              </div>
              <Button 
                asChild 
                className="w-full h-12 bg-black hover:bg-gray-800 text-white font-bold rounded-xl shadow-sm"
              >
                <Link href="/reset-password">Enter Security Code</Link>
              </Button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

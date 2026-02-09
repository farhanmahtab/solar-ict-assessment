"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid validation link. Please check your email again.");
      return;
    }

    const verify = async () => {
      try {
        const response = await api.get(`/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage(response.data.message || "Your email has been successfully validated.");
      } catch (error: any) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Verification failed. The link may be expired.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-white/50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      </div>

      <Card className="w-full max-w-md border-gray-100 shadow-2xl shadow-black/5 z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <CardHeader className="text-center pt-10 pb-6">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center shadow-xl shadow-black/10">
              <div style={{ color: "white", fontWeight: 900, fontSize: "20px" }}>W</div>
            </div>
          </div>
          <CardTitle className="text-3xl font-black tracking-tight text-gray-900">
            Account Verification
          </CardTitle>
          <CardDescription className="text-gray-400 font-medium text-lg mt-2">
            Confirming your access to the workspace
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-10 text-center">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-6 py-8">
              <Loader2 className="w-12 h-12 text-black animate-spin opacity-20" />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Processing Verification...</p>
            </div>
          )}

          {status === "success" && (
            <div className="animate-in zoom-in-95 duration-500">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border border-green-100 shadow-sm">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Verified!</h3>
              <p className="text-gray-500 font-medium mb-8">{message}</p>
              <Button asChild className="w-full h-12 bg-black hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg shadow-black/5 gap-2">
                <Link href="/login">
                  Continue to Login <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="animate-in zoom-in-95 duration-500">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center border border-red-100 shadow-sm">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h3>
              <p className="text-gray-500 font-medium mb-8">{message}</p>
              <div className="flex flex-col gap-3">
                <Button asChild className="w-full h-12 bg-black hover:bg-gray-800 font-bold rounded-xl shadow-lg shadow-black/5">
                  <Link href="/signup">Try Registering Again</Link>
                </Button>
                <Button variant="ghost" asChild className="w-full h-12 font-bold text-gray-400 hover:text-black">
                  <Link href="/login">Back to Login</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-200" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  trend?: "up" | "stable" | "down";
  secondary?: string;
}

export function StatCard({
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

"use client";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export function DashboardHeader({
  isSidebarOpen,
  setIsSidebarOpen,
}: DashboardHeaderProps) {
  return (
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
  );
}

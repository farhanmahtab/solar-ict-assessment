"use client";

import { User } from "@/types";
import {
  Users,
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  Settings,
  Activity,
  UserCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SidebarProps {
  currentUser: User;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  onEditProfile: () => void;
  onLogout: () => void;
}

export function Sidebar({
  currentUser,
  isSidebarOpen,
  setIsSidebarOpen,
  onEditProfile,
  onLogout,
}: SidebarProps) {
  return (
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
            Solar ICT
            {/* <span className="text-gray-400 font-medium font-mono text-sm ml-1 select-none">
              v1.0
            </span> */}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden ml-auto"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </Button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            href="/dashboard"
            active
          />
          <NavItem 
            icon={<Users size={20} />} 
            label="Users" 
            href="/dashboard"
          />
          <NavItem icon={<Activity size={20} />} label="Logs" href="/dashboard" />
          <NavItem icon={<Settings size={20} />} label="Settings" href="/dashboard" />
        </nav>

        <div className="p-4 border-t border-gray-50">
          <Link href="/dashboard/profile" className="block p-3 hover:bg-gray-50 rounded-xl transition-all mb-2">
            <div className="flex items-center gap-3">
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
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-500 hover:text-black hover:bg-gray-50 transition-all mb-1"
            onClick={onEditProfile}
          >
            <Settings size={20} />
            <span className="font-semibold">Edit Profile</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all"
            onClick={onLogout}
          >
            <LogOut size={20} />
            <span className="font-semibold">Sign out</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  href,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
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
    </Link>
  );
}

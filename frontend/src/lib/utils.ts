import { Role, User } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPermissions(currentUser: User, targetUser: User) {
  const isGlobalAdmin = currentUser.role === Role.GLOBAL_ADMIN;
  const isAdmin = currentUser.role === Role.ADMIN_USER;
  const isSelf = currentUser.id === targetUser.id;
  const targetIsStandard = targetUser.role === Role.STANDARD_USER;

  return {
    canEdit: isGlobalAdmin || isSelf || (isAdmin && targetIsStandard),
    canResetPassword: isGlobalAdmin || (isAdmin && targetIsStandard),
    canChangeRole: isGlobalAdmin,
    canDelete: isGlobalAdmin,
  };
}

export function formatRole(role: any): string {
  // Map numeric roles from gRPC
  const numericMap: Record<number, string> = {
    [Role.GLOBAL_ADMIN]: "Global Admin",
    [Role.ADMIN_USER]: "Admin",
    [Role.STANDARD_USER]: "Standard User",
  };

  if (typeof role === "number" || !isNaN(Number(role))) {
    return numericMap[Number(role)] || "Unknown";
  }

  // Handle legacy string roles (for token compatibility)
  if (typeof role === "string") {
    return role.replace("_", " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  return "Unknown";
}

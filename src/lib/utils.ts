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

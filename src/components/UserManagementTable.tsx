"use client";

import { User, Role } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Trash2,
  UserCog,
  ShieldAlert,
  CheckCircle2,
  Clock,
  UserCircle,
  Key,
  User as UserIcon,
} from "lucide-react";

interface Props {
  users: User[];
  currentUser: User;
  onDelete: (id: number) => void;
  onEdit: (user: User) => void;
  onChangeRole: (id: number, role: Role) => void;
  onResetPassword: (id: number) => void;
}

export function UserManagementTable({
  users,
  currentUser,
  onDelete,
  onEdit,
  onChangeRole,
  onResetPassword,
}: Props) {
  const getRoleBadge = (role: Role) => {
    switch (role) {
      case Role.GLOBAL_ADMIN:
        return (
          <Badge
            variant="destructive"
            className="font-bold uppercase tracking-wider text-[10px] px-2 py-0"
          >
            Global Admin
          </Badge>
        );
      case Role.ADMIN_USER:
        return (
          <Badge
            variant="secondary"
            className="bg-blue-50 text-blue-700 border-blue-100 font-bold uppercase tracking-wider text-[10px] px-2 py-0"
          >
            Admin
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="text-gray-500 border-gray-200 font-bold uppercase tracking-wider text-[10px] px-2 py-0"
          >
            Standard
          </Badge>
        );
    }
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow className="hover:bg-transparent border-gray-100">
            <TableHead className="w-[300px] text-gray-400 font-bold uppercase tracking-wider text-[11px] py-4">
              User Details
            </TableHead>
            <TableHead className="text-gray-400 font-bold uppercase tracking-wider text-[11px] py-4">
              Status
            </TableHead>
            <TableHead className="text-gray-400 font-bold uppercase tracking-wider text-[11px] py-4">
              Role
            </TableHead>
            <TableHead className="text-right text-gray-400 font-bold uppercase tracking-wider text-[11px] py-4">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className="group border-gray-50 hover:bg-gray-50/30 transition-colors"
            >
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200 group-hover:bg-white transition-colors">
                    <UserIcon size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 leading-none mb-1">
                      {user.username}
                    </div>
                    <div className="text-xs text-gray-400 font-medium">
                      {user.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                {user.isValidated ? (
                  <div className="flex items-center gap-1.5 text-green-600 font-semibold text-xs bg-green-50 w-fit px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={12} />
                    Validated
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-amber-600 font-semibold text-xs bg-amber-50 w-fit px-2 py-0.5 rounded-full">
                    <Clock size={12} />
                    Pending
                  </div>
                )}
              </TableCell>
              <TableCell className="py-4">{getRoleBadge(user.role)}</TableCell>
              <TableCell className="text-right py-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-white border-transparent hover:border-gray-100 border transition-all"
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 p-1.5 border-gray-200/60 shadow-xl shadow-gray-200/40"
                  >
                    <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 py-1.5">
                      Manage {user.username}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-100" />
                    <DropdownMenuItem
                      onClick={() => onEdit(user)}
                      className="gap-2 focus:bg-gray-50 cursor-pointer rounded-md text-sm py-2 px-2 transition-colors"
                    >
                      <UserCog size={16} className="text-gray-400" />
                      Edit Profile
                    </DropdownMenuItem>

                    {(currentUser.role === Role.ADMIN_USER || currentUser.role === Role.GLOBAL_ADMIN) && (
                      <DropdownMenuItem
                        onClick={() => onResetPassword(user.id)}
                        className="gap-2 focus:bg-gray-50 cursor-pointer rounded-md text-sm py-2 px-2 transition-colors"
                      >
                        <Key size={16} className="text-gray-400" />
                        Reset Password
                      </DropdownMenuItem>
                    )}

                    {currentUser.role === Role.GLOBAL_ADMIN && (
                      <>
                        <DropdownMenuItem
                          onClick={() =>
                            onChangeRole(
                              user.id,
                              user.role === Role.ADMIN_USER
                                ? Role.STANDARD_USER
                                : Role.ADMIN_USER,
                            )
                          }
                          className="gap-2 focus:bg-gray-50 cursor-pointer rounded-md text-sm py-2 px-2 transition-colors"
                        >
                          <ShieldAlert size={16} className="text-gray-400" />
                          Toggle Admin Status
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-100" />
                        <DropdownMenuItem
                          onClick={() => onDelete(user.id)}
                          className="gap-2 focus:bg-red-50 focus:text-red-600 cursor-pointer rounded-md text-sm py-2 px-2 transition-colors text-red-500 font-semibold"
                        >
                          <Trash2 size={16} />
                          Delete User
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

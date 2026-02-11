import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role, User } from "@/types";
import { useState } from "react";

interface ChangeRoleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
  onSubmit: (id: number, role: Role) => void;
}

export function ChangeRoleModal({
  isOpen,
  onOpenChange,
  selectedUser,
  onSubmit,
}: ChangeRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || selectedRole === null) return;
    onSubmit(selectedUser.id, selectedRole);
    onOpenChange(false);
    setSelectedRole(null);
  };

  if (!selectedUser) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            Update the role for {selectedUser.username}. This will change their
            access permissions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="role">New Role</Label>
              <Select
                value={selectedRole?.toString() ?? ""}
                onValueChange={(value: string) => setSelectedRole(parseInt(value) as Role)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Role.ADMIN_USER.toString()}>
                    Admin User
                  </SelectItem>
                  <SelectItem value={Role.STANDARD_USER.toString()}>
                    Standard User
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={selectedRole === null}>
              Update Role
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

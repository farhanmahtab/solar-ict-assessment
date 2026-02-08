import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto, ChangeRoleDto } from './dto/users.dto';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(requester: { id: number; role: Role }) {
    if (requester.role === Role.STANDARD_USER) {
        // Standard user can only see themselves? Requirements say "Standard User (Read) Basic account management"
        // Usually list is for admins.
        return this.prisma.user.findMany({ where: { id: requester.id } });
    }
    return this.prisma.user.findMany();
  }

  async findOne(id: number, requester: { id: number; role: Role }) {
    if (requester.role === Role.STANDARD_USER && requester.id !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, dto: UpdateUserDto, requester: { id: number; role: Role }) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    // RBAC logic
    if (requester.role === Role.STANDARD_USER && requester.id !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }

    if (requester.role === Role.ADMIN_USER && user.role === Role.GLOBAL_ADMIN) {
      throw new ForbiddenException('Admins cannot edit Global Admins');
    }

    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: number, requester: { id: number; role: Role }) {
    if (requester.role !== Role.GLOBAL_ADMIN) {
      throw new ForbiddenException('Only Global Admins can delete users');
    }
    return this.prisma.user.delete({ where: { id } });
  }

  async changeRole(id: number, dto: ChangeRoleDto, requester: { id: number; role: Role }) {
    if (requester.role !== Role.GLOBAL_ADMIN) {
      throw new ForbiddenException('Only Global Admins can change roles');
    }
    return this.prisma.user.update({
      where: { id },
      data: { role: dto.role },
    });
  }
}

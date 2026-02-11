import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  UpdateUserDto,
  ChangeRoleDto,
  CreateUserDto,
  AdminResetPasswordDto,
} from './dto/users.dto';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Helper function to convert numeric Role to Prisma enum string
function convertRoleToPrismaEnum(role: Role | number): 'GLOBAL_ADMIN' | 'ADMIN_USER' | 'STANDARD_USER' {
  // If role is already a string, return it
  if (typeof role === 'string') {
    return role as 'GLOBAL_ADMIN' | 'ADMIN_USER' | 'STANDARD_USER';
  }
  
  // Convert numeric role to string
  const roleMap: Record<number, 'GLOBAL_ADMIN' | 'ADMIN_USER' | 'STANDARD_USER'> = {
    0: 'GLOBAL_ADMIN',
    1: 'ADMIN_USER',
    2: 'STANDARD_USER',
  };
  return roleMap[role] ?? 'STANDARD_USER';
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(requester: { id: number; role: Role }) {
    if (requester.role === Role.STANDARD_USER) {
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

  async create(dto: CreateUserDto, requester: { id: number; role: Role }) {
    if (requester.role === Role.STANDARD_USER) {
      throw new ForbiddenException('Standard users cannot create users');
    }

    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    const existingUsername = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (existingUsername) {
      throw new BadRequestException('Username already exists');
    }

    const defaultPassword = dto.password || 'TemporaryPassword123!';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    return this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
        role: dto.role || Role.STANDARD_USER,
        isValidated: true, // Admin created users are pre-validated or handled via reset
      },
    });
  }

  async update(
    id: number,
    dto: UpdateUserDto,
    requester: { id: number; role: Role },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const updateData: any = { ...dto };

    // Check unique constraints if email or username is changing
    if (dto.email && dto.email !== user.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (existingEmail) throw new BadRequestException('Email already exists');
    }

    if (dto.username && dto.username !== user.username) {
      const existingUsername = await this.prisma.user.findUnique({
        where: { username: dto.username },
      });
      if (existingUsername)
        throw new BadRequestException('Username already exists');
    }

    if (dto.password && dto.password.trim() !== '') {
      updateData.password = await bcrypt.hash(dto.password, 10);
    } else {
      delete updateData.password;
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async adminResetPassword(
    id: number,
    dto: AdminResetPasswordDto,
    requester: { id: number; role: Role },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async delete(id: number, requester: { id: number; role: Role }) {
    return this.prisma.user.delete({ where: { id } });
  }

  async changeRole(
    id: number,
    dto: ChangeRoleDto,
    requester: { id: number; role: Role },
  ) {
    const prismaRole = convertRoleToPrismaEnum(dto.role);
    return this.prisma.user.update({
      where: { id },
      data: { role: prismaRole },
    });
  }
}

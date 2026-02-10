import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UsersService } from './users.service';
import {
  UpdateUserDto,
  ChangeRoleDto,
  CreateUserDto,
  AdminResetPasswordDto,
} from './dto/users.dto';
import { Role } from '@prisma/client';
import { HttpToRpcExceptionFilter } from '../common/filters/http-to-rpc-exception.filter';

@UseFilters(new HttpToRpcExceptionFilter())
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod('UserService', 'FindAll')
  async findAll(data: { requester: { id: number; role: Role } }) {
    console.log('[User Service] gRPC find_all_users for:', data.requester.id);
    const users = await this.usersService.findAll(data.requester);
    return { users };
  }

  @GrpcMethod('UserService', 'FindOne')
  async findOne(data: { id: number; requester: { id: number; role: Role } }) {
    const user = await this.usersService.findOne(data.id, data.requester);
    return { user };
  }

  @GrpcMethod('UserService', 'Update')
  async update(data: {
    id: number;
    dto: UpdateUserDto;
    requester: { id: number; role: Role };
  }) {
    console.log('[User Service] gRPC update_user for:', data.id);
    const user = await this.usersService.update(
      data.id,
      data.dto,
      data.requester,
    );
    return { user };
  }

  @GrpcMethod('UserService', 'Create')
  async create(data: {
    dto: CreateUserDto;
    requester: { id: number; role: Role };
  }) {
    const user = await this.usersService.create(data.dto, data.requester);
    return { user };
  }

  @GrpcMethod('UserService', 'AdminResetPassword')
  async adminResetPassword(data: {
    id: number;
    dto: AdminResetPasswordDto;
    requester: { id: number; role: Role };
  }) {
    return this.usersService.adminResetPassword(
      data.id,
      data.dto,
      data.requester,
    );
  }

  @GrpcMethod('UserService', 'Delete')
  async delete(data: { id: number; requester: { id: number; role: Role } }) {
    await this.usersService.delete(data.id, data.requester);
    return {};
  }

  @GrpcMethod('UserService', 'ChangeRole')
  async changeRole(data: {
    id: number;
    dto: ChangeRoleDto;
    requester: { id: number; role: Role };
  }) {
    const user = await this.usersService.changeRole(
      data.id,
      data.dto,
      data.requester,
    );
    return { user };
  }
}

import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { UpdateUserDto, ChangeRoleDto, CreateUserDto, AdminResetPasswordDto } from './dto/users.dto';
import { Role } from '@prisma/client';
import { HttpToRpcExceptionFilter } from '../common/filters/http-to-rpc-exception.filter';

@UseFilters(new HttpToRpcExceptionFilter())
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('find_all_users')
  async findAll(@Payload() requester: { id: number; role: Role }) {
    console.log('[User Service] Handling find_all_users for:', requester.id);
    return this.usersService.findAll(requester);
  }

  @MessagePattern('find_one_user')
  async findOne(@Payload() data: { id: number; requester: { id: number; role: Role } }) {
    return this.usersService.findOne(data.id, data.requester);
  }

  @MessagePattern('update_user')
  async update(@Payload() data: { id: number; dto: UpdateUserDto; requester: { id: number; role: Role } }) {
    console.log('[User Service] Handling update_user for:', data.id);
    return this.usersService.update(data.id, data.dto, data.requester);
  }

  @MessagePattern('admin_create_user')
  async create(@Payload() data: { dto: CreateUserDto; requester: { id: number; role: Role } }) {
    return this.usersService.create(data.dto, data.requester);
  }

  @MessagePattern('admin_reset_password')
  async adminResetPassword(@Payload() data: { id: number; dto: AdminResetPasswordDto; requester: { id: number; role: Role } }) {
    return this.usersService.adminResetPassword(data.id, data.dto, data.requester);
  }

  @MessagePattern('delete_user')
  async delete(@Payload() data: { id: number; requester: { id: number; role: Role } }) {
    return this.usersService.delete(data.id, data.requester);
  }

  @MessagePattern('change_role')
  async changeRole(@Payload() data: { id: number; dto: ChangeRoleDto; requester: { id: number; role: Role } }) {
    return this.usersService.changeRole(data.id, data.dto, data.requester);
  }
}

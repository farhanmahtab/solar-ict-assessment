import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { UpdateUserDto, ChangeRoleDto } from './dto/users.dto';
import { Role } from '@prisma/client';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('find_all_users')
  async findAll(@Payload() requester: { id: number; role: Role }) {
    return this.usersService.findAll(requester);
  }

  @MessagePattern('find_one_user')
  async findOne(@Payload() data: { id: number; requester: { id: number; role: Role } }) {
    return this.usersService.findOne(data.id, data.requester);
  }

  @MessagePattern('update_user')
  async update(@Payload() data: { id: number; dto: UpdateUserDto; requester: { id: number; role: Role } }) {
    return this.usersService.update(data.id, data.dto, data.requester);
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

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
  OnModuleInit,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { ClientGrpc } from '@nestjs/microservices';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

enum Role {
  GLOBAL_ADMIN = 0,
  ADMIN_USER = 1,
  STANDARD_USER = 2,
}

interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  permissions: string[];
  createdAt: string;
  isVerified: boolean;
}

interface Requester {
  id: number;
  role: Role;
}

interface UserListResponse {
  users: User[];
}

interface UserResponse {
  user: User;
}

interface AuthResponse {
  message: string;
}

interface UpdateUserDto {
  email?: string;
  username?: string;
  password?: string;
  permissions?: string[];
}

interface ChangeRoleDto {
  role: Role;
}

interface CreateUserDto {
  email: string;
  username: string;
  password?: string;
  role?: Role;
}

interface AdminResetPasswordDto {
  newPassword: string;
}

interface UserServiceClient {
  findAll(data: { requester: Requester }): Observable<UserListResponse>;
  findOne(data: { id: number; requester: Requester }): Observable<UserResponse>;
  update(data: {
    id: number;
    dto: UpdateUserDto;
    requester: Requester;
  }): Observable<UserResponse>;
  delete(data: { id: number; requester: Requester }): Observable<any>;
  create(data: {
    dto: CreateUserDto;
    requester: Requester;
  }): Observable<UserResponse>;
  adminResetPassword(data: {
    id: number;
    dto: AdminResetPasswordDto;
    requester: Requester;
  }): Observable<AuthResponse>;
  changeRole(data: {
    id: number;
    dto: ChangeRoleDto;
    requester: Requester;
  }): Observable<UserResponse>;
}

interface JwtPayload {
  sub: number;
  role: Role;
}

interface RequestWithUser extends Request {
  user: JwtPayload;
}

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController implements OnModuleInit {
  private userService: UserServiceClient;

  constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserServiceClient>('UserService');
  }

  private getRequester(req: RequestWithUser): Requester {
    return {
      id: req.user.sub,
      role: req.user.role,
    };
  }

  @Get()
  findAll(@Req() req: RequestWithUser): Observable<User[]> {
    return this.userService
      .findAll({
        requester: this.getRequester(req),
      })
      .pipe(map((res: UserListResponse) => res.users || []));
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ): Observable<User> {
    return this.userService
      .findOne({
        id,
        requester: this.getRequester(req),
      })
      .pipe(map((res: UserResponse) => res.user));
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Req() req: RequestWithUser,
  ): Observable<User> {
    return this.userService
      .update({
        id,
        dto,
        requester: this.getRequester(req),
      })
      .pipe(map((res: UserResponse) => res.user));
  }

  @Delete(':id')
  @Roles(Role.GLOBAL_ADMIN)
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ): Observable<any> {
    return this.userService.delete({
      id,
      requester: this.getRequester(req),
    });
  }

  @Post()
  @Roles(Role.ADMIN_USER, Role.GLOBAL_ADMIN)
  create(
    @Body() dto: CreateUserDto,
    @Req() req: RequestWithUser,
  ): Observable<User> {
    return this.userService
      .create({
        dto,
        requester: this.getRequester(req),
      })
      .pipe(map((res: UserResponse) => res.user));
  }

  @Post(':id/reset-password')
  @Roles(Role.ADMIN_USER, Role.GLOBAL_ADMIN)
  adminResetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdminResetPasswordDto,
    @Req() req: RequestWithUser,
  ): Observable<AuthResponse> {
    return this.userService.adminResetPassword({
      id,
      dto,
      requester: this.getRequester(req),
    });
  }

  @Post(':id/role')
  @Roles(Role.GLOBAL_ADMIN)
  changeRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangeRoleDto,
    @Req() req: RequestWithUser,
  ): Observable<User> {
    return this.userService
      .changeRole({
        id,
        dto,
        requester: this.getRequester(req),
      })
      .pipe(map((res: UserResponse) => res.user));
  }
}

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
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

interface UserServiceClient {
  findAll(data: { requester: any }): Observable<any>;
  findOne(data: { id: number; requester: any }): Observable<any>;
  update(data: { id: number; dto: any; requester: any }): Observable<any>;
  delete(data: { id: number; requester: any }): Observable<any>;
  create(data: { dto: any; requester: any }): Observable<any>;
  adminResetPassword(data: { id: number; dto: any; requester: any }): Observable<any>;
  changeRole(data: { id: number; dto: any; requester: any }): Observable<any>;
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController implements OnModuleInit {
  private userService: UserServiceClient;

  constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserServiceClient>('UserService');
  }

  @Get()
  findAll(@Req() req: any) {
    return this.userService.findAll({
      requester: { id: req.user.sub, role: req.user.role },
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.userService.findOne({
      id,
      requester: { id: req.user.sub, role: req.user.role },
    });
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: any,
    @Req() req: any,
  ) {
    return this.userService.update({
      id,
      dto,
      requester: { id: req.user.sub, role: req.user.role },
    });
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.userService.delete({
      id,
      requester: { id: req.user.sub, role: req.user.role },
    });
  }

  @Post()
  create(@Body() dto: any, @Req() req: any) {
    return this.userService.create({
      dto,
      requester: { id: req.user.sub, role: req.user.role },
    });
  }

  @Post(':id/reset-password')
  adminResetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: any,
    @Req() req: any,
  ) {
    return this.userService.adminResetPassword({
      id,
      dto,
      requester: { id: req.user.sub, role: req.user.role },
    });
  }

  @Post(':id/role')
  changeRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: any,
    @Req() req: any,
  ) {
    return this.userService.changeRole({
      id,
      dto,
      requester: { id: req.user.sub, role: req.user.role },
    });
  }
}

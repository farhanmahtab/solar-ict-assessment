import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: process.env.USER_SERVICE_HOST, port: Number(process.env.USER_SERVICE_PORT) },
    });
  }

  @Get()
  findAll(@Req() req: any) {
    return this.client.send('find_all_users', { id: req.user.sub, role: req.user.role });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.client.send('find_one_user', { id, requester: { id: req.user.sub, role: req.user.role } });
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: any, @Req() req: any) {
    return this.client.send('update_user', { id, dto, requester: { id: req.user.sub, role: req.user.role } });
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.client.send('delete_user', { id, requester: { id: req.user.sub, role: req.user.role } });
  }

  @Post(':id/role')
  changeRole(@Param('id', ParseIntPipe) id: number, @Body() dto: any, @Req() req: any) {
    return this.client.send('change_role', { id, dto, requester: { id: req.user.sub, role: req.user.role } });
  }
}

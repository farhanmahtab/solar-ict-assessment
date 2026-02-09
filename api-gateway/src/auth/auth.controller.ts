import { Controller, Post, Body, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { RegisterDto, LoginDto } from './dto/auth.dto'; // I'll need to create this or copy it
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: process.env.AUTH_SERVICE_HOST, port: Number(process.env.AUTH_SERVICE_PORT) },
    });
  }

  @Post('register')
  register(@Body() dto: any) {
    return this.client.send('register', dto);
  }

  @Post('login')
  login(@Body() dto: any) {
    return this.client.send('login', dto);
  }

  @Post('refresh')
  refresh(@Body() body: { refreshToken: string }, @Req() req: any) {
      // Typically the body contains refreshToken, and we might need userId from somewhere or body
      return this.client.send('refresh', body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: any) {
    return this.client.send('logout', req.user.sub);
  }

  @Get('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.client.send('verify_email', token);
  }

  @Post('request-password-reset')
  requestPasswordReset(@Body('email') email: string) {
    return this.client.send('request_password_reset', email);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: any) {
    return this.client.send('reset_password', dto);
  }
}

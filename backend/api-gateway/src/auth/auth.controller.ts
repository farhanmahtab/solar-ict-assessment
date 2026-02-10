import { Controller, Post, Body, Get, Query, Req, UseGuards, OnModuleInit, Inject } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

interface AuthServiceClient {
  register(dto: any): Observable<any>;
  login(dto: any): Observable<any>;
  refresh(data: { refreshToken: string }): Observable<any>;
  logout(data: { userId: number }): Observable<any>;
  verifyEmail(data: { token: string }): Observable<any>;
  requestPasswordReset(data: { email: string }): Observable<any>;
  resetPassword(dto: any): Observable<any>;
}

@Controller('auth')
export class AuthController implements OnModuleInit {
  private authService: AuthServiceClient;

  constructor(@Inject('AUTH_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>('AuthService');
  }

  @Post('register')
  register(@Body() dto: any) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: any) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: any) {
    return this.authService.logout({ userId: req.user.sub });
  }

  @Get('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail({ token });
  }

  @Post('request-password-reset')
  requestPasswordReset(@Body('email') email: string) {
    return this.authService.requestPasswordReset({ email });
  }

  @Post('reset-password')
  resetPassword(@Body() dto: any) {
    return this.authService.resetPassword(dto);
  }
}

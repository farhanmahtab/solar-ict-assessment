import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { HttpToRpcExceptionFilter } from '../common/filters/http-to-rpc-exception.filter';

@UseFilters(new HttpToRpcExceptionFilter())
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Register')
  async register(dto: RegisterDto) {
    console.log('[Auth Service] gRPC Register:', dto.email);
    return this.authService.register(dto);
  }

  @GrpcMethod('AuthService', 'Login')
  async login(dto: LoginDto) {
    console.log('[Auth Service] gRPC Login:', dto.email);
    return this.authService.login(dto);
  }

  @GrpcMethod('AuthService', 'Refresh')
  async refresh(data: { refreshToken: string }) {
    console.log('[Auth Service] gRPC Refresh');
    return this.authService.refreshTokens(data.refreshToken);
  }

  @GrpcMethod('AuthService', 'Logout')
  async logout(data: { userId: number }) {
    return this.authService.logout(data.userId);
  }

  @GrpcMethod('AuthService', 'VerifyEmail')
  async verifyEmail(data: { token: string }) {
    return this.authService.verifyEmail(data.token);
  }

  @GrpcMethod('AuthService', 'RequestPasswordReset')
  async requestPasswordReset(data: { email: string }) {
    return this.authService.requestPasswordReset(data.email);
  }

  @GrpcMethod('AuthService', 'ResetPassword')
  async resetPassword(dto: any) {
    return this.authService.resetPassword(dto);
  }
}

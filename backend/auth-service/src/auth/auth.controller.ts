import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { HttpToRpcExceptionFilter } from '../common/filters/http-to-rpc-exception.filter';

@UseFilters(new HttpToRpcExceptionFilter())
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('register')
  async register(@Payload() dto: RegisterDto) {
    console.log('[Auth Service] Handling register:', dto.email);
    return this.authService.register(dto);
  }

  @MessagePattern('login')
  async login(@Payload() dto: LoginDto) {
    console.log('[Auth Service] Handling login:', dto.email);
    return this.authService.login(dto);
  }

  @MessagePattern('refresh')
  async refresh(@Payload() data: { refreshToken: string }) {
    console.log('[Auth Service] Handling refresh');
    return this.authService.refreshTokens(data.refreshToken);
  }

  @MessagePattern('logout')
  async logout(@Payload() userId: number) {
    return this.authService.logout(userId);
  }

  @MessagePattern('verify_email')
  async verifyEmail(@Payload() token: string) {
    return this.authService.verifyEmail(token);
  }

  @MessagePattern('request_password_reset')
  async requestPasswordReset(@Payload() email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @MessagePattern('reset_password')
  async resetPassword(@Payload() dto: any) {
    return this.authService.resetPassword(dto);
  }

  @MessagePattern('validate_token')
  async validateToken(@Payload() token: string) {
      // Logic for validating JWT from Gateway
      // This is handled by Gateway's Guard, but Auth-service might provide verification
  }
}

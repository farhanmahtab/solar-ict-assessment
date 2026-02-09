import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('register')
  async register(@Payload() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @MessagePattern('login')
  async login(@Payload() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @MessagePattern('refresh')
  async refresh(@Payload() data: { refreshToken: string }) {
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

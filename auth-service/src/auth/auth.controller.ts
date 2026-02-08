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
  async refresh(@Payload() data: { userId: number; refreshToken: string }) {
    return this.authService.refreshTokens(data.userId, data.refreshToken);
  }

  @MessagePattern('logout')
  async logout(@Payload() userId: number) {
    return this.authService.logout(userId);
  }

  @MessagePattern('validate_token')
  async validateToken(@Payload() token: string) {
      // Logic for validating JWT from Gateway
      // This is handled by Gateway's Guard, but Auth-service might provide verification
  }
}

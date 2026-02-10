import { Injectable, UnauthorizedException, BadRequestException, OnModuleInit, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

interface NotificationService {
  notifyUserRegistered(data: any): any;
  notifyPasswordResetRequested(data: any): any;
}

@Injectable()
export class AuthService implements OnModuleInit {
  private notificationService: NotificationService;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    @Inject('NOTIFICATION_PACKAGE') private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.notificationService = this.client.getService<NotificationService>('NotificationService');
  }

  async register(dto: RegisterDto) {
    const existingEmail = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    const existingUsername = await this.prisma.user.findUnique({ where: { username: dto.username } });
    if (existingUsername) {
      throw new BadRequestException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
        otp,
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
      },
    });

    // Notify Notification Service
    await firstValueFrom(this.notificationService.notifyUserRegistered({
      email: user.email,
      username: user.username,
      validationLink: `http://localhost:4000/verify-email?token=${otp}`,
    }));

    return { message: 'User registered. Please check email for validation.' };
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        otp: token,
        otpExpiresAt: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired validation token');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isValidated: true,
        otp: null,
        otpExpiresAt: null,
      },
    });

    return { message: 'Email validated successfully. You can now log in.' };
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      // For security, don't reveal if user exists, but we'll return success anyway
      return { message: 'If your email is registered, you will receive an OTP shortly.' };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        otp,
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
      },
    });

    await firstValueFrom(this.notificationService.notifyPasswordResetRequested({
      email: user.email,
      otp,
    }));

    return { message: 'If your email is registered, you will receive an OTP shortly.' };
  }

  async resetPassword(dto: any) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
        otp: dto.otp,
        otpExpiresAt: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        otp: null,
        otpExpiresAt: null,
      },
    });

    return { message: 'Password reset successful. You can now log in.' };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isValidated) {
      throw new UnauthorizedException('Please validate your email first');
    }

    const tokens = await this.getTokens(user.id, user.username, user.role, user.email, user.createdAt.toISOString());
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedToken },
    });
  }

  async getTokens(userId: number, username: string, role: string, email: string, createdAt: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, username, role, email, createdAt },
        { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' },
      ),
      this.jwtService.signAsync(
        { sub: userId, username, role, email, createdAt },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const userId = payload.sub;

      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user || !user.refreshToken) throw new UnauthorizedException('Invalid session');

      const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isMatch) throw new UnauthorizedException('Session mismatch');

      const tokens = await this.getTokens(user.id, user.username, user.role, user.email, user.createdAt.toISOString());
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}

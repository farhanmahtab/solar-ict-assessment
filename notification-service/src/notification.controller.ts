import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('user_registered')
  handleUserRegistered(@Payload() data: { email: string; username: string; validationLink: string }) {
    this.notificationService.sendEmail(
      data.email,
      'Welcome! Please validate your email',
      `Hi ${data.username}, click here to validate: ${data.validationLink}`,
    );
  }

  @EventPattern('password_reset_requested')
  handlePasswordReset(@Payload() data: { email: string; otp: string }) {
    this.notificationService.sendEmail(
      data.email,
      'Password Reset OTP',
      `Your OTP for password reset is: ${data.otp}`,
    );
  }
}

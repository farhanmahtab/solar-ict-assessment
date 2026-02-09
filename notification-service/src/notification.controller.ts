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
      'validation',
      data,
    );
  }

  @EventPattern('password_reset_requested')
  handlePasswordReset(@Payload() data: { email: string; otp: string; username?: string }) {
    this.notificationService.sendEmail(
      data.email,
      'otp',
      data,
    );
  }
}

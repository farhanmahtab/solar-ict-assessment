import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @GrpcMethod('NotificationService', 'NotifyUserRegistered')
  handleUserRegistered(data: { email: string; username: string; validationLink: string }) {
    console.log('[Notification Service] gRPC UserRegistered:', data.email);
    this.notificationService.sendEmail(
      data.email,
      'validation',
      data,
    );
    return {};
  }

  @GrpcMethod('NotificationService', 'NotifyPasswordResetRequested')
  handlePasswordReset(data: { email: string; otp: string; username?: string }) {
    console.log('[Notification Service] gRPC PasswordResetRequested:', data.email);
    this.notificationService.sendEmail(
      data.email,
      'otp',
      data,
    );
    return {};
  }
}
